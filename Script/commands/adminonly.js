const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "onlyadmin",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "SHAHADAT SAHU",
  description: "Enable or disable admin-only mode for the group",
  commandCategory: "Admin",
  usages: "[on/off]",
  cooldowns: 3
};

module.exports.onLoad = () => {
  const dataPath = path.resolve(__dirname, "cache", "data.json");
  if (!fs.existsSync(dataPath)) {
    fs.outputJSONSync(dataPath, { adminbox: {} }, { spaces: 4 });
  } else {
    try {
      const data = fs.readJsonSync(dataPath);
      if (!data.adminbox) data.adminbox = {};
      fs.writeJsonSync(dataPath, data, { spaces: 4 });
    } catch {
      fs.outputJSONSync(dataPath, { adminbox: {} }, { spaces: 4 });
    }
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID, messageID } = event;
  const dataPath = path.resolve(__dirname, "cache", "data.json");
  const data = fs.readJsonSync(dataPath);
  const adminbox = data.adminbox || {};

  const threadInfo = await api.getThreadInfo(threadID);
  const adminIDs = threadInfo.adminIDs.map(item => item.id);
  const groupName = threadInfo.threadName || "Unnamed Group";
  const senderName =
    threadInfo.userInfo.find(u => u.id == senderID)?.name || "Unknown User";

  if (!adminIDs.includes(senderID)) {
    api.setMessageReaction("⛔", event.messageID, () => {}, true);
    return api.sendMessage(
      `This Command is Only For 👑 𝐁𝐨𝐬𝐬 𝐒𝐇𝐀𝐇𝐀𝐃𝐀𝐓 𝐒𝐀𝐇𝐔 ✅\n` +
      `You (${senderName}) are not authorized to use it!`,
      threadID,
      messageID
    );
  }


  const mode = adminbox[threadID] ? false : true;
  adminbox[threadID] = mode;
  data.adminbox = adminbox;
  fs.writeJsonSync(dataPath, data, { spaces: 4 });

  const statusText = mode
    ? " এখন থেকে শুধুমাত্র গ্রুপ অ্যাডমিনরা বট ব্যবহার করতে পারবে🔒"
    : "এখন সবাই বট ব্যবহার করতে পারবে (Admin Only মোড বন্ধ হয়েছে)✅";

  const msg =
`╭───〔⚙️ 𝗔𝗗𝗠𝗜𝗡 𝗢𝗡𝗟𝗬 𝗠𝗢𝗗𝗘 ⚙️〕───╮
│ 🌐 𝗚𝗿𝗼𝘂𝗽: ${groupName}
│ 👑 𝗔𝗰𝘁𝗶𝗼𝗻 𝗕𝘆: ${senderName}
│ ⚙️ 𝗦𝘁𝗮𝘁𝘂𝘀: ${mode ? "Admin Only 🔒" : "Public ✅"}
╰────────────────────────────╯
${statusText}`;

  api.sendMessage(msg, threadID, messageID);
  api.setMessageReaction(mode ? "🔒" : "✅", event.messageID, () => {}, true);
};