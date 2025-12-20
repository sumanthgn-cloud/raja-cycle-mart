export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { name, phone, problem } = req.body;

        if (!name || !phone || !problem) {
            return res.status(400).json({
                error: "Name, Phone, and Problem are required",
            });
        }

        // Backend Validation: 10-digit mobile number starting with 6-9
        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ error: "Invalid phone number" });
        }

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        const now = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
        });

        const message = `
🛎️ NEW SERVICE REQUEST – Raja Cycle Mart

👤 Name: ${name}
📞 Phone: ${phone}
🔧 Problem: ${problem}
⏰ Time: ${now}
📍 SS Puram, Tumkur

(Pending Confirmation: Call customer to set time)
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
            const errorData = await tgRes.json();
            throw new Error(`Telegram Error: ${errorData.description}`);
        }

        return res.status(200).json({
            success: true,
            message: "Request received",
        });
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    }
}
