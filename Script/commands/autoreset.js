const fs = require("fs");
const moment = require("moment-timezone");

module.exports.config = {
  name: "autoreset",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Automatically restart the system every hour",
  commandCategory: "System",
  cooldowns: 5
};

let started = false;

module.exports.handleEvent = async function ({ api, event }) {
  if (started) return;
  started = true;

  const adminIDs = global.config.ADMINBOT;

  setInterval(() => {
    const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
    const seconds = parseInt(moment.tz("Asia/Dhaka").format("ss"));

    console.log(timeNow);

    const restartTimes = [
      `01:00:${seconds}`,
      `02:00:${seconds}`,
      `03:00:${seconds}`,
      `04:00:${seconds}`,
      `05:00:${seconds}`,
      `06:00:${seconds}`,
      `07:00:${seconds}`,
      `08:00:${seconds}`,
      `09:00:${seconds}`,
      `10:00:${seconds}`,
      `11:00:${seconds}`,
      `12:00:${seconds}`,
      `13:00:${seconds}`,
      `14:00:${seconds}`,
      `15:00:${seconds}`,
      `16:00:${seconds}`,
      `17:00:${seconds}`,
      `18:00:${seconds}`,
      `19:00:${seconds}`,
      `20:00:${seconds}`,
      `21:00:${seconds}`,
      `22:00:${seconds}`,
      `23:00:${seconds}`,
      `00:00:${seconds}`
    ];

    if (restartTimes.includes(timeNow) && seconds < 5) {
      for (let admin of adminIDs) {
        api.sendMessage(
          `⚡ System Notice ⚡\nCurrent Time: ${timeNow}\nSystem is restarting...`,
          admin,
          () => {
            // Restart flag for group message
            fs.writeFileSync(__dirname + "/autoreset_flag.json", JSON.stringify({
              groupID: "2056569868083458"
            }));
            process.exit(1);
          }
        );
      }
    }
  }, 1000);
};

module.exports.run = async function ({ api, event }) {
  const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
  api.sendMessage(`Current Time: ${timeNow}`, event.threadID);
};

// After restart - send message to group
module.exports.onLoad = function ({ api }) {
  const path = __dirname + "/autoreset_flag.json";
  if (fs.existsSync(path)) {
    try {
      const data = JSON.parse(fs.readFileSync(path));
      api.sendMessage(
        `✅ Bot Restarted Successfully!\nPowered by Boss SAHU 🔥`,
        data.groupID
      );
      fs.unlinkSync(path);
    } catch (err) {
      console.log("AutoReset flag error:", err);
    }
  }
};