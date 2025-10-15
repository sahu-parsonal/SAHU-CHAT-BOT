module.exports.config = {
  name: "tag",
  version: "1.1.0",
  hasPermssion: 2,
  credits: "Shahadat Islam",
  description: "Group এ সবাইকে নির্দিষ্ট সংখ্যায় মেনশন পাঠানো",
  commandCategory: "group",
  usages: "/tag [text] [amount]",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;
  const threadInfo = await api.getThreadInfo(threadID);
  const memberIDs = threadInfo.participantIDs;

  let repeatCount = 1;
  let text = "সবাই চিপা থেকে বের হও 🐸"; // default text

  if (args.length > 0) {
    const lastArg = args[args.length - 1];
    if (!isNaN(lastArg)) {
      repeatCount = parseInt(lastArg);
      args.pop();
    }
    if (args.length > 0) text = args.join(" ");
  }

  const mentions = memberIDs
    .filter(id => id != api.getCurrentUserID())
    .map(id => ({ tag: "@everyone", id }));

  for (let i = 0; i < repeatCount; i++) {
    await api.sendMessage({
      body: `📢 @everyone\n${text}`,
      mentions
    }, threadID);

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
};
