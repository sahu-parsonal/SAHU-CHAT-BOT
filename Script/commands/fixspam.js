module.exports.config = {
  name: "fixspam",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "gile dile ban<3",
  commandCategory: "noprefix",
  usages: '',
  cooldowns: 0,
  dependencies: {}
};

module.exports.handleEvent = async ({ event, api, Users }) => {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;
  if (senderID === api.getCurrentUserID()) return;

  const bannedWords = [
    "chudi", "baler bot", "chutiya bot", "bot bokasoda", "bot tor boss re chudi",
    "বালের বট", "ভোদার বট", "ধোনের বট", "তোর বস রে চুদি", "শাহাদাৎ যে চুদি",
    "sahadat mc", "mc Sahu", "bokachoda sahu", "fuck you", "sex", "sexy",
    "hedar bot", "বট চুদি", "crazy bot", "bc bot", "khankir polar bot",
    "bot tor heda", "হেড়ার বট", "bot paylac rồi", "con bot lòn", "cmm bot",
    "clap bot", "bot ncc", "bot oc", "bot óc", "bot óc chó", "cc bot",
    "bot tiki", "lozz bottt", "lol bot", "loz bot", "xxx", "boder bot",
    "bot lon", "x video", "xx", "x", "bot sudi", "bot sida",
    "bot fake", "decode file de", "mc bot", "bad bot", "bot cau"
  ];

  const moment = require("moment-timezone");
  const currentTime = moment.tz("Asia/Manila").format("HH:mm:ss L");
  const userName = await Users.getNameUser(senderID);

  const foundWord = bannedWords.find(word => body.toLowerCase().includes(word.toLowerCase()));
  if (!foundWord) return;

  console.log(`${userName} - chui bot: ${foundWord}`);

  // Ban user
  const userData = (await Users.getData(senderID)).data || {};
  await Users.setData(senderID, {
    data: {
      ...userData,
      banned: 1,
      reason: foundWord,
      dateAdded: currentTime
    }
  });

  global.data.userBanned.set(senderID, {
    reason: foundWord,
    dateAdded: currentTime
  });

  // Send warning
  api.sendMessage({
    body: `» Notice from Owner SA HU «\n\n${userName}, You are stupid for cursing bots so bots automatically banned you from the system`
  }, threadID);

  // Notify admins
  const admins = global.config.ADMINBOT || [];
  for (const adminID of admins) {
    api.sendMessage(
      `=== Bot Notification ===\n\n🆘 Sinner: ${userName}\n🔰 Uid: ${senderID}\n😥 Sent: ${foundWord}\n\nBanned from the system`,
      adminID
    );
  }
};

module.exports.run = async ({ event, api }) => {
  api.sendMessage(
    "( \\_/)\n( •_•)\n// >🧠\n\nGive me your brain and put it in your head.\nDo you know if it's the Noprefix command??",
    event.threadID
  );
};