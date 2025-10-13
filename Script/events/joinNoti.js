module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.4",
  credits: "SHAHADAT SAHU",
  description: "Welcome message with optional image/video",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const paths = [
    join(__dirname, "cache", "joinGif"),
    join(__dirname, "cache", "randomgif")
  ];
  for (const path of paths) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }
};

module.exports.run = async function({ api, event }) {
  const fs = require("fs");
  const path = require("path");
  const { threadID } = event;
  
  const botPrefix = global.config.PREFIX || "/";
  const botName = global.config.BOTNAME || "𝗦𝗮𝗵𝘂 𝗙𝗮𝗺𝗼𝘂𝘀 𝗕𝗼𝘁";

  // 🟢 যখন বটকে গ্রুপে এড করা হয়
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${botPrefix} ] • ${botName}`, threadID, api.getCurrentUserID());

    api.sendMessage("এ্ঁড্ঁ দে্ঁয়া্ঁর্ঁ সা্ঁথে্ঁ সা্ঁথে্ঁ চ্ঁলে্ঁ এ্ঁসে্ঁছি ~সা্ঁহু্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁটঁ~ এঁখঁনঁ তোঁমাঁদেঁরঁ সাঁথেঁ জ্ঁমি্ঁয়ে্ঁ আঁড্ডাঁ দি্ঁব্ঁ...!😘", threadID, () => {
      const randomGifPath = path.join(__dirname, "cache", "randomgif");
      const allFiles = fs.readdirSync(randomGifPath).filter(file =>
        [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => file.endsWith(ext))
      );

      const selected = allFiles.length > 0 
        ? fs.createReadStream(path.join(randomGifPath, allFiles[Math.floor(Math.random() * allFiles.length)])) 
        : null;

      const messageBody = `╭•┄┅═══❁🌺❁═══┅┄•╮
     আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ
╰•┄┅═══❁🌺❁═══┅┄•╯
🌸 আপনাদের গ্রুপে  
~সা্ঁহু্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁটঁ~😘🌺  
এড করার জন্য আন্তরিক ধন্যবাদ 🤗🖤  
🌸 আশা করি আপনারা এই বটটি থেকে  
অন্যরকম এক্সপেরিয়েন্স ও ইনজয় পাবেন..! 🌺
✦───────────────✦
‼️ কমান্ড লিস্ট দেখতে:
➤ ${botPrefix}Help  
➤ ${botPrefix}Info  
➤ ${botPrefix}Admin  
✦───────────────✦
🌸যেকোনো অভিযোগ অথবা সাহায্যের জন্য  
এডমিন SHAHADAT SAHU কে নক করতে পারেন😘
➤ Messenger: https://m.me/100001039692046  
➤ WhatsApp: https://wa.me/100001039692046  
❖⋆═══════════════════⋆❖  
     𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➢ 𝐒𝐀𝐇𝐔  
❖⋆═══════════════════⋆❖`;

      if (selected) {
        api.sendMessage({ body: messageBody, attachment: selected }, threadID);
      } else {
        api.sendMessage(messageBody, threadID);
      }
    });

    return;
  }

  // 🟣 যখন নতুন ইউজার জয়েন করে
  try {
    const { createReadStream, readdirSync } = global.nodemodule["fs-extra"];
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    let mentions = [], nameArray = [], memLength = [], i = 0;

    for (let id in event.logMessageData.addedParticipants) {
      const userName = event.logMessageData.addedParticipants[id].fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id });
      memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    let msg = (typeof threadData.customJoin === "undefined") ? `╭•┄┅═══❁🌺❁═══┅┄•╮  
     আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ🩷আ্ঁলা্ঁই্ঁকু্ঁম্ঁ  
╰•┄┅═══❁🌺❁═══┅┄•╯  

✨ প্রিয় নতুন মেম্বার,  
প্রথমেই আমাদের এই গ্রুপে আপনাকে স্বাগতম জানাচ্ছি! 🌸  

হাসি, আনন্দ আর ঠাট্টায় গড়ে উঠুক  
চিরস্থায়ী বন্ধুত্বের বন্ধন~🌺  
ভালোবাসা আর সম্পর্ক থাকুক আজীবন~💞  

🌸কিছু নিয়ম মেনে চলুন🌼

➤ আশা করি আপনি এখানে হাসি-মজা করে
আড্ডা দিতে ভালোবাসবেন!🌺
➤ উস্কানিমূলক কথা বা খারাপ ব্যবহার করবেন না!🚫
➤ গ্রুপে কোন প্রকার ১৮+ ভিডিও ফটো কথা বার্তা বলবেন না !⚠️
➤ অপ্রয়োজনে বারবার ট্যাগ করবেন না!❗
➤ এডমিন পারমিশন ছাড়া কোন প্রকার কিছু প্রমোশন করবেন না! ‼️
➤ রুলস না মানলে রিমুভ করলে কিছু বলতে পারবেন না!📛
➤ সবার সাথে মিলেমিশে থাকবেন!💐
➤ গ্রুপ এডমিনের কথা শুনবেন ও রুলস মেনে চলবেন!✅
➤ কোন সমস্যা হলে অবশ্যই এডমিনকে জানাবেন!❤️‍🩹

💌 প্রিয় {name},  
আপনি এই গ্রুপের {soThanhVien} তম সদস্য! ✨  

›› গ্রুপ: {threadName}  

    🌸 𝐖 𝐄 𝐋 𝐂 𝐎 𝐌 𝐄 💝   
❀──────────────❀  
~ সা্ঁহু্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁটঁ ~ 🌺😘  
❀──────────────❀` : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName);

    const joinGifPath = path.join(__dirname, "cache", "joinGif");
    const files = readdirSync(joinGifPath).filter(file =>
      [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => file.endsWith(ext))
    );
    const randomFile = files.length > 0 
      ? createReadStream(path.join(joinGifPath, files[Math.floor(Math.random() * files.length)])) 
      : null;

    return api.sendMessage(
      randomFile ? { body: msg, attachment: randomFile, mentions } : { body: msg, mentions },
      threadID
    );
  } catch (e) {
    console.error(e);
  }
};