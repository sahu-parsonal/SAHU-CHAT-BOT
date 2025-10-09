const axios = require("axios");

module.exports.config = {
    name: "uid",
    version: "2.0.1",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Get user ID (Prefix + No Prefix)",
    commandCategory: "Tools",
    usages: "uid [tag/none]",
    cooldowns: 3
};


module.exports.handleEvent = function ({ api, event }) {
    if (!event.body) return;
    const body = event.body.trim().toLowerCase();

    if (body === "uid") {
        return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
    }

    if (body.startsWith("uid") && Object.keys(event.mentions || {}).length > 0) {
        for (const id of Object.keys(event.mentions)) {
            const name = Object.values(event.mentions)[0].replace("@", "");
            return api.sendMessage(`${name}: ${id}`, event.threadID, event.messageID);
        }
    }
};


module.exports.run = async function ({ api, event }) {
    const args = event.body.trim().split(/\s+/);
    const cmdName = this.config.name;

    
    if (args[0].toLowerCase() !== global.config.PREFIX + cmdName && args[0].toLowerCase() !== cmdName)
        return;
    if (Object.keys(event.mentions).length === 0) {
        return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
    } 
    
    else {
        for (const id of Object.keys(event.mentions)) {
            const name = Object.values(event.mentions)[0].replace("@", "");
            return api.sendMessage(`${name}: ${id}`, event.threadID, event.messageID);
        }
    }
};