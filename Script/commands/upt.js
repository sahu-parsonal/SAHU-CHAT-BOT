const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "upt",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "CK Monitoring for your Messenger bot",
  commandCategory: "monitor",
  usages: "upt or prefix+upt",
  cooldowns: 5
};

module.exports.onLoad = () => {
  const dir = __dirname + "/noprefix/";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const img = dir + "upt.png";
  if (!fs.existsSync(img)) {
    request("https://i.imgur.com/vn4rXA4.jpg").pipe(fs.createWriteStream(img));
  }
};


module.exports.handleEvent = async function ({ api, event }) {
  const fs = require("fs-extra");
  const prefix = global.config.PREFIX || ""; 
  const msg = event.body ? event.body.trim() : "";
  const img = __dirname + "/noprefix/upt.png";

  if (msg !== "upt" && msg !== `${prefix}upt`) return;
  if (!fs.existsSync(img)) {
    request("https://i.imgur.com/vn4rXA4.jpg").pipe(fs.createWriteStream(img));
  }

  const time = process.uptime();
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  const message = `
╔═══════════════════╗
║      🕧 𝗨𝗣𝗧𝗜𝗠𝗘 𝗥𝗢𝗕𝗢𝗧 🕧
╠═══════════════════╣
║ 𝗕𝗢𝗧 𝗢𝗡𝗟𝗜𝗡𝗘 𝗧𝗜𝗠𝗘
╠═══════════════════╣
║ ⏱ 𝗛𝗢𝗨𝗥𝗦   : ${hours}
║ ⏱ 𝗠𝗜𝗡𝗨𝗧𝗘 : ${minutes}
║ ⏱ 𝗦𝗘𝗖𝗢𝗡𝗗 : ${seconds}
╚═══════════════════╝
`;


  return api.sendMessage(
    {
      body: message,
      attachment: fs.createReadStream(img)
    },
    event.threadID,
    event.messageID
  );
};

module.exports.run = async function ({ api, event }) {
  const fs = require("fs-extra");
  const img = __dirname + "/noprefix/upt.png";

  const time = process.uptime();
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const message = `
╔═══════════════════╗
║      🕧 𝗨𝗣𝗧𝗜𝗠𝗘 𝗥𝗢𝗕𝗢𝗧 🕧
╠═══════════════════╣
║ 𝗕𝗢𝗧 𝗢𝗡𝗟𝗜𝗡𝗘 𝗧𝗜𝗠𝗘
╠═══════════════════╣
║ ⏱ 𝗛𝗢𝗨𝗥𝗦   : ${hours}
║ ⏱ 𝗠𝗜𝗡𝗨𝗧𝗘 : ${minutes}
║ ⏱ 𝗦𝗘𝗖𝗢𝗡𝗗 : ${seconds}
╚═══════════════════╝
`;

  return api.sendMessage(
    {
      body: message,
      attachment: fs.createReadStream(img)
    },
    event.threadID,
    event.messageID
  );
};