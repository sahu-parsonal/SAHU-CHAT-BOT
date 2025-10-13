const modelAntiSt = require("../database/models/modelAntiSt");

module.exports.handleEvent = async ({ api, event, Threads }) => {
  const { senderID, threadID, body } = event;
  if (!body) return;

  const record = await modelAntiSt.findOne({ threadID });
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

  api.sendMessage(
    `🚫 Banned word detected: "${match[0]}"\n\nReact ❤️ to kick, 👎 to cancel.`,
    threadID,
    (err, info) => {
      if (err) return;
      global.client.handleReaction = global.client.handleReaction || [];
      global.client.handleReaction.push({
        name: "autokick",
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

  if (reaction === "❤") {
    api.removeUserFromGroup(targetID, threadID, async (err) => {
      if (err) return api.sendMessage("⚠️ Failed to kick. Bot must be admin.", threadID);
      api.unsendMessage(messageID);
      const adminName = await Users.getNameUser(userID);
      const targetName = await Users.getNameUser(targetID);
      api.sendMessage(`✅ ${adminName} kicked ${targetName} for banned words.`, threadID);
    });
  }

  if (reaction === "👎") {
    return api.unsendMessage(messageID);
  }
};
