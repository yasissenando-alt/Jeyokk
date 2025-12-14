const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.1",
    credits: "chill",
    description: "Interact with Phind-like AI",
    hasPrefix: false,
    cooldown: 0,
    aliases: ["phindai","ai"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const q = args.join(" ");
        if (!q) {
            return api.sendMessage(
                "Please provide a question.\nExample: ai what is capital of philippines?",
                event.threadID,
                event.messageID
            );
        }

        // Send loading message
        await api.sendMessage(
            "🔁Lorex Ai is processing your question…",
            event.threadID
        );

        // Get user info
        const userInfo = await api.getUserInfo(event.senderID);
        const senderName = userInfo[event.senderID]?.name || "Unknown User";

        // Call your new API
        const { data } = await axios.get(
            "https://api.ccprojectsapis-jonell.gleeze.com/api/phindai",
            {
                params: { q },
                timeout: 15000
            }
        );

        if (!data || !data.result) {
            throw new Error("Invalid API response");
        }

        const finalMessage = `${data.result}\n\n👤 Asked by: ${senderName}`;

        api.sendMessage(finalMessage, event.threadID);

    } catch (error) {
        console.error("AI Command Error:", error);
        api.sendMessage(
            "❌ An error occurred while processing your request.",
            event.threadID
        );
    }
};
            
