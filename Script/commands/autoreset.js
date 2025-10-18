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
let intervalId = null;

module.exports.handleEvent = async function ({ api, event }) {
  if (started) return;
  started = true;

  const adminIDs = global.config.ADMINBOT;

  // Clear any existing interval to prevent duplicates
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    const timeNow = moment().tz("Asia/Dhaka").format("HH:mm:ss");
    const currentHour = moment().tz("Asia/Dhaka").format("HH");
    const currentMinute = moment().tz("Asia/Dhaka").format("mm");
    const currentSecond = moment().tz("Asia/Dhaka").format("ss");

    console.log("AutoReset Check:", timeNow);

    // Check if it's exactly the hour (00 minutes and 00-05 seconds)
    if (currentMinute === "00" && parseInt(currentSecond) < 5) {
      console.log(`AutoReset: Triggering restart at ${timeNow}`);
      
      for (let admin of adminIDs) {
        api.sendMessage(
          `⚡ System Notice ⚡\nCurrent Time: ${timeNow}\nSystem is restarting...`,
          admin,
          (err) => {
            if (err) {
              console.error("Error sending message to admin:", err);
            }
            // Create restart flag
            const flagData = {
              groupID: "2056569868083458",
              restartTime: timeNow
            };
            fs.writeFileSync(__dirname + "/autoreset_flag.json", JSON.stringify(flagData, null, 2));
            
            // Restart after a short delay to ensure messages are sent
            setTimeout(() => {
              process.exit(1);
            }, 2000);
          }
        );
      }
    }
  }, 1000);
};

module.exports.run = async function ({ api, event }) {
  const timeNow = moment().tz("Asia/Dhaka").format("HH:mm:ss");
  const nextRestart = moment().tz("Asia/Dhaka").add(1, 'hour').startOf('hour').format("HH:mm:ss");
  
  api.sendMessage(
    `🕒 AutoReset System Status 🕒\nCurrent Time: ${timeNow}\nNext restart at: ${nextRestart}\nSystem will restart every hour at 00 minutes.`,
    event.threadID,
    event.messageID
  );
};

// After restart - send message to group
module.exports.onLoad = function ({ api }) {
  const path = __dirname + "/autoreset_flag.json";
  
  if (fs.existsSync(path)) {
    try {
      const data = JSON.parse(fs.readFileSync(path, "utf8"));
      
      // Add delay to ensure bot is fully loaded
      setTimeout(() => {
        api.sendMessage(
          `✅ Bot Restarted Successfully!\n🕒 Restart Time: ${data.restartTime || "Unknown"}\nPowered by Boss SAHU 🔥`,
          data.groupID,
          (err) => {
            if (err) {
              console.error("Error sending restart message:", err);
            }
            // Clean up flag file
            try {
              fs.unlinkSync(path);
            } catch (unlinkErr) {
              console.error("Error deleting flag file:", unlinkErr);
            }
          }
        );
      }, 5000);
      
    } catch (err) {
      console.log("AutoReset flag error:", err);
      // Clean up corrupted flag file
      try {
        fs.unlinkSync(path);
      } catch (unlinkErr) {
        console.error("Error deleting corrupted flag file:", unlinkErr);
      }
    }
  }
};

// Clean up on module unload
module.exports.onUnload = function () {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  started = false;
};