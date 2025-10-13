const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "upt",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Monitoring for your Messenger robot 24 hour active",
    commandCategory: "monitor",
    usages: "[upt]",
    cooldowns: 5
};

module.exports.onLoad = () => {
    const dir = path.join(__dirname, "noprefix");
    const imgPath = path.join(dir, "upt.png");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(imgPath)) {
        request("https://i.imgur.com/vn4rXA4.jpg").pipe(fs.createWriteStream(imgPath));
    }
};

module.exports.run = async function({ api, event }) {
    const { body, threadID, messageID } = event;
    if (!body) return;
    const dir = path.join(__dirname, "noprefix");
    const imgPath = path.join(dir, "upt.png");
    const prefix = (global.config.PREFIX || "").trim();
    let text = body.trim();
    if (text === "upt" || (prefix && text === prefix + "upt")) {
        let time = process.uptime();
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time % 3600) / 60);
        let seconds = Math.floor(time % 60);
        if (!fs.existsSync(imgPath)) {
            request("https://i.imgur.com/vn4rXA4.jpg").pipe(fs.createWriteStream(imgPath));
        }
        const message = `
╔═══════════════════╗
║      🕧 𝗨𝗣𝗧𝗜𝗠𝗘 𝗥𝗢𝗕𝗢𝗧 🕧       
╠═══════════════════╣
║ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗥𝗨𝗡𝗡𝗜𝗡𝗚 𝗧𝗜𝗠𝗘         
╠═══════════════════╣
║ ⏱ 𝗛𝗢𝗨𝗥𝗦   : ${hours}
║ ⏱ 𝗠𝗜𝗡𝗨𝗧𝗘 : ${minutes}
║ ⏱ 𝗦𝗘𝗖𝗢𝗡𝗗 : ${seconds}
╚═══════════════════╝
`;
        return api.sendMessage({
            body: message,
            attachment: fs.createReadStream(imgPath)
        }, threadID, messageID);
    }
};