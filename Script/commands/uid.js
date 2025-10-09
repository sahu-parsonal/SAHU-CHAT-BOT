module.exports.config = {
    name: "uid",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Get UID with reaction (self, mention, or reply).",
    commandCategory: "Tools",
    usages: "uid [tag/reply/none]",
    cooldowns: 0
};

module.exports.handleEvent = async function({ api, event }) {
    if (!event.body) return;
    const body = event.body.trim().toLowerCase();
    if (body !== "uid") return;

    let targetID = event.senderID;
    let messageText = `Your UID: ${targetID}`;

    if (event.type === "message_reply" && event.messageReply) {
        targetID = event.messageReply.senderID;
        messageText = `Replied user's UID: ${targetID}`;
    } else if (Object.keys(event.mentions || {}).length > 0) {
        targetID = Object.keys(event.mentions)[0];
        const name = Object.values(event.mentions)[0].replace("@", "");
        messageText = `${name}: ${targetID}`;
    }

    const sentMessage = await api.sendMessage(messageText, event.threadID, event.messageID);
    api.setMessageReaction("✅", sentMessage.messageID, event.threadID, (err) => {
        if (err) console.log(err);
    });
};

module.exports.run = async function({ api, event }) {
    let targetID = event.senderID;
    let messageText = `Your UID: ${targetID}`;

    if (event.type === "message_reply" && event.messageReply) {
        targetID = event.messageReply.senderID;
        messageText = `Replied user's UID: ${targetID}`;
    } else if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
        const name = Object.values(event.mentions)[0].replace("@", "");
        messageText = `${name}: ${targetID}`;
    }

    const sentMessage = await api.sendMessage(messageText, event.threadID, event.messageID);
    api.setMessageReaction("✅", sentMessage.messageID, event.threadID, (err) => {
        if (err) console.log(err);
    });
};