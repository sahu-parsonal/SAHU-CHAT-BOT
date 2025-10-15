const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "islamick", // ফাইল নাম অনুযায়ী কাজ করবে
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Random Islamic video with message",
    commandCategory: "Random video",
    usages: "islmick",
    cooldowns: 2,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": ""
    },
    noPrefix: true // No prefix ফাইল নাম দিয়ে কাজ করবে
};

module.exports.run = async ({ api, event, args }) => {
    // শুধু যদি args না থাকে বা ফাইল নামের সাথে অন্য কিছু না থাকে
    if (args.length > 0) return; // কোনো এক্সট্রা টেক্সট থাকলে কাজ করবে না

    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];

    const links = [
        "https://i.imgur.com/FbnZI40.mp4",
        "https://i.imgur.com/8k6OOZg.mp4",
        "https://i.imgur.com/lgQghHX.mp4",
        "https://i.imgur.com/D7HZFSg.mp4",
        "https://i.imgur.com/vUe9Zlv.mp4",
        "https://i.imgur.com/oxFuJYw.mp4",
        "https://i.imgur.com/OKKlDBN.mp4",
        "https://i.imgur.com/6wWebFc.mp4",
        "https://i.imgur.com/K2LTmaA.mp4",
        "https://i.imgur.com/i9vKvTd.mp4",
        "https://i.imgur.com/Y6uBzxx.mp4",
        "https://i.imgur.com/ULtFVPQ.mp4",
        "https://i.imgur.com/wX8WJh3.mp4",
        "https://i.imgur.com/6A42EIx.mp4",
        "https://i.imgur.com/ozRevxt.mp4",
        "https://i.imgur.com/Gd49ZSo.mp4",
        "https://i.imgur.com/xu6lBXk.mp4",
        "https://i.imgur.com/sDNohv4.mp4",
        "https://i.imgur.com/JBu2Ie3.mp4",
        "https://i.imgur.com/UaY42rq.mp4",
        "https://i.imgur.com/NFxf731.mp4",
        "https://i.imgur.com/vv1HsMC.mp4",
        "https://i.imgur.com/Y8MPzLv.mp4",
        "https://i.imgur.com/9M1v1qK.mp4",
        "https://i.imgur.com/EgUy7v0.mp4",
        "https://i.imgur.com/IjDqg2G.mp4",
        "https://i.imgur.com/51NYqmO.mp4",
        "https://i.imgur.com/XjfJHh9.mp4",
        "https://i.imgur.com/XHrkPt4.mp4",
        "https://i.imgur.com/mqEYRdy.mp4",
        "https://i.imgur.com/NaVsFmQ.mp4",
        "https://i.imgur.com/31XSmVj.mp4",
        "https://i.imgur.com/PPamCPI.mp4",
        "https://i.imgur.com/i6Iy7iN.mp4"
    ];

    const randomLink = links[Math.floor(Math.random() * links.length)];
    const pathVideo = __dirname + "/cache/islmick.mp4";

    const callback = () => {
        api.sendMessage(
            {
                body: `🌻 মানুষ হারাম ছাড়েনা অথচ সুখ শান্তি খুঁজে বেড়ায় আরাম\nমানুষ কেন বুঝতে চায় না\nসে যে খোদার গোলাম🥺।\n\nআল্লাহ আমাদের সবাইকে হারাম থেকে দূরে থাকার তৌফিক দান করুক 😭❤️‍🩹`,
                attachment: fs.createReadStream(pathVideo)
            },
            event.threadID,
            () => fs.unlinkSync(pathVideo)
        );
    };

    request(encodeURI(randomLink))
        .pipe(fs.createWriteStream(pathVideo))
        .on("close", () => callback());
};