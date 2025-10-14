const fs = global.nodemodule["fs-extra"];
const path = global.nodemodule["path"];

module.exports.config = {
  name: "autoreplybot",
  version: "6.1.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
  description: "Auto-response bot",
  commandCategory: "No Prefix",
  usages: "[any trigger]",
  cooldowns: 3,
};

// Typing effect function
async function sendTyping(api, threadID, time = 1500) {
  try {
    await api.sendTypingIndicator(threadID, true); // টাইপিং শুরু
    await new Promise(resolve => setTimeout(resolve, time)); // কিছু সময় ধরে টাইপিং
    await api.sendTypingIndicator(threadID, false); // টাইপিং বন্ধ
  } catch (err) {
    console.error("Typing error:", err);
  }
}

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return; 
  const name = await Users.getNameUser(senderID);
  const msg = body.toLowerCase().trim();

  // Typing times per trigger (optional, default 1500ms)
  const typingTimes = {
    "hi": 1500,
    "good morning": 2000,
    "bye": 1200,
    "i love you": 2500,
    "assalamualaikum": 1500,
    // চাইলে আরো trigger add করতে পারবেন
  };

  const responses = {
    "miss you": "অরেক বেডারে Miss না করে xan মেয়ে হলে বস শাহাদৎ রে হাঙ্গা করো😶👻😘",
    "kiss de": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
    "👍": "সর এখান থেকে লাইকার আবাল..!🐸🤣👍⛏️",
    "help": "Prefix de sala",
    "hi": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
    "bc": "SAME TO YOU😊",
    "pro": "Khud k0o KYa LeGend SmJhTi Hai 😂",
    "good morning": "GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚",
    "tor ball": "~ এখনো বাল উঠে নাই নাকি তোমার?? 🤖",
    "sahu": "উনি এখন কাজে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!😘",
    "owner": "‎[𝐎𝐖𝐍𝐄ର:☞ Shahadat Islam☜\nFacebook: https://www.facebook.com/profile.php?id=100001039692046\nWhatsApp: +8801882333052",
    "admin": "He is SAHU তাকে সবাই Cyber Bot Team Saport Admin হিসেবে চিনে😘☺️",
    "babi": "এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.",
    "chup": "তুই চুপ চুপ কর পাগল ছাগল",
    "assalamualaikum": "Walaikum Assalam 💫",
    "kiss me": "তুমি পঁচা তোমাকে কিস দিবো না 🤭",
    "thanks": "এতো ধন্যবাদ না দিয়ে আমার বস SAHU রে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵",
    "i love you": "মেয়ে হলে আমার বস SAHU এর ইনবক্সে এখুনি গুঁতা দিন🫢😻",
    "by": "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি..!🌚🌶️",
    "ami shahadat": "হ্যা বস কেমন আছেন..?☺️",
    "bot er baccha": "আমার বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️",
    "tor nam ki": "MY NAME IS ~সা্ঁহু্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁটঁ~😘🌺",
    "pic de": "এন থেকে সর দুরে গিয়া মর😒",
    "cudi": "এত চোদা চুদি করস কেনো..!🥱🌝🌚",
    "bal": "রাগ করে না সোনা পাখি 🥰",
    "heda": "এতো রাগ শরীরের জন্য ভালো না 🥰",
    "boda": "ভাই তুই এত হাসিস না..!🌚🤣",
    "love you": "ভালোবাসা নামক আবলামী করতে চাইলে Boss SAHU এর ইনবক্সে গুতা দিন 😘",
    "kire ki koros": "তোমার কথা ভাবতে ছি জানু",
    "kire bot": "হ্যাঁ সব কেমন আছেন আপনার ওই খানে উম্মাহ 😘😽🙈"
  };

  if (responses[msg]) {
    const typingTime = typingTimes[msg] || 1500; // যদি নির্দিষ্ট টাইম না থাকে তবে default 1.5s
    await sendTyping(api, threadID, typingTime);
    return api.sendMessage(responses[msg], threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  return this.handleEvent({ api, event, Users });
};