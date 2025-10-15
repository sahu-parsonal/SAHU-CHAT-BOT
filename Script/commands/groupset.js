const fs = require("fs");
const axios = require("axios");

module.exports.config = {
    name: "group",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Change group name, emoji, or image",
    commandCategory: "Box",
    usages: "groupset [name|emoji|image] [value] (or reply photo for image)",
    cooldowns: 0,
    dependencies: [],
    noPrefix: true
};

module.exports.run = async function({ api, event, args, prefix }) {
    if (prefix && args.length === 0) return;

    const type = args[0];
    const value = args.slice(1).join(" ");

    if (!type) return api.sendMessage("❌ Specify what to change: name, emoji, or image", event.threadID, event.messageID);

    const validTypes = ["name", "emoji", "image"];
    if (!validTypes.includes(type.toLowerCase())) {
        return api.sendMessage("❌ Invalid type. Use: name, emoji, or image.", event.threadID, event.messageID);
    }

    if (type.toLowerCase() === "name") {
        if (!value) return api.sendMessage("❌ Enter the new group name.", event.threadID, event.messageID);
        return api.setTitle(value, event.threadID, () => {
            api.sendMessage(`🔨 Group name changed to: ${value}`, event.threadID, event.messageID);
        });
    }

    else if (type.toLowerCase() === "emoji") {
        if (!value) return api.sendMessage("❌ Enter the new group emoji.", event.threadID, event.messageID);
        return api.changeThreadEmoji(value, event.threadID, () => {
            api.sendMessage(`🔨 Group emoji changed to: ${value}`, event.threadID, event.messageID);
        });
    }

    else if (type.toLowerCase() === "image") {
        let imageUrl;
        if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length === 1) {
            imageUrl = event.messageReply.attachments[0].url;
        } else if (value) {
            imageUrl = value;
        } else {
            return api.sendMessage("❌ Reply to a photo or provide an image URL.", event.threadID, event.messageID);
        }

        try {
            const pathImg = __dirname + "/cache/group_image.png";
            const getdata = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(pathImg, Buffer.from(getdata, "utf-8"));
            return api.changeGroupImage(fs.createReadStream(pathImg), event.threadID, () => {
                fs.unlinkSync(pathImg);
                api.sendMessage("🔨 Group image changed successfully!", event.threadID, event.messageID);
            });
        } catch {
            return api.sendMessage("❌ Failed to change group image.", event.threadID, event.messageID);
        }
    }
};