module.exports.config = {
	name: "kick",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "SHAHADAT SAHU",
	description: "Kick by replying mention or auto-remove spammers",
	commandCategory: "System",
	usages: "[tag or reply]",
	cooldowns: 0,
};

const spamTracker = {}; 
const warningLimit = 2; 

module.exports.run = async function({ api, event, Threads }) {
	const mention = Object.keys(event.mentions);
	let targetID;

	try {
		const threadInfo = (await Threads.getData(event.threadID)).threadInfo;
		const botID = api.getCurrentUserID();
		const senderID = event.senderID;

		if (!threadInfo.adminIDs.some(e => e.id == botID))
			return api.sendMessage("কাওকে Group থেকে kick করানোর জন্য আগে আমাকে Group এডমিন দিতে হবে 😒.", event.threadID, event.messageID);

		if (event.type === "message_reply") targetID = event.messageReply.senderID;
		else if (mention.length > 0) targetID = mention[0];
		else return api.sendMessage("Please tag or reply to the user you want to remove..!🤌", event.threadID, event.messageID);

		if (!threadInfo.adminIDs.some(e => e.id == senderID))
			return api.sendMessage("Only group admins can use this command✅", event.threadID, event.messageID);

		api.sendMessage(`Removing user...`, event.threadID, () => {
			setTimeout(() => {
				api.removeUserFromGroup(targetID, event.threadID);
			}, 2000);
		});

	} catch (err) {
		console.error(err);
		return api.sendMessage("Something went wrong. Please try again‼️", event.threadID, event.messageID);
	}
};

module.exports.handleEvent = async function({ api, event, Threads }) {
	try {
		const threadInfo = (await Threads.getData(event.threadID)).threadInfo;
		const botID = api.getCurrentUserID();
		if (!threadInfo.adminIDs.some(e => e.id == botID)) return;

		const userID = event.senderID;
		const threadID = event.threadID;
		const now = Date.now();

		if (!spamTracker[threadID]) spamTracker[threadID] = {};
		if (!spamTracker[threadID][userID]) {
			spamTracker[threadID][userID] = { times: [], warnings: 0 };
		}

		spamTracker[threadID][userID].times.push(now);
		spamTracker[threadID][userID].times = spamTracker[threadID][userID].times.filter(t => now - t < 2 * 60 * 1000);

		if (spamTracker[threadID][userID].times.length >= 15) {
			spamTracker[threadID][userID].times = [];

			if (spamTracker[threadID][userID].warnings < warningLimit) {
				spamTracker[threadID][userID].warnings += 1;
				api.sendMessage(
					` Hey ${userID}, This is warning ${spamTracker[threadID][userID].warnings} for spamming. Stop now or you'll be removed!`,
					threadID
				);
			} else {
				api.sendMessage(
					`🚫 User ${userID} ignored warnings. Removing from group...`,
					threadID,
					() => {
						setTimeout(() => {
							api.removeUserFromGroup(userID, threadID);
							spamTracker[threadID][userID].warnings = 0; // reset warnings
						}, 2000);
					}
				);
			}
		}

	} catch (e) {
		console.error(e);
	}
};