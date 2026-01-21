export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { name, email, phone, problem } = req.body;

        if (!problem) {
            return res.status(400).json({
                error: "Problem description is required",
            });
        }

        // Generate Booking ID (RCM-YYYYMMDD-HHMMSS)
        const now = new Date();
        const datePart = now.toISOString().split('T')[0].replace(/-/g, '');
        const timePart = now.toTimeString().split(' ')[0].replace(/:/g, '');
        const bookingId = `RCM-${datePart}-${timePart}`;

        // Suggested Internal Time Window logic
        const hour = now.getHours();
        let suggestedTime;
        if (hour < 12) {
            suggestedTime = "11:00 AM – 1:00 PM";
        } else if (hour < 17) {
            suggestedTime = "4:00 PM – 6:00 PM";
        } else {
            suggestedTime = "Next day morning";
        }

        const BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_TOKEN || process.env.TELEGRAM_).trim();
        const CHAT_ID = process.env.CHAT_ID?.trim();

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error("Missing Telegram configuration");
            return res.status(500).json({
                error: "Internal Error: Server configuration issue.",
            });
        }

        const formattedName = name?.trim() || "Not shared";
        const formattedEmail = email?.trim() || "Not shared";
        const formattedPhone = phone?.trim() || "Will WhatsApp";

        const message = `
🚲 *New Service Request*

🆔 ID: ${bookingId}
👤 Name: ${formattedName}
📧 Email: ${formattedEmail}
🔧 Problem: ${problem}
📞 Phone: ${formattedPhone}
⏰ Suggested Time: ${suggestedTime}
📍 SS Puram, Tumkur
        `;

        const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const tgRes = await fetch(telegramURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            }),
        });

        if (!tgRes.ok) {
            const errorData = await tgRes.json();
            throw new Error(`Telegram Error: ${errorData.description}`);
        }

        return res.status(200).json({
            success: true,
            bookingId: bookingId,
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
