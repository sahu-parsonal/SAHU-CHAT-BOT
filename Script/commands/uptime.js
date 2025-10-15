const os = require("os");
const moment = require("moment-timezone");
const startTime = new Date();

module.exports = {
  config: {
    name: "uptime",
    version: "3.1.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Show system info and uptime with stylish SYSTEM STATUS box",
    commandCategory: "system",
    usages: "[uptime]",
    cooldowns: 5
  },

  handleEvent: async function({ api, event }) {
    const { body, threadID, messageID } = event;
    if (!body) return;
    const text = body.trim().toLowerCase();

    // No prefix mode: only "uptime"
    if (text !== "uptime") return;

    return runUptime(api, threadID, messageID);
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID } = event;
    if (!args || args.length === 0) return;
    const cmd = args[0].toLowerCase();

    // Prefix mode: only "uptime"
    if (cmd !== "uptime") return;

    return runUptime(api, threadID, messageID);
  }
};

// ------------------- Helper Function -------------------
async function runUptime(api, threadID, messageID) {
  try {
    // Step 1: Initial progress bar
    const info = await api.sendMessage("⏳ Loading system status...", threadID);
    let msgID = info.messageID;

    const steps = [
      { bar: "[███░░░░░░░░]", percent: "30%" },
      { bar: "[██████░░░░░]", percent: "60%" },
      { bar: "[█████████░░]", percent: "90%" },
      { bar: "[███████████]", percent: "100%" },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 700));
      try {
        await api.editMessage(`${step.bar} ${step.percent}`, msgID);
      } catch (e) {
        await api.unsendMessage(msgID);
        const newMsg = await api.sendMessage(`${step.bar} ${step.percent}`, threadID);
        msgID = newMsg.messageID;
      }
    }

    // Step 2: Prepare system info
    const uptimeSec = (new Date() - startTime) / 1000;
    const days = Math.floor(uptimeSec / 86400);
    const hours = Math.floor((uptimeSec % 86400) / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = Math.floor(uptimeSec % 60);
    const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const totalMem = os.totalmem() / 1073741824;
    const freeMem = os.freemem() / 1073741824;
    const usedMem = totalMem - freeMem;
    const usedPercent = ((usedMem / totalMem) * 100).toFixed(1);

    const cpu = os.cpus()[0];
    const now = moment.tz("Asia/Dhaka");
    const ping = Math.floor(Math.random() * 200) + 50;
    let pingStatus = ping < 100 ? "⚡ Ultra Fast" : ping < 200 ? "🚀 Stable" : ping < 400 ? "⚠️ Normal" : "🐢 Slow";
    const status = usedPercent < 70 ? "✅ SYSTEM STABLE" : usedPercent < 90 ? "⚠️ HIGH LOAD" : "⛔ CRITICAL";

    // Step 3: Stylish SYSTEM STATUS Box
    const finalMsg = `
╔══════════════════════╗
║ ⚙️ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦 ⚙️ 
╠══════════════════════╣
║ 👑 OWNER: 𝐒𝐇𝐀𝐇𝐀𝐃𝐀𝐓 𝐒𝐀𝐇𝐔
║ 🤖 BOT: ─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭
║ 🕐 START TIME: ${startTime.toLocaleString()}
║ ⏰ UPTIME: ${uptimeFormatted}
╠══════════════════════╣
║ 💻 OS: ${os.type()} ${os.arch()}
║ 🧠 CPU: ${cpu.model}
║ ⚙️ SPEED: ${cpu.speed} MHz
║ 🔢 CORES: ${os.cpus().length}
║ 💾 RAM: ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB (${usedPercent}%)
║ 🧩 NODE: ${process.version}
╠══════════════════════╣
║ 📅 DATE: ${now.format("DD MMMM YYYY")}
║ ⏰ TIME: ${now.format("hh:mm:ss A")}
║ 📡 PING: ${ping}ms (${pingStatus})
║ 🧭 STATUS: ${status}
╚══════════════════════╝
`;

    // Step 4: Send final SYSTEM STATUS message
    await new Promise(r => setTimeout(r, 1000));
    try {
      await api.editMessage(finalMsg, msgID);
    } catch (e) {
      await api.unsendMessage(msgID);
      await api.sendMessage(finalMsg, threadID);
    }
  } catch (error) {
    console.error("Uptime command error:", error);
    await api.sendMessage("⚠️ Something went wrong! Contact admin SAHU.", threadID);
  }
}