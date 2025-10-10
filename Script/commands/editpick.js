const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiEndpoint = "https://edit-and-gen.onrender.com/gen";

module.exports.config = {
  name: "edit",
  version: "2.0.0",
  credits: "dipto",
  countDown: 0,
  hasPermssion: 2,
  category: "AI",
  commandCategory: "AI",
  description: "Edit images using Edit AI",
  guide: {
    en: "Reply to an image with {pn} [prompt]"
  }
};

async function handleEdit(api, event, args) {
  const replyMessage = event.messageReply;
  const url = replyMessage?.attachments?.[0]?.url;
  const prompt = args.join(" ").trim() || "Enhance this image";

  if (!url) {
    return api.sendMessage("❌ Please reply to an image to edit it.", event.threadID, event.messageID);
  }

  try {
    
    const response = await axios.get(`${apiEndpoint}?prompt=${encodeURIComponent(prompt)}&image=${encodeURIComponent(url)}`, {
      responseType: 'stream',
      timeout: 60000, // 60 seconds timeout
      validateStatus: () => true
    });

    const contentType = response.headers['content-type'];
    if (contentType?.startsWith('image/')) {
      const tempFile = path.join(__dirname, `edit_${Date.now()}.png`);
      const writer = fs.createWriteStream(tempFile);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      await api.sendMessage({ body: `✨ Image edited with prompt: "${prompt}"`, attachment: fs.createReadStream(tempFile) }, event.threadID, event.messageID);
      fs.unlinkSync(tempFile);
      return;
    }

    let responseData = '';
    for await (const chunk of response.data) {
      responseData += chunk.toString();
    }

    const jsonData = JSON.parse(responseData);
    if (jsonData?.response) {
      return api.sendMessage(jsonData.response, event.threadID, event.messageID);
    }

    return api.sendMessage("❌ No valid image or message returned from API.", event.threadID, event.messageID);

  } catch (error) {
    console.error("Edit command error:", error);
    return api.sendMessage("❌ Failed to process your request. Please try again later.", event.threadID, event.messageID);
  }
}

module.exports.run = async ({ api, event, args }) => {
  if (!event.messageReply) {
    return api.sendMessage("❌ Please reply to an image to edit it.", event.threadID, event.messageID);
  }
  await handleEdit(api, event, args);
};

module.exports.handleReply = async ({ api, event, args }) => {
  if (event.type === "message_reply") {
    await handleEdit(api, event, args);
  }
};