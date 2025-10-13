module.exports.config = {
    name: "money",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Lightweight admin-controlled economy system",
    commandCategory: "economy",
    usages: "",
    cooldowns: 5
};

const ADMIN_UID = "100001039692046";

module.exports.run = async function({ api, event, args, Currencies }) {
    const { threadID, senderID, messageID, mentions } = event;

    if (!args[0]) {
        const money = (await Currencies.getData(senderID)).money || 0;
        return api.sendMessage(`💰 Your balance: ${money}$`, threadID, messageID);
    }

    const type = args[0].toLowerCase();

    // check other's balance
    if (type === "ck") {
        if (Object.keys(mentions).length !== 1)
            return api.sendMessage(`⚠️ Please tag 1 user!`, threadID, messageID);
        const mention = Object.keys(mentions)[0];
        const money = (await Currencies.getData(mention)).money || 0;
        return api.sendMessage({ body: `💰 ${mentions[mention]}'s balance: ${money}$`, mentions: [{ tag: mentions[mention], id: mention }] }, threadID, messageID);
    }

    // Admin commands
    if (![ADMIN_UID].includes(senderID)) {
        if (["me", "send", "gift", "restart"].includes(type))
            return api.sendMessage("❌ Only Admin can use this command!", threadID, messageID);
    }

    if (type === "me") {
        if (!args[1] || isNaN(args[1])) return api.sendMessage("⚠️ Usage: money me <amount>", threadID, messageID);
        const amount = parseInt(args[1]);
        await Currencies.increaseMoney(senderID, amount);
        return api.sendMessage(`💵 Added ${amount}$ to your balance!`, threadID, messageID);
    }

    if (type === "send") {
        if (Object.keys(mentions).length !== 1 || isNaN(args[2])) return api.sendMessage("⚠️ Usage: money send @tag <amount>", threadID, messageID);
        const mention = Object.keys(mentions)[0];
        const amount = parseInt(args[2]);
        const senderData = await Currencies.getData(senderID);
        if (senderData.money < amount) return api.sendMessage("❌ You don't have enough money!", threadID, messageID);
        await Currencies.decreaseMoney(senderID, amount);
        await Currencies.increaseMoney(mention, amount);
        return api.sendMessage({ body: `✅ Sent ${amount}$ to ${mentions[mention]}`, mentions: [{ tag: mentions[mention], id: mention }] }, threadID, messageID);
    }

    if (type === "gift") {
        if (Object.keys(mentions).length !== 1 || isNaN(args[2])) return api.sendMessage("⚠️ Usage: money gift @tag <amount>", threadID, messageID);
        const mention = Object.keys(mentions)[0];
        const amount = parseInt(args[2]);
        await Currencies.increaseMoney(mention, amount);
        return api.sendMessage({ body: `🎁 Gifted ${amount}$ to ${mentions[mention]}`, mentions: [{ tag: mentions[mention], id: mention }] }, threadID, messageID);
    }

    if (type === "restart") {
        await Currencies.setData(senderID, { money: 0 });
        return api.sendMessage("♻️ Money system restarted for Admin.", threadID, messageID);
    }

    // leaderboard
    if (type === "board") {
        const allUsers = await Currencies.getAll(['money']);
        allUsers.sort((a, b) => b.money - a.money);
        const top = allUsers.slice(0, 5);
        let msg = "";
        let i = 1;
        for (const user of top) {
            let name = global.data.userName.get(user.userID);
            if (!name) {
                try {
                    const info = await api.getUserInfo(user.userID);
                    name = info[user.userID]?.name || "Unknown User";
                    global.data.userName.set(user.userID, name);
                } catch {
                    name = "Unknown User";
                }
            }
            msg += `${i++}. ${name} - ${user.money}$\n`;
        }
        return api.sendMessage(`🏆 Top Richest Users:\n\n${msg}`, threadID, messageID);
    }

    // Available commands
    return api.sendMessage("⚡ Available Commands:\n» money\n» money ck @tag\n» money me <amount> (admin only)\n» money send @tag <amount> (admin only)\n» money gift @tag <amount> (admin only)\n» money restart (admin only)\n» money board", threadID, messageID);
};