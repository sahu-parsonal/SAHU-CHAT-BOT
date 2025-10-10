const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
 name: "admin",
 version: "2.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Show Owner Info",
 commandCategory: "info",
 usages: "admin",
 cooldowns: 2
};

module.exports.run = async function({ api, event }) {
 const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

 const callback = () => api.sendMessage({
 body: `
┌───────────────⭓
│ 👑 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
├───────────────
│ 👤 𝐍𝐚𝐦𝐞 : 𝐒𝐚 𝐇𝐮
│ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫 : 𝐌𝐚𝐥𝐞
│ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : 𝐒𝐢𝐧𝐠𝐥𝐞
│ 🎂 𝐀𝐠𝐞 : 𝟏𝟖+
│ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : 𝐈𝐬𝐥𝐚𝐦
│ 🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : 𝐇𝐒𝐂 (𝟐𝟎𝟐𝟔)
│ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝐊𝐡𝐚𝐠𝐫𝐚𝐜𝐡𝐡𝐚𝐫𝐢
└───────────────⭓

┌───────────────⭓
│ 🌐 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
├───────────────
│ 📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:
│ https://fb.com/100001039692046
│ 💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿:
│ https://m.me/100001039692046
│ 🔰 𝗚𝗶𝘁𝗛𝘂𝗯:
│ https://github.com/shahadat-sahu
│ 📲 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:
│ https://wa.me/01882333052
└───────────────⭓

╭──────────────────⭓
│ 🕒 𝗟𝗮𝘀𝘁 𝗨𝗽𝗱𝗮𝘁𝗲
├──────────────────
│ 📅 𝗗𝗮𝘁𝗲 : ${date} 
│ ⏰ 𝗧𝗶𝗺𝗲 : ${time} 
│ 🌍 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲 : ${timezone}
╰──────────────────⭓`,
 attachment: fs.createReadStream(__dirname + "/cache/owner.jpg")
 }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/owner.jpg"));

 return request("https://i.imgur.com/8WvpgUL.jpeg")
 .pipe(fs.createWriteStream(__dirname + '/cache/admin.jpg'))
 .on('close', () => callback());
};