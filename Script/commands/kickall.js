module.exports.config = {
  name: "kickall",
  version: "1.1.0",
  hasPermssion: 2,
  credits: "MAHBUB SHAON (modified by SHAHADAT SAHU)",
  description: "Safely remove all non-admin members, then bot leaves. Requires CONFIRM argument.",
  commandCategory: "box chat",
  usages: "kickall CONFIRM",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  try {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const botID = api.getCurrentUserID();

    // safety: require explicit CONFIRM argument to run
    const confirm = args && args[0] && args[0].toString().toUpperCase() === "CONFIRM";
    if (!confirm) {
      return api.sendMessage(
        "⚠️ Safety: To actually remove members run the command with CONFIRM.\n\nUsage: kickall CONFIRM",
        threadID
      );
    }

    // get thread info & participant IDs
    const threadInfo = await api.getThreadInfo(threadID);
    if (!threadInfo) return api.sendMessage("» Failed to fetch thread info.", threadID);

    // check bot is admin
    const botIsAdmin = threadInfo.adminIDs && threadInfo.adminIDs.some(a => a.id == botID);
    if (!botIsAdmin) return api.sendMessage("» I need group admin rights. Please promote the bot and try again.", threadID);

    // check sender is admin (prevent random member from running)
    const senderIsAdmin = threadInfo.adminIDs && threadInfo.adminIDs.some(a => a.id == senderID);
    if (!senderIsAdmin) return api.sendMessage("» Only group admins can use this command.", threadID);

    // build list of target IDs: exclude bot and all admins
    const participantIDs = threadInfo.participantIDs || [];
    const adminIDs = new Set((threadInfo.adminIDs || []).map(a => a.id.toString()));
    const targets = participantIDs.filter(id => id.toString() !== botID.toString() && !adminIDs.has(id.toString()));

    if (targets.length === 0) {
      // nothing to remove
      await api.sendMessage("» No non-admin members to remove.", threadID);
      return;
    }

    // notify start
    await api.sendMessage(`» Removing ${targets.length} non-admin member(s)... (will leave after done)`, threadID);

    // remove one-by-one with delay to avoid rate limits
    const delay = ms => new Promise(res => setTimeout(res, ms));
    for (let i = 0; i < targets.length; i++) {
      const uid = targets[i];
      try {
        await api.removeUserFromGroup(uid, threadID);
      } catch (err) {
        // log error but continue
        console.error(`Failed to remove ${uid}:`, err);
        // optional: notify admin about failed removal
        await api.sendMessage(`⚠️ Failed to remove: ${uid}`, threadID);
      }
      // small delay (adjust if needed)
      await delay(1200);
    }

    // final message then bot leaves after short delay
    await api.sendMessage("» Done removing non-admins. Bot will leave the group in 5 seconds.", threadID);
    setTimeout(async () => {
      try {
        await api.removeUserFromGroup(botID, threadID);
      } catch (err) {
        console.error("Failed to leave group:", err);
        // as fallback send leave if API requires different call
      }
    }, 5000);

  } catch (error) {
    console.error(error);
    return api.sendMessage("» An unexpected error occurred. See console for details.", event.threadID);
  }
};