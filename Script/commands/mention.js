module.exports.config = {
  name: "m",
  version: "3.0.0",
  hasPermssion: 2,
  credits: "SHAHADAT SAHU",
  description: "Reply বা Mention করে কাউকে বারবার Mention দিন",
  commandCategory: "group",
  usages: "reply m [count] বা /m @mention [count]",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageReply, mentions } = event;

  let mentionID, mentionName;

  // যদি reply দেওয়া থাকে
  if (messageReply && Object.keys(mentions).length === 0) {
    mentionID = messageReply.senderID;
    const userInfo = await api.getUserInfo(mentionID);
    mentionName = userInfo[mentionID].name || "Unknown User";
  } 
  // যদি @mention দেওয়া থাকে
  else if (Object.keys(mentions).length > 0) {
    mentionID = Object.keys(mentions)[0];
    mentionName = mentions[mentionID];
  } 
  else {
    return api.sendMessage(
      "Boss, কাউকে Mention করুন বা তার মেসেজে Reply দিন!\n\nExample:\n• reply করে লিখুন: m 5\n• /m @SAHU 10",
      threadID
    );
  }

  // কতবার পাঠানো হবে
  let countArg = args[args.length - 1];
  let count = parseInt(countArg);
  const repeatCount = isNaN(count) ? 1 : Math.min(count, 100);

  for (let i = 0; i < repeatCount; i++) {
    try {
      await api.sendMessage({
        body: `@${mentionName}\nচিপা থেকে বের হও 🐸🔪`,
        mentions: [{
          id: mentionID,
          tag: mentionName
        }]
      }, threadID);

      // ১ সেকেন্ড বিরতি
      if (i < repeatCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (err) {
      console.error("File not working, call boss SAHU", err);
      break;
    }
  }
};