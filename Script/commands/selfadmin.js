module.exports.config = {
	name: "self",
	version: "2.0.0",
	hasPermssion: 2,
	credits: "SHAHADAT SAHU",
	description: "Manage bot admins (only specific UIDs can use)",
	commandCategory: "config",
	usages: "[list/add/remove] [userID]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.languages = {
	"en": {
		"listAdmin": "[Admin] Admin list:\n\n%1",
		"notHavePermssion": "[Admin] You don’t have permission to use '%1'",
		"addedNewAdmin": "[Admin] Added %1 admin(s):\n\n%2",
		"removedAdmin": "[Admin] Removed %1 admin(s):\n\n%2"
	}
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
	const content = args.slice(1);
	const { threadID, messageID, mentions } = event;
	const { configPath } = global.client;
	const { ADMINBOT } = global.config;
	const { writeFileSync } = global.nodemodule["fs-extra"];
	const mention = Object.keys(mentions);
	delete require.cache[require.resolve(configPath)];
	let config = require(configPath);

	// 🔒 Only these UIDs can use this command
	const allowedUIDs = ["100001039692046", "100089047474463"];
	if (!allowedUIDs.includes(event.senderID)) {
		return api.sendMessage(getText("notHavePermssion", "admin control"), threadID, messageID);
	}

	switch (args[0]) {
		case "list":
		case "all":
		case "-a": {
			const listAdmin = ADMINBOT || config.ADMINBOT || [];
			let msg = [];

			for (const idAdmin of listAdmin) {
				if (parseInt(idAdmin)) {
					const name = await Users.getNameUser(idAdmin);
					msg.push(`- ${name} (https://facebook.com/${idAdmin})`);
				}
			}

			return api.sendMessage(getText("listAdmin", msg.join("\n")), threadID, messageID);
		}

		case "add": {
			let listAdd = [];

			if (mention.length !== 0 && isNaN(content[0])) {
				for (const id of mention) {
					if (!ADMINBOT.includes(id)) {
						ADMINBOT.push(id);
						config.ADMINBOT.push(id);
						listAdd.push(`[ ${id} ] » ${event.mentions[id]}`);
					}
				}
			} else if (content.length !== 0 && !isNaN(content[0])) {
				if (!ADMINBOT.includes(content[0])) {
					ADMINBOT.push(content[0]);
					config.ADMINBOT.push(content[0]);
					const name = await Users.getNameUser(content[0]);
					listAdd.push(`[ ${content[0]} ] » ${name}`);
				}
			} else return global.utils.throwError(this.config.name, threadID, messageID);

			writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
			return api.sendMessage(getText("addedNewAdmin", listAdd.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
		}

		case "remove":
		case "rm":
		case "delete": {
			let listRemoved = [];

			if (mention.length !== 0 && isNaN(content[0])) {
				for (const id of mention) {
					const index = config.ADMINBOT.findIndex(item => item == id);
					if (index !== -1) {
						ADMINBOT.splice(index, 1);
						config.ADMINBOT.splice(index, 1);
						listRemoved.push(`[ ${id} ] » ${event.mentions[id]}`);
					}
				}
			} else if (content.length !== 0 && !isNaN(content[0])) {
				const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
				if (index !== -1) {
					ADMINBOT.splice(index, 1);
					config.ADMINBOT.splice(index, 1);
					const name = await Users.getNameUser(content[0]);
					listRemoved.push(`[ ${content[0]} ] » ${name}`);
				}
			} else return global.utils.throwError(this.config.name, threadID, messageID);

			writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
			return api.sendMessage(getText("removedAdmin", listRemoved.length, listRemoved.join("\n").replace(/\@/g, "")), threadID, messageID);
		}

		default:
			return global.utils.throwError(this.config.name, threadID, messageID);
	}
};