module.exports.config = {
  name: "banned",
  version: "2.0.6",
  hasPermssion: 2,
  credits: "SHAHADAT SAHU",
  description: "Permanently ban members from the group",
  commandCategory: "group",
  usages: "[key]",
  cooldowns: 5,
  info: [
    {
      key: '[tag] or [reply message] "reason"',
      prompt: 'Warn a user before banning',
      type: '',
      example: 'banned [tag] "reason for warning"'
    },
    {
      key: 'listban',
      prompt: 'See the list of banned members in the group',
      type: '',
      example: 'banned listban'
    },
    {
      key: 'unban',
      prompt: 'Remove a user from the banned list',
      type: '',
      example: 'banned unban [userID]'
    },
    {
      key: 'view',
      prompt: 'Check warnings for yourself, a tagged user, or all members',
      type: '',
      example: 'banned view [@tag] / banned view'
    },
    {
      key: 'reset',
      prompt: 'Reset all banned and warning data in the group',
      type: '',
      example: 'banned reset'
    }
  ]
};

module.exports.run = async function({ api, args, event, utils }) {
  const { threadID, senderID, messageID, mentions, type, messageReply } = event;
  const fs = require("fs-extra");
  const bansFile = __dirname + `/cache/bans.json`;

  if (!fs.existsSync(bansFile)) {
    fs.writeFileSync(bansFile, JSON.stringify({ warns: {}, banned: {} }));
  }

  const bans = JSON.parse(fs.readFileSync(bansFile));

  if (!bans.warns[threadID]) bans.warns[threadID] = [];
  if (!bans.banned[threadID]) bans.banned[threadID] = [];

  const info = await api.getThreadInfo(threadID);
  const isAdmin = info.adminIDs.some(ad => ad.id == senderID) || global.config.ADMINBOT.includes(senderID);
  const botAdmin = info.adminIDs.some(ad => ad.id == api.getCurrentUserID());

  if (!botAdmin) return api.sendMessage('The bot needs group admin rights.', threadID, messageID);

  if (args[0] === "view") {
    if (!args[1]) {
      const myWarns = bans.warns[threadID][senderID];
      if (!myWarns) return api.sendMessage('✅ You have never been warned', threadID, messageID);
      return api.sendMessage(`❎ You have been warned for: ${myWarns.join(", ")}`, threadID, messageID);
    }

    if (Object.keys(mentions).length === 1) {
      const id = Object.keys(mentions)[0];
      const name = mentions[id].replace(/@/g, "");
      const reasonArr = bans.warns[threadID][id] || ["Never been warned"];
      return api.sendMessage(`${name} has been warned for: ${reasonArr.join(", ")}`, threadID, messageID);
    }

    if (args[1] === "all") {
      const allWarns = bans.warns[threadID];
      let msg = "";
      for (const id in allWarns) {
        const name = (await api.getUserInfo(id))[id].name;
        msg += `${name} : ${allWarns[id].join(", ")}\n`;
      }
      return api.sendMessage(msg || "✅ No warnings in the group yet", threadID, messageID);
    }
  }

  if (args[0] === "unban") {
    if (!isAdmin) return api.sendMessage('❎ You are not allowed to unban', threadID, messageID);
    const id = parseInt(args[1]);
    if (!id) return api.sendMessage("❎ Enter the userID to remove from banned list", threadID, messageID);
    if (!bans.banned[threadID].includes(id)) return api.sendMessage("✅ This user is not banned", threadID, messageID);
    bans.banned[threadID] = bans.banned[threadID].filter(uid => uid != id);
    delete bans.warns[threadID][id];
    fs.writeFileSync(bansFile, JSON.stringify(bans, null, 2));
    return api.sendMessage(`✅ Removed user ${id} from banned list`, threadID, messageID);
  }

  if (args[0] === "listban") {
    let msg = "";
    for (const id of bans.banned[threadID]) {
      const name = (await api.getUserInfo(id))[id].name;
      msg += `╔ Name: ${name}\n╚ ID: ${id}\n`;
    }
    return api.sendMessage(msg || "✅ No banned members", threadID, messageID);
  }

  if (args[0] === "reset") {
    if (!isAdmin) return api.sendMessage('❎ You are not allowed to reset', threadID, messageID);
    bans.warns[threadID] = {};
    bans.banned[threadID] = [];
    fs.writeFileSync(bansFile, JSON.stringify(bans, null, 2));
    return api.sendMessage("✅ All group data has been reset", threadID, messageID);
  }

  if (!isAdmin) return api.sendMessage('❎ You are not allowed to ban', threadID, messageID);

  let iduser = [];
  let reason = "";

  if (type === "message_reply") {
    iduser.push(messageReply.senderID);
    reason = args.join(" ").trim() || "No reason given";
  } else if (Object.keys(mentions).length !== 0) {
    iduser = Object.keys(mentions);
    reason = args.join(" ").replace(/@/g, "").trim() || "No reason given";
  } else return utils.throwError(this.config.name, threadID, messageID);

  const arrayTag = [];
  const arrayName = [];

  for (const id of iduser) {
    const name = (await api.getUserInfo(id))[id].name;
    arrayTag.push({ id: parseInt(id), tag: name });
    arrayName.push(name);

    if (!bans.warns[threadID][id]) bans.warns[threadID][id] = [];
    bans.warns[threadID][id].push(reason);

    if (!bans.banned[threadID].includes(parseInt(id))) {
      bans.banned[threadID].push(parseInt(id));
      await api.removeUserFromGroup(parseInt(id), threadID);
    }
  }

  fs.writeFileSync(bansFile, JSON.stringify(bans, null, 2));
  return api.sendMessage({ body: `Banned members: ${arrayName.join(", ")} permanently for: ${reason}`, mentions: arrayTag }, threadID, messageID);
};
