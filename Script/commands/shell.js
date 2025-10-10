module.exports.config = {
  name: "shell",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "John Lester",
  description: "running shell",
  commandCategory: "System",
  usages: "[shell]",
  cooldowns: 0,
  dependencies: {
    "child_process": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const { exec } = require("child_process");
  let text = args.join(" ");

  exec(text, (error, stdout, stderr) => {
    if (error) {
      api.sendMessage(`Error:\n${error.message}`, event.threadID, event.messageID);
      return;
    }
    if (stderr) {
      api.sendMessage(`Stderr:\n${stderr}`, event.threadID, event.messageID);
      return;
    }
    api.sendMessage(`✅ Output:\n${stdout}`, event.threadID, event.messageID);
  });
};
