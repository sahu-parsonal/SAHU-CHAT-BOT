module.exports.config = {
  name: "help",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Shows all commands with details",
  commandCategory: "system",
  usages: "[command name/page number/all]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": ` ╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 ✨
┣━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Page: %2/%3
┃ 🧮 Total: %4
┣━━━━━━━━━━━━━━━━┫
%5
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %6
┃ 🌼 Bot Name: ~সা্ঁহু্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁটঁ~😘🌺
┃ 🌸 Owner: 𝐒𝐇𝐀𝐇𝐀𝐃𝐀𝐓 𝐒𝐀𝐇𝐔
╰━━━━━━━━━━━━━━━━╯ `,
    "helpList": "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",
    "user": "User",
    "adminGroup": "Admin Group",
    "adminBot": "Admin Bot"
  }
};

// ========== EVENT HANDLE ==========
module.exports.handleEvent = function ({ api, event, getText }) {
  const { threadID, body } = event;
  if (!body) return;

  let content = body.trim().toLowerCase();

  // prefix ছাড়াও কাজ করবে
  if (
    content === "help" ||
    content === "helpall" ||
    content === "help all" ||
    content.match(/^help\s+\d+$/) ||
    content.match(/^help\s+\w+$/)
  ) {
    const args = content.split(/\s+/).slice(1);
    return module.exports.run({ api, event, args, getText });
  }
};

// ========== MAIN RUN ==========
module.exports.run = function ({ api, event, args, getText }) {
  const request = require("request");
  const fs = require("fs-extra");
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  // ====> যদি all লেখা হয় → সব কমান্ড দেখাবে
  if (args[0] === "all" || (args.length === 0 && event.body.toLowerCase() === "helpall")) {
    const arrayInfo = [];
    for (var [name] of commands) {
      if (name && name.trim() !== "") arrayInfo.push(name.trim());
    }
    arrayInfo.sort();

    let msg = "";
    for (let cmdName of arrayInfo) {
      msg += `┃ ✪ ${cmdName}\n`;
    }

    const text = ` ╭━━━━━━━━━━━━━━━━╮
┃ 📜 𝐀𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜
┣━━━━━━━━━━━━━━━┫
┃ 🧮 Total: ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━┫
${msg}┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🌼 Bot Name: ~সা্ঁহু্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁটঁ~😘🌺
┃ 🌸 Owner Name: 𝐒𝐇𝐀𝐇𝐀𝐃𝐀𝐓 𝐒𝐀𝐇𝐔
╰━━━━━━━━━━━━━━━━╯ `;

    const imgPath = __dirname + "/cache/helppic.jpg";
    const callback = () => api.sendMessage({ body: text, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);
    return request("https://i.imgur.com/sxSn1K3.jpeg").pipe(fs.createWriteStream(imgPath)).on("close", () => callback());
  }

  // ====> নির্দিষ্ট command না হলে → পেজ সিস্টেম
  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 20;
    let msg = "";

    for (var [name] of commands) {
      if (name && name.trim() !== "") arrayInfo.push(name.trim());
    }
    arrayInfo.sort();

    const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);
    if (page < 1 || page > totalPages) return api.sendMessage(`❌ Invalid page number. (1-${totalPages})`, threadID, messageID);

    const start = numberOfOnePage * (page - 1);
    const helpView = arrayInfo.slice(start, start + numberOfOnePage);

    for (let cmdName of helpView) {
      msg += `┃ ✪ ${cmdName}\n`;
    }

    const text = ` ╭━━━━━━━━━━━━━━━━╮
┃ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜
┣━━━━━━━━━━━━━━━┫
┃ 📄 Page: ${page}/${totalPages}
┃ 🧮 Total: ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━┫
${msg}┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🌼 Bot Name: ~সা্ঁহু্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁটঁ~😘🌺
┃ 🌸 Owner Name: 𝐒𝐇𝐀𝐇𝐃𝐀𝐓 𝐒𝐀𝐇𝐔
╰━━━━━━━━━━━━━━━━╯ `;

    const imgPath = __dirname + "/cache/helppic.jpg";
    const callback = () => api.sendMessage({ body: text, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);
    return request("https://i.imgur.com/sxSn1K3.jpeg").pipe(fs.createWriteStream(imgPath)).on("close", () => callback());
  }

  // ====> নির্দিষ্ট command এর বিস্তারিত
  const detail = getText(
    "moduleInfo",
    command.config.name,
    "1",
    "1",
    "1",
    `┃ ✪ ${command.config.name} - ${command.config.description}`,
    prefix
  );

  const imgPath = __dirname + "/cache/helppic.jpg";
  const callback = () => api.sendMessage({ body: detail, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);
  return request("https://i.imgur.com/sxSn1K3.jpeg").pipe(fs.createWriteStream(imgPath)).on("close", () => callback());
};