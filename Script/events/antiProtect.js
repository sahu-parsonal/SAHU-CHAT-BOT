const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "antiProtect",
  version: "1.3.0",
  credits: "SHAHADAT SAHU",
  description: "Protects group name and photo",
  eventType: ["log:thread-name", "log:thread-icon"], // nickname protection removed
  cooldowns: 3
};

module.exports.run = async function({ api, event, Threads }) {
  try {
    const threadID = event.threadID;
    const senderID = event.author || event.senderID;

    // Cache directory
    const cacheDir = `${__dirname}/../../cache/antiProtect/`;
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const settingsFile = `${cacheDir}settings.json`;

    // Load settings
    let settings = {};
    if (fs.existsSync(settingsFile)) {
      try { settings = JSON.parse(fs.readFileSync(settingsFile)); } catch {}
    }
    if (settings[threadID] === false) return;

    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = (threadInfo.adminIDs || []).map(u => u.id);
    const botOwners = ["100001039692046"]; // আপনার বট / মূল user ID
    const botID = api.getCurrentUserID();
    const isAdmin = adminIDs.includes(senderID) || botOwners.includes(senderID);
    const botIsAdmin = adminIDs.includes(botID);

    const cacheFile = `${cacheDir}${threadID}.json`;

    // প্রথমবার snapshot তৈরি
    if (!fs.existsSync(cacheFile)) {
      const snapshot = {
        name: threadInfo.threadName || "Unnamed Group",
        imageSrc: threadInfo.imageSrc || null
      };
      fs.writeFileSync(cacheFile, JSON.stringify(snapshot, null, 2));
      return;
    }

    // Admin পরিবর্তন করলে নতুন snapshot save করা
    if (isAdmin) {
      const newSnapshot = {
        name: threadInfo.threadName,
        imageSrc: threadInfo.imageSrc
      };
      fs.writeFileSync(cacheFile, JSON.stringify(newSnapshot, null, 2));
      return;
    }

    // Non-admin tried to change
    const oldData = JSON.parse(fs.readFileSync(cacheFile));

    switch (event.logMessageType) {
      case "log:thread-name": {
        await api.setTitle(oldData.name, threadID).catch(() => {});
        return api.sendMessage(`🚫 Someone tried to change the group name!\nName reverted → "${oldData.name}" ✅`, threadID);
      }
      case "log:thread-icon": {
        try {
          if (oldData.imageSrc) {
            const res = await axios.get(oldData.imageSrc, { responseType: "arraybuffer" });
            const buffer = Buffer.from(res.data, "binary");
            await api.changeGroupImage(buffer, threadID);
          } else {
            await api.changeGroupImage(null, threadID).catch(() => {});
          }
        } catch {}
        return api.sendMessage(`🚫 Someone tried to change the group photo!\nPrevious photo restored ✅`, threadID);
      }
      default:
        return;
    }
  } catch (error) {
    console.log("AntiProtect Error:", error);
  }
};