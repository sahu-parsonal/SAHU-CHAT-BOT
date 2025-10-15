module.exports.config = {
    name: "shortcut",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "SHAHADAT SAHU",
    description: "Advanced shortcut manager with typing, random reply, categories, stats, export/import",
    commandCategory: "system",
    usages: "[add/list/delete/stats/export/import/search]",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.languages = {
    "en": {
        "missingKeyword": "「Shortcut」Keyword must not be blank!",
        "shortcutExist": "「Shortcut」This input already exists!",
        "requestResponse": "「Shortcut」Reply to this message to set the output(s). You can separate multiple outputs with `|`.",
        "addSuccess": "「Shortcut」Added successfully:\n- ID: %1\n- Input: %2\n- Output(s): %3\n- Category: %4",
        "listEmpty": "「Shortcut」No shortcuts are set in this thread!",
        "removeSuccess": "「Shortcut」Shortcut removed successfully!",
        "returnListShortcut": "「Shortcut」Shortcuts in this thread:\n[stt]/ [Input] => [Output(s)] | Category: [cat]\n\n%1",
        "requestKeyword": "「Shortcut」Reply to this message to set the keyword for the shortcut",
        "statsMessage": "「Shortcut Stats」\nTotal shortcuts: %1\nMost used: %2 (%3 times)",
        "exportSuccess": "「Shortcut」Exported all shortcuts as JSON:\n%1",
        "importSuccess": "「Shortcut」Imported %1 shortcuts successfully",
        "searchEmpty": "「Shortcut」No shortcuts match your search!"
    }
};

const fs = require("fs-extra");
const path = require("path");

module.exports.onLoad = function () {
    const dataPath = path.resolve(__dirname, "cache", "shortcutdata.json");
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]), "utf-8");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    for (const threadData of data) global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts);
}

module.exports.handleEvent = async function ({ event, api }) {
    const { threadID, messageID, body, senderID } = event;
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!global.moduleData.shortcut.has(threadID)) return;

    const data = global.moduleData.shortcut.get(threadID);
    const match = data.filter(item => {
        try { return new RegExp(item.input, "i").test(body); }
        catch { return item.input.toLowerCase() === body.toLowerCase(); }
    });

    if (match.length > 0) {
        const selected = match[Math.floor(Math.random() * match.length)];
        // Typing simulation
        api.sendTyping(threadID, true);
        setTimeout(() => {
            api.sendMessage(selected.output, threadID, messageID);
        }, 1500);
    }
}

module.exports.handleReply = async function ({ event, api, handleReply, getText }) {
    if (handleReply.author != event.senderID) return;
    const { threadID, messageID, body } = event;
    const dataPath = path.resolve(__dirname, "cache", "shortcutdata.json");
    const name = this.config.name;

    switch (handleReply.type) {
        case "requireInput": {
            if (!body) return api.sendMessage(getText("missingKeyword"), threadID, messageID);
            const data = global.moduleData.shortcut.get(threadID) || [];
            if (data.some(item => item.input === body)) return api.sendMessage(getText("shortcutExist"), threadID, messageID);

            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(getText("requestResponse"), threadID, (err, info) => {
                return global.client.handleReply.push({
                    type: "final",
                    name,
                    author: handleReply.author,
                    messageID: info.messageID,
                    input: body,
                    category: handleReply.category || "default"
                });
            }, messageID);
        }
        case "final": {
            const id = global.utils.randomString(10);
            const dataFile = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
            const dataThread = dataFile.find(d => d.threadID == threadID) || { threadID, shortcuts: [] };
            const dataGlobal = global.moduleData.shortcut.get(threadID) || [];

            const object = {
                id,
                input: handleReply.input,
                output: body || "empty",
                category: handleReply.category || "default",
                useCount: 0
            };

            dataThread.shortcuts.push(object);
            dataGlobal.push(object);

            if (!dataFile.some(d => d.threadID == threadID)) dataFile.push(dataThread);
            else dataFile[dataFile.findIndex(d => d.threadID == threadID)] = dataThread;

            global.moduleData.shortcut.set(threadID, dataGlobal);
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 4), "utf-8");
            return api.sendMessage(getText("addSuccess", id, handleReply.input, body || "empty", object.category), threadID, messageID);
        }
    }
}

