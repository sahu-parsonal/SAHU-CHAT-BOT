const autoHandle = require("../../includes/handle/autokickHandle");
const modelAntiSt = require("../../includes/database/models/modelAntiSt");

const reactionKick = "❤";
const reactionCancel = "👎";

module.exports.config = {
  name: "autokick",
  version: "1.2.0",
  credits: "SHAHADAT SAHU",
  hasPermssion: 1,
  description: "Automatically kick users who use banned words.",
  usages: "<on/off/add/del/list>",
  commandCategory: "Group Management",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;
  let record = await modelAntiSt.findOne({ threadID });
  if (!record) record = await modelAntiSt.create({ threadID, data: {} });

  const data = record.data || {};
  if (!data.autoKick) data.autoKick = { words: [], enabled: false };

  switch (args[0]) {
    case "on":
      data.autoKick.enabled = true;
      await modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage("✅ Auto-kick mode enabled.", threadID);
    case "off":
      data.autoKick.enabled = false;
      await modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage("❎ Auto-kick mode disabled.", threadID);
    case "add":
      if (!args[1]) return api.sendMessage("⚠️ Please enter words to add.", threadID);
      const wordsToAdd = args.slice(1).join(" ").split(",").map(w => w.trim());
      const newWords = wordsToAdd.filter(w => !data.autoKick.words.includes(w));
      data.autoKick.words.push(...newWords);
      await modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage(`✅ Added ${newWords.length} banned word(s).`, threadID);
    case "del":
      if (!args[1]) return api.sendMessage("⚠️ Please enter words to delete.", threadID);
      const wordsToDelete = args.slice(1).join(" ").split(",").map(w => w.trim());
      data.autoKick.words = data.autoKick.words.filter(w => !wordsToDelete.includes(w));
      await modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage(`🗑️ Deleted ${wordsToDelete.length} banned word(s).`, threadID);
    case "list":
      if (!data.autoKick.words.length) return api.sendMessage("📜 No banned words set yet.", threadID);
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

module.exports.handleEvent = autoHandle.handleEvent;
module.exports.handleReaction = autoHandle.handleReaction;