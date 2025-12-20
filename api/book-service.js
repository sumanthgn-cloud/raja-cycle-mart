export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { name, phone, problem } = req.body;

        if (!name || !problem) {
            return res.status(400).json({
                error: "Name and problem are required",
            });
        }

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        const now = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
        });

        const message = `
🚲 NEW BOOKING – Raja Cycle Mart

👤 Name: ${name}
📞 Phone: ${phone || "Not provided"}
🔧 Problem: ${problem}
⏰ Time: ${now}
📍 SS Puram, Tumkur
    `;

        const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const tgRes = await fetch(telegramURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
            }),
        });

        if (!tgRes.ok) {
            throw new Error("Telegram API failed");
        }

        return res.status(200).json({
            success: true,
            message: "Booking sent successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Something went wrong",
        });
    }
}