module.exports.run = async function ({ event, api, args, getText }) {
    const { threadID, messageID, senderID } = event;
    const dataPath = path.resolve(__dirname, "cache", "shortcutdata.json");
    const name = this.config.name;

    const dataFile = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const dataThreadIndex = dataFile.findIndex(d => d.threadID == threadID);
    const dataThread = dataFile[dataThreadIndex] || { threadID, shortcuts: [] };
    const dataGlobal = global.moduleData.shortcut.get(threadID) || [];

    switch (args[0]) {
        case "add": {
            return api.sendMessage(getText("requestKeyword"), threadID, (err, info) => {
                return global.client.handleReply.push({
                    type: "requireInput",
                    name,
                    author: senderID,
                    messageID: info.messageID,
                    category: args[1] || "default"
                });
            }, messageID);
        }

        case "delete":
        case "del":
        case "-d": {
            let indexToRemove = isNaN(args[1])
                ? dataThread.shortcuts.findIndex(item => item.input == args.slice(1).join(" ") || item.id == args.slice(1).join(" "))
                : Number(args[1]);

            if (dataThread.shortcuts.length == 0 || indexToRemove < 0) return api.sendMessage(getText("listEmpty"), threadID, messageID);

            dataThread.shortcuts.splice(indexToRemove, 1);
            dataGlobal.splice(indexToRemove, 1);

            dataFile[dataThreadIndex] = dataThread;
            global.moduleData.shortcut.set(threadID, dataGlobal);
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 4), "utf-8");

            return api.sendMessage(getText("removeSuccess"), threadID, messageID);
        }

        case "list":
        case "all":
        case "-a": {
            if (dataGlobal.length == 0) return api.sendMessage(getText("listEmpty"), threadID, messageID);

            const list = dataGlobal.map((item, i) => `${i + 1}/ ${item.input} => ${item.output} | Category: ${item.category}`).join("\n");
            return api.sendMessage(getText("returnListShortcut", list), threadID, messageID);
        }

        case "stats": {
            if (dataGlobal.length == 0) return api.sendMessage(getText("listEmpty"), threadID, messageID);
            const mostUsed = dataGlobal.reduce((prev, curr) => curr.useCount > prev.useCount ? curr : prev, dataGlobal[0]);
            return api.sendMessage(getText("statsMessage", dataGlobal.length, mostUsed.input, mostUsed.useCount), threadID, messageID);
        }

        case "export": {
            return api.sendMessage(getText("exportSuccess", JSON.stringify(dataGlobal, null, 4)), threadID, messageID);
        }

        case "import": {
            try {
                const importData = JSON.parse(args.slice(1).join(" "));
                importData.forEach(item => dataThread.shortcuts.push(item));
                dataFile[dataThreadIndex] = dataThread;
                global.moduleData.shortcut.set(threadID, dataThread.shortcuts);
                fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 4), "utf-8");
                return api.sendMessage(getText("importSuccess", importData.length), threadID, messageID);
            } catch {
                return api.sendMessage("Invalid JSON format!", threadID, messageID);
            }
        }

        case "search": {
            const keyword = args.slice(1).join(" ").toLowerCase();
            const results = dataGlobal.filter(item => item.input.toLowerCase().includes(keyword));
            if (results.length == 0) return api.sendMessage(getText("searchEmpty"), threadID, messageID);
            const list = results.map((item, i) => `${i + 1}/ ${item.input} => ${item.output} | Category: ${item.category}`).join("\n");
            return api.sendMessage(list, threadID, messageID);
        }

        default: {
            return api.sendMessage(getText("requestKeyword"), threadID, (err, info) => {
                return global.client.handleReply.push({
                    type: "requireInput",
                    name,
                    author: senderID,
                    messageID: info.messageID
                });
            }, messageID);
        }
    }
}