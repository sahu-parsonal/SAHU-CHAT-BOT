const axios = require('axios');
const fs = require('fs');

const xyz = "ArYANAHMEDRUDRO";

module.exports = {
  config: {
    name: "4k",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    premium: false,
    description: "Enhance Photo - Image Generator (Prefix + No-prefix)",
    commandCategory: "Image Editing Tools",
    usages: "Reply to an image or provide image URL",
    cooldowns: 5,
  },

  
  handleEvent: async function({ api, event }) {
    const { body, messageReply, threadID, messageID } = event;
    if (!body) return;
    if (body.toLowerCase().trim() === "4k") {
      await processImage(api, threadID, messageID, messageReply);
    }
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;
    const imageUrl = messageReply?.attachments?.[0]?.url || args.join(' ');
    if (!imageUrl) {
      api.sendMessage("📸 Please reply to an image or provide an image URL", threadID, messageID);
      return;
    }

    await processImage(api, threadID, messageID, messageReply);
  }
};


async function processImage(api, threadID, messageID, messageReply) {
  const tempImagePath = __dirname + '/cache/enhanced_image.jpg';
  const imageUrl = messageReply?.attachments?.[0]?.url;

  if (!imageUrl) {
    api.sendMessage("📸 Please reply to an image to enhance!", threadID, messageID);
    return;
  }

  try {
    const processingMsg = await api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐚𝐢𝐭 𝐁𝐚𝐛𝐲...😘", threadID);

    const apiUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${xyz}`;
    const enhancementResponse = await axios.get(apiUrl);
    const enhancedImageUrl = enhancementResponse.data?.resultImageUrl;

    if (!enhancedImageUrl) throw new Error("Failed to get enhanced image URL.");

    const enhancedImage = (await axios.get(enhancedImageUrl, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(tempImagePath, Buffer.from(enhancedImage, 'binary'));

    api.sendMessage({
      body: "✅ 𝐈𝐦𝐚𝐠𝐞 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!",
      attachment: fs.createReadStream(tempImagePath)
    }, threadID, () => fs.unlinkSync(tempImagePath), messageID);

    api.unsendMessage(processingMsg.messageID);
  } catch (error) {
    api.sendMessage(`API gece boss SAHU ke Messeg Daw✅🤌`, threadID, messageID);
  }
}