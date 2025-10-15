module.exports.config = {
  name: "sura",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Islamick Chat",
  description: "প্রিয় মুসলিম ভাই ও বোনদের জন্য সূরা নিয়ে এলাম।",
  commandCategory: "Ismailc",
  usages: "sura",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "request": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event, args, Users, Threads }) => {
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
  api.sendTyping(event.threadID, async () => {
    try {
     
      const greetings = [
        "•┄┅════❁🌺❁════┅┄•\n\nপ্রিয় মুসলিম ভাই ও বোন সূরা টি শুনো, তোমার প্রাণ জুরিয়ে যাবে।\n\nইনশাআল্লাহ ❤️🌸\n\n•┄┅════❁🌺❁════┅┄•"
      ];
      const message = greetings[Math.floor(Math.random() * greetings.length)];

      const links = [
        "https://drive.google.com/uc?id=1Ml6znasS_cajYJVS8OJ19DQO6aaLzWkc",
        "https://drive.google.com/uc?id=1NKyRitWSGriX3TG23YTLj0tgfySwn6Q-",
        "https://drive.google.com/uc?id=1N-sbqx4LjEc-OOEa0MXhM2crzyvn3ynj",
        "https://drive.google.com/uc?id=1N9AzB4zAWlz2bG3UesZ7GawyJykRO79s",
        "https://drive.google.com/uc?id=1MrLaZG9NyfSDLjZvCRK69L0nnepV6R7U",
        "https://drive.google.com/uc?id=1N7W-i_Xr3lxM0cvv4dQlGUvsFGoyHnIl",
        "https://drive.google.com/uc?id=1Mn8JXddjoYKHkNcgAdnw8dnwhr2Ems6s",
        "https://drive.google.com/uc?id=1NLbrtpig80X1_NTlRHmeKG7ZQPtTmdTJ",
        "https://drive.google.com/uc?id=1NFnzqXl8aC_9tpngoKcfeWEyyT3DNdGW",
        "https://drive.google.com/uc?id=1NAkALvze0fkzkRvzDSTQvt-nqCIqqQBv",
        "https://drive.google.com/uc?id=1NFrEbcdP3CnZ1ZB1KKDCDa6gpV5x4W4t",
        "https://drive.google.com/uc?id=1MpowaaCScbWY-vEGtfLX5xPzKCQineHl",
        "https://drive.google.com/uc?id=1N3bT2YWhp92xABdf851LDuELwwc1b92T"
      ];
      
      const filePath = __dirname + "/cache/sura.mp3";
      const selectedLink = links[Math.floor(Math.random() * links.length)];

      // ডাউনলোড এবং পাঠানো
      const sendAudio = () => {
        api.sendMessage({
          body: message + `\n\n🕒 টাইম: ${new Date().toLocaleString()}`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath));
      };

      request(encodeURI(selectedLink))
        .pipe(fs.createWriteStream(filePath))
        .on("close", sendAudio)
        .on("error", () => api.sendMessage("dawonlod korte partam na🥺", event.threadID));

    } catch (err) {
      console.error(err);
      api.sendMessage("sorry error", event.threadID);
    }
  });
};