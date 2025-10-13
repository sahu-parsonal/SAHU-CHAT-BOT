module.exports.config = {
  name: "autoreset2",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Automatically reset the system at a specific time",
  commandCategory: "System",
  cooldowns: 5
};
module.exports.handleEvent = async function ({
  api,
  event,
  args,
  Users,
  Threads
}) {
  const moment = require("moment-timezone");
  const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
  const day = moment.tz("Asia/Dhaka").format("dddd");
  const colors = ["[33m", "[34m", "[35m", "[36m", "[31m", "[1m"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const adminIDs = global.config.ADMINBOT;
  console.log("[36m🕓 TIME 🕓: " + color + timeNow + "[31m" + ' ➣ ' + "[0m" + day);
  const seconds = moment.tz("Asia/Dhaka").format("ss");
  if (timeNow === `00:59:${seconds}` && seconds < 5) {
    for (let admin of adminIDs) {
      setTimeout(() => {
        api.sendMessage(`[ SYSTEM NOTICE ⚙️ ]\nSystem will automatically restart now.\n🕓 Current Time: ${timeNow}`, admin, () => process.exit(1));
      }, 1000);
    }
  }
};
module.exports.run = async function ({
  api,
  event
}) {
  const moment = require("moment-timezone");
  const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
  api.sendMessage(`Current Time: ${timeNow}`, event.threadID);
};