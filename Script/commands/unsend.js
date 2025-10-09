module.exports.config = {
  name: "unsend",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Unsend bot's sent message",
  commandCategory: "system",
  usages: "unsend",
  cooldowns: 0
};

const lang = {
  returnCant: "কি unsent করমু replig করে বলো সুনা🫰",
  missingReply: "কি unsent করমু replig করে বলো সুনা🫰."
};

module.exports.run = async function ({ api, event }) {
  if (event.type !== "message_reply")
    return api.sendMessage(lang.missingReply, event.threadID, event.messageID);

  if (event.messageReply.senderID !== api.getCurrentUserID())
    return api.sendMessage(lang.returnCant, event.threadID, event.messageID);

  return api.unsendMessage(event.messageReply.messageID);
};


module.exports.handleEvent = async function ({ api, event }) {
  try {
    const msg = (event.body || "").trim().toLowerCase();
    const cmd = module.exports.config.name.toLowerCase();

    if (msg === cmd || prefixes.some(p => msg === p + cmd)) {
      if (event.type !== "message_reply")
        return api.sendMessage(lang.missingReply, event.threadID, event.messageID);

      if (event.messageReply.senderID !== api.getCurrentUserID())
        return api.sendMessage(lang.returnCant, event.threadID, event.messageID);

      return api.unsendMessage(event.messageReply.messageID);
    }
  } catch (err) {
    console.error(err);
  }
};