const axios = require("axios");

module.exports.config = {
  name: "quiz",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "MAHBUBU ULLASH × RUBISH API",
  description: "Bangla Quiz with dynamic coin rewards based on answer time",
  usePrefix: false,
  commandCategory: "Game",
  usages: "quiz [h]",
  cooldowns: 5,
  dependencies: { "axios": "" }
};

const timeoutDuration = 30 * 1000; // ৩০ সেকেন্ড সময়

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (args[0]?.toLowerCase() === "h") {
    return api.sendMessage(
      `🧠 Quiz Guide:\n\n` +
      `➤ Command: quiz\n` +
      `➤ Answer within 10s = +10000 Coins\n` +
      `➤ Answer within 20s = +5000 Coins\n` +
      `➤ Answer within 30s = +1000 Coins\n` +
      `➤ Wrong Answer: No Coins deducted ❌\n` +
      `➤ You can play even with 0 Coins 🎉\n\n` +
      `⚡ Good Luck!`,
      threadID, messageID
    );
  }

  try {
    const res = await axios.get("https://rubish-apihub.onrender.com/rubish/quiz-api?category=Bangla&apikey=rubish69");
    const data = res.data;

    if (!data.question || !data.answer) throw new Error("Invalid quiz data");

    const formatted =
      `╭──✦ ${data.question}\n` +
      `├‣ 𝗔) ${data.A}\n` +
      `├‣ 𝗕) ${data.B}\n` +
      `├‣ 𝗖) ${data.C}\n` +
      `├‣ 𝗗) ${data.D}\n` +
      `╰──────────────────‣\n` +
      `Reply with your answer (A/B/C/D). ⏰ 30s`;

    return api.sendMessage(formatted, threadID, async (err, info) => {
      if (err) return console.error("Send error:", err);

      const startTime = Date.now();

      const timeout = setTimeout(async () => {
        const index = global.client.handleReply.findIndex(e => e.messageID === info.messageID);
        if (index !== -1) {
          try {
            await api.unsendMessage(info.messageID);
            api.sendMessage(`⏰ Time's up!\n✅ The correct answer was: ${data.answer}`, threadID);
          } catch (e) {
            console.error("Timeout unsend error:", e);
          }
          global.client.handleReply.splice(index, 1);
        }
      }, timeoutDuration);

      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        answer: data.answer,
        startTime,
        timeout
      });
    });
  } catch (err) {
    console.error("API fetch error:", err);
    return api.sendMessage("❌ Failed to load quiz data!", threadID, messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply, Currencies }) {
  const { senderID, messageID, threadID, body } = event;
  const { increaseMoney } = Currencies;

  if (senderID !== handleReply.author) return;

  const userAnswer = body.trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(userAnswer)) {
    return api.sendMessage("⚠️ Please enter a valid option: A, B, C or D", threadID, messageID);
  }

  clearTimeout(handleReply.timeout);

  try {
    const answerTime = (Date.now() - handleReply.startTime) / 1000;
    let reward = 0;

    if (userAnswer === handleReply.answer) {
      if (answerTime <= 10) reward = 10000;
      else if (answerTime <= 20) reward = 5000;
      else if (answerTime <= 30) reward = 1000;

      await api.unsendMessage(handleReply.messageID);
      await increaseMoney(senderID, reward);
      const total = (await Currencies.getData(senderID)).money;

      return api.sendMessage(
        `✅ Correct!\n⏱ Answer Time: ${answerTime.toFixed(1)}s\n💰 You've earned ${reward} Coins!\n🏦 Balance: ${total} Coins`,
        threadID, messageID
      );
    } else {
      return api.sendMessage(
        `❌ Wrong answer!\n✅ Correct answer: ${handleReply.answer}\n⚡ No Coins deducted.`,
        threadID, messageID
      );
    }
  } catch (e) {
    console.error("Handle reply error:", e);
  }

  const index = global.client.handleReply.findIndex(e => e.messageID === handleReply.messageID);
  if (index !== -1) global.client.handleReply.splice(index, 1);
};