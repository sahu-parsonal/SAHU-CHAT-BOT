module.exports.config = {
    name: "slot",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Play a harder fruit-themed slot game and test your luck!",
    commandCategory: "game-sp",
    usages: "[bet amount]",
    cooldowns: 0, 
};

module.exports.languages = {
    "en": {
        "noBalance": "[SLOT] You have no balance!",
        "invalidAmount": "[SLOT] Please enter a valid bet amount.",
        "balanceLow": "[SLOT] Your balance is too low to place this bet!",
        "limitBet": "[SLOT] The minimum bet is $50.",
        "returnWin": "🎰 %1 | %2 | %3 🎰\nYou won $%4! 🎉",
        "returnLose": "🎰 %1 | %2 | %3 🎰\nYou lost $%4. 💸",
        "jackpot": "🎰 %1 | %2 | %3 🎰\nJACKPOT! You won $%4! 🤑"
    }
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    const { getData, increaseMoney, decreaseMoney } = Currencies;

    const slotItems = ["🍇","🍉","🍊","🍏","7⃣","🍓","🍒","🍌","🥝","🥑","🌽"];
    const moneyUser = (await getData(senderID)).money;

    if (moneyUser <= 0) return api.sendMessage(getText("noBalance"), threadID, messageID);

    let moneyBet = parseInt(args[0]);
    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage(getText("invalidAmount"), threadID, messageID);
    if (moneyBet < 50) return api.sendMessage(getText("limitBet"), threadID, messageID);
    if (moneyBet > moneyUser) return api.sendMessage(getText("balanceLow"), threadID, messageID);

    // Generate random slot
    let numbers = [];
    for (let i = 0; i < 3; i++) numbers[i] = Math.floor(Math.random() * slotItems.length);

    let win = false;
    let multiplier = 0;

    // Jackpot chance (harder)
    const jackpotChance = Math.floor(Math.random() * 1000); // 1 in 1000 chance
    if (jackpotChance === 1) {
        multiplier = 50;
        win = "jackpot";
    }
    // Three same icons
    else if (numbers[0] === numbers[1] && numbers[1] === numbers[2]) {
        multiplier = (slotItems[numbers[0]] === "7⃣") ? 20 : 10; 
        win = true;
    }
    // Two same icons
    else if (numbers[0] === numbers[1] || numbers[0] === numbers[2] || numbers[1] === numbers[2]) {
        multiplier = 2;
        win = true;
    }
    // Single 7⃣ bonus
    else if (numbers.includes(slotItems.indexOf("7⃣"))) {
        multiplier = 1; 
        win = true;
    }

    let finalMoney = moneyBet * multiplier;

    switch (win) {
        case "jackpot": {
            api.sendMessage(getText("jackpot", slotItems[numbers[0]], slotItems[numbers[1]], slotItems[numbers[2]], finalMoney), threadID, messageID);
            await increaseMoney(senderID, finalMoney);
            break;
        }
        case true: {
            api.sendMessage(getText("returnWin", slotItems[numbers[0]], slotItems[numbers[1]], slotItems[numbers[2]], finalMoney), threadID, messageID);
            await increaseMoney(senderID, finalMoney);
            break;
        }
        case false: {
            api.sendMessage(getText("returnLose", slotItems[numbers[0]], slotItems[numbers[1]], slotItems[numbers[2]], moneyBet), threadID, messageID);
            await decreaseMoney(senderID, moneyBet);
            break;
        }
    }
}