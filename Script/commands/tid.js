module.exports.config = {
  name: "tid",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Show current thread ID",
  commandCategory: "group",
  usages: "tid",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;
  if (!body) return;

  // No prefix check (only "tid")
  if (body.trim().toLowerCase() === "tid") {
    return api.sendMessage(`🆔 Thread ID: ${threadID}`, threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  // Prefix command (must be only "tid")
  if (args.length === 0) {
    return api.sendMessage(`🆔 Thread ID: ${threadID}`, threadID, messageID);
  }
};
