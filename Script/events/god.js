const fs = require("fs");
const moment = require("moment-timezone");

module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
	version: "1.0.0",
	credits: "SHAHADAT SAHU",
	description: "Record bot activity notifications!",
	envConfig: {
		enable: true
	}
};

// Auto Restart System Variables
let restartStarted = false;
let restartInterval = null;

// Auto Restart Function
function startAutoRestartSystem(api) {
	if (restartStarted) return;
	restartStarted = true;

	const adminIDs = global.config.ADMINBOT || ["100001039692046"];

	restartInterval = setInterval(() => {
		const timeNow = moment().tz("Asia/Dhaka").format("HH:mm:ss");
		const currentMinute = moment().tz("Asia/Dhaka").format("mm");
		const currentSecond = moment().tz("Asia/Dhaka").format("ss");

		// Check if it's exactly the hour (00 minutes and 00-05 seconds)
		if (currentMinute === "00" && parseInt(currentSecond) < 5) {
			console.log(`AutoRestart: Triggering restart at ${timeNow}`);
			
			for (let admin of adminIDs) {
				api.sendMessage(
					`⚡ System Notice ⚡\nCurrent Time: ${timeNow}\nSystem is restarting...`,
					admin,
					(err) => {
						if (err) {
							console.error("Error sending message to admin:", err);
						}
						// Create restart flag
						const flagData = {
							groupIDs: ["2056569868083458", "1144316580363747"], // Both group IDs
							restartTime: timeNow,
							type: "auto"
						};
						fs.writeFileSync(__dirname + "/autoreset_flag.json", JSON.stringify(flagData, null, 2));
						
						// Restart after a short delay to ensure messages are sent
						setTimeout(() => {
							process.exit(1);
						}, 2000);
					}
				);
			}
		}
	}, 1000);
}

module.exports.run = async function({ api, event, Threads }) {
	const logger = require("../../utils/log");
	if (!global.configModule[this.config.name].enable) return;

	// Start auto restart system when bot starts
	if (!restartStarted) {
		startAutoRestartSystem(api);
	}
	
	let formReport = "=== ─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 Notification ===" +
					"\n\n» Thread ID: " + event.threadID +
					"\n» Action: {task}" +
					"\n» Action created by userID: " + event.author +
					"\n» " + Date.now() + " «";
	
	let task = "";

	switch (event.logMessageType) {
		case "log:thread-name": {
			const oldName = (await Threads.getData(event.threadID)).name || "Name does not exist";
			const newName = event.logMessageData.name || "Name does not exist";
			task = "User changed group name from: '" + oldName + "' to '" + newName + "'";
			await Threads.setData(event.threadID, { name: newName });
			break;
		}
		case "log:subscribe": {
			if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
				task = "The user added the bot to a new group!";
			} else {
				const newMembers = event.logMessageData.addedParticipants;
				task = "New member joined: " + newMembers.map(member => member.fullName).join(", ");
			}
			break;
		}
		case "log:unsubscribe": {
			if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
				task = "The user kicked the bot out of the group!";
			} else {
				task = "User left the group: " + event.logMessageData.leftParticipantFbId;
			}
			break;
		}
		default: 
			break;
	}

	if (task.length === 0) return;

	formReport = formReport.replace(/\{task}/g, task);

	const receivers = [
		"100001039692046",   // Your UID
		"24068781876127034",  // First Group UID
		"1144316580363747"    // New Group UID added
	];

	for (const id of receivers) {
		try {
			await api.sendMessage(formReport, id);
		} catch (error) {
			logger(formReport, "[ Logging Event ]");
		}
	}
};

// After restart - send message to both groups
module.exports.onLoad = function ({ api }) {
	const path = __dirname + "/autoreset_flag.json";
	
	if (fs.existsSync(path)) {
		try {
			const data = JSON.parse(fs.readFileSync(path, "utf8"));
			
			// Add delay to ensure bot is fully loaded
			setTimeout(() => {
				// Send restart message to both groups
				const groupIDs = data.groupIDs || ["2056569868083458", "1144316580363747"];
				
				groupIDs.forEach((groupID, index) => {
					setTimeout(() => {
						api.sendMessage(
							`✅ Bot Restarted Successfully!\n🕒 Restart Time: ${data.restartTime || "Unknown"}\nPowered by Boss SAHU 🔥`,
							groupID,
							(err) => {
								if (err) {
									console.error(`Error sending restart message to group ${groupID}:`, err);
								}
								// Clean up flag file after sending to last group
								if (index === groupIDs.length - 1) {
									try {
										fs.unlinkSync(path);
									} catch (unlinkErr) {
										console.error("Error deleting flag file:", unlinkErr);
									}
								}
							}
						);
					}, index * 2000); // 2 seconds delay between each message
				});
				
			}, 5000);
			
		} catch (err) {
			console.log("AutoReset flag error:", err);
			// Clean up corrupted flag file
			try {
				fs.unlinkSync(path);
			} catch (unlinkErr) {
				console.error("Error deleting corrupted flag file:", unlinkErr);
			}
		}
	}

	// Start auto restart system on bot load
	if (!restartStarted) {
		startAutoRestartSystem(api);
	}
};

// Clean up on module unload
module.exports.onUnload = function () {
	if (restartInterval) {
		clearInterval(restartInterval);
		restartInterval = null;
	}
	restartStarted = false;
};