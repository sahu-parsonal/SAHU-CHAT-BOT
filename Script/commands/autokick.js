const reactionKick = "❤";
const reactionCancel = "👎";

module.exports.config = {
  name: "autokick",
  version: "1.1.3",
  credits: "SHAHADAT SAHU",
  hasPermssion: 1,
  description: "Automatically kick users who use banned words.",
  usages: "<on/off/add/del/list>",
  commandCategory: "Group Management",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;

  let record = await global.modelAntiSt.findOne({ threadID });
  if (!record) record = await global.modelAntiSt.create({ threadID, data: {} });

  const data = record.data || {};
  if (!data.autoKick) data.autoKick = { words: [], enabled: false };

  switch (args[0]) {
    case "on":
      data.autoKick.enabled = true;
      await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage("✅ Auto-kick mode enabled.", threadID);

    case "off":
      data.autoKick.enabled = false;
      await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage("❎ Auto-kick mode disabled.", threadID);

    case "add":
      if (!args[1]) return api.sendMessage("⚠️ Please enter words to add.", threadID);
      const wordsToAdd = args.slice(1).join(" ").split(",").map(w => w.trim());
      const newWords = wordsToAdd.filter(w => !data.autoKick.words.includes(w));
      data.autoKick.words.push(...newWords);
      await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage(`✅ Added ${newWords.length} banned word(s).`, threadID);

    case "del":
      if (!args[1]) return api.sendMessage("⚠️ Please enter words to delete.", threadID);
      const wordsToDelete = args.slice(1).join(" ").split(",").map(w => w.trim());
      data.autoKick.words = data.autoKick.words.filter(w => !wordsToDelete.includes(w));
      await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage(`🗑️ Deleted ${wordsToDelete.length} banned word(s).`, threadID);

    case "list":
      if (!data.autoKick.words.length)
        return api.sendMessage("📜 No banned words set yet.", threadID);
      return api.sendMessage(
        "🚫 Banned Words:\n" + data.autoKick.words.map(w => `• ${w}`).join("\n"),
        threadID
      );

    default:
      return api.sendMessage(
        "☣️ [ AUTO KICK SYSTEM ] ☣️\n━━━━━━━━━━━━━━━\n\n" +
        "• autokick add <word(s)>\n" +
        "• autokick del <word(s)>\n" +
        "• autokick list\n" +
        "• autokick on/off\n\n" +
        `❤️ = Kick User\n👎 = Cancel Kick\n\n👑 By SHAHADAT SAHU`,
        threadID
      );
  }
};

module.exports.handleEvent = async ({ api, event, Threads }) => {
  const { senderID, threadID, body } = event;
  if (!body) return;

  const record = await global.modelAntiSt.findOne({ threadID });
  const data = record?.data || {};
  if (!data.autoKick || !data.autoKick.enabled) return;
  if (!data.autoKick.words || !data.autoKick.words.length) return;

  const threadInfo = global.data.threadInfo.get(threadID) || await Threads.getInfo(threadID);
  const isAdmin = (threadInfo.adminIDs || []).some(el => el.id == senderID);
  const validUIDs = [api.getCurrentUserID(), ...(global.config.ADMINBOT || []), ...(global.config.NDH || [])];
  if (isAdmin || validUIDs.includes(senderID)) return;

  const regex = new RegExp(`\\b(${data.autoKick.words.join("|")})\\b`, "i");
  const match = body.toLowerCase().match(regex);
  if (!match) return;

  console.log(`[AutoKick] Banned word detected: "${match[0]}" in thread ${threadID} by user ${senderID}`);

  api.sendMessage(
    `🚫 Banned word detected: "${match[0]}"\n\nReact ❤️ to kick, 👎 to cancel.`,
    threadID,
    (err, info) => {
      if (err) return;
      global.client.handleReaction = global.client.handleReaction || [];
      global.client.handleReaction.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        targetID: senderID
      });
    },
    event.messageID
  );
};

module.exports.handleReaction = async ({ api, event, handleReaction, Users, Threads }) => {
  const { userID, threadID, reaction } = event;
  const { targetID, messageID } = handleReaction;

  const threadInfo = global.data.threadInfo.get(threadID) || await Threads.getInfo(threadID);
  const isAdmin = (threadInfo.adminIDs || []).some(el => el.id == userID);
  const validUIDs = [api.getCurrentUserID(), ...(global.config.ADMINBOT || []), ...(global.config.NDH || [])];
  if (!isAdmin && !validUIDs.includes(userID)) return;

  if (reaction === reactionKick) {
    console.log(`[AutoKick] User ${userID} reacted ❤️ to kick ${targetID} in thread ${threadID}`);
    api.removeUserFromGroup(targetID, threadID, async (err) => {
      if (err) return api.sendMessage("⚠️ Failed to kick. Bot must be admin.", threadID);
      api.unsendMessage(messageID);
      const adminName = await Users.getNameUser(userID);
      const targetName = await Users.getNameUser(targetID);
      api.sendMessage(`✅ ${adminName} kicked ${targetName} for banned words.`, threadID);
    });
  }

  if (reaction === reactionCancel) {
    console.log(`[AutoKick] User ${userID} reacted 👎 to cancel kick of ${targetID} in thread ${threadID}`);
    return api.unsendMessage(messageID);
  }
};