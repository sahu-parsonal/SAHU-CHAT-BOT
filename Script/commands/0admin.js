const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");

module.exports.config = {
    name: "0admin",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "SHAHADATE SAHU",
    description: "Admin Configuration (Restricted Access)",
    commandCategory: "Admin",
    usages: "admin [list/add/remove/addndh/removendh/only/qtvonly/ndhonly/ibonly]",
    cooldowns: 0,
    dependencies: { "fs-extra": "" }
};

module.exports.languages = {
    "en": {
        "listAdmin": "[Admin] Admin list:\n\n%1\n\n[Supporters]\n\n%2",
        "notHavePermssion": "[Admin] You have no permission to use '%1'",
        "addedNewAdmin": "[Admin] Added %1 Admin(s):\n\n%2",
        "addedNewNDH": "[Admin] Added %1 Supporter(s):\n\n%2",
        "removedAdmin": "[Admin] Removed %1 Admin(s):\n\n%2",
        "removedNDH": "[Admin] Removed %1 Supporter(s):\n\n%2"
    }
};

module.exports.onLoad = function () {
    const { writeFileSync, existsSync } = require("fs-extra");
    const { resolve } = require("path");
    const path = resolve(__dirname, "cache", "data.json");
    if (!existsSync(path)) {
        const obj = { adminbox: {} };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty("adminbox")) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
    const { threadID, messageID, mentions } = event;
    const content = args.slice(1);
    const { configPath } = global.client;
    const { ADMINBOT, NDH } = global.config;
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const mention = Object.keys(mentions);
    delete require.cache[require.resolve(configPath)];
    let config = require(configPath);

    // 🔒 Only these two UIDs can use this command
    const allowedUIDs = ["100001039692046", "100089047474463"];
    if (!allowedUIDs.includes(event.senderID)) {
        return api.sendMessage(getText("notHavePermssion", "admin control"), threadID, messageID);
    }

    // 🧭 Command Handler
    switch ((args[0] || "").toLowerCase()) {

        case "list":
        case "all":
        case "-a": {
            const listAdmin = ADMINBOT || config.ADMINBOT || [];
            const listNDH = NDH || config.NDH || [];
            let adminMsg = [];
            let ndhMsg = [];

            for (const id of listAdmin) {
                if (parseInt(id)) {
                    const name = (await Users.getData(id)).name;
                    adminMsg.push(`Name: ${name}\nLink: https://facebook.com/${id}`);
                }
            }

            for (const id of listNDH) {
                if (parseInt(id)) {
                    const name = (await Users.getData(id)).name;
                    ndhMsg.push(`Name: ${name}\nLink: https://facebook.com/${id}`);
                }
            }

            return api.sendMessage(getText("listAdmin", adminMsg.join("\n\n"), ndhMsg.join("\n\n")), threadID, messageID);
        }

        case "add": {
            let listAdd = [];
            if (mention.length !== 0 && isNaN(content[0])) {
                for (const id of mention) {
                    if (!ADMINBOT.includes(id)) {
                        ADMINBOT.push(id);
                        config.ADMINBOT.push(id);
                        listAdd.push(`${id} - ${event.mentions[id]}`);
                    }
                }
            } else if (content.length !== 0 && !isNaN(content[0])) {
                if (!ADMINBOT.includes(content[0])) {
                    ADMINBOT.push(content[0]);
                    config.ADMINBOT.push(content[0]);
                    const name = (await Users.getData(content[0])).name;
                    listAdd.push(`${content[0]} - ${name}`);
                }
            } else return global.utils.throwError(this.config.name, threadID, messageID);

            writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
            return api.sendMessage(getText("addedNewAdmin", listAdd.length, listAdd.join("\n")), threadID, messageID);
        }

        case "addndh": {
            let listAdd = [];
            if (mention.length !== 0 && isNaN(content[0])) {
                for (const id of mention) {
                    if (!NDH.includes(id)) {
                        NDH.push(id);
                        config.NDH.push(id);
                        listAdd.push(`${id} - ${event.mentions[id]}`);
                    }
                }
            } else if (content.length !== 0 && !isNaN(content[0])) {
                if (!NDH.includes(content[0])) {
                    NDH.push(content[0]);
                    config.NDH.push(content[0]);
                    const name = (await Users.getData(content[0])).name;
                    listAdd.push(`${content[0]} - ${name}`);
                }
            } else return global.utils.throwError(this.config.name, threadID, messageID);

            writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
            return api.sendMessage(getText("addedNewNDH", listAdd.length, listAdd.join("\n")), threadID, messageID);
        }

        case "remove":
        case "rm":
        case "delete": {
            let listRemoved = [];
            if (mention.length !== 0 && isNaN(content[0])) {
                for (const id of mention) {
                    const index = config.ADMINBOT.findIndex(item => item == id);
                    if (index !== -1) {
                        ADMINBOT.splice(index, 1);
                        config.ADMINBOT.splice(index, 1);
                        listRemoved.push(`${id} - ${event.mentions[id]}`);
                    }
                }
            } else if (content.length !== 0 && !isNaN(content[0])) {
                const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
                if (index !== -1) {
                    ADMINBOT.splice(index, 1);
                    config.ADMINBOT.splice(index, 1);
                    const name = (await Users.getData(content[0])).name;
                    listRemoved.push(`${content[0]} - ${name}`);
                }
            } else return global.utils.throwError(this.config.name, threadID, messageID);

            writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
            return api.sendMessage(getText("removedAdmin", listRemoved.length, listRemoved.join("\n")), threadID, messageID);
        }

        case "removendh": {
            let listRemoved = [];
            if (mention.length !== 0 && isNaN(content[0])) {
                for (const id of mention) {
                    const index = config.NDH.findIndex(item => item == id);
                    if (index !== -1) {
                        NDH.splice(index, 1);
                        config.NDH.splice(index, 1);
                        listRemoved.push(`${id} - ${event.mentions[id]}`);
                    }
                }
            } else if (content.length !== 0 && !isNaN(content[0])) {
                const index = config.NDH.findIndex(item => item.toString() == content[0]);
                if (index !== -1) {
                    NDH.splice(index, 1);
                    config.NDH.splice(index, 1);
                    const name = (await Users.getData(content[0])).name;
                    listRemoved.push(`${content[0]} - ${name}`);
                }
            } else return global.utils.throwError(this.config.name, threadID, messageID);

            writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
            return api.sendMessage(getText("removedNDH", listRemoved.length, listRemoved.join("\n")), threadID, messageID);
        }

        case "only":
        case "qtvonly":
        case "ndhonly":
        case "ibonly": {
            return api.sendMessage("[Admin] Access to mode toggles is restricted.", threadID, messageID);
        }

        default:
            return global.utils.throwError(this.config.name, threadID, messageID);
    }
};