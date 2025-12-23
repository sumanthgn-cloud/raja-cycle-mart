export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to_email, to_name, otp } = req.body;

    // Configuration - HARDCODED FALLBACK FOR CERTAINTY
    const USER_ID = 'OsE88-Hsi7dIUcDaX';
    const SERVICE_ID = 'service_d7uro8b';
    const TEMPLATE_ID = 'template_6bakgu6';
    // Prioritize fallback key if env is not found to ensure it works
    const ACCESS_TOKEN = '_zRkccABwVv-5MaKlW6S_';

    console.log(`EmailJS Request: to=${to_email}, service=${SERVICE_ID}, template=${TEMPLATE_ID}`);

    try {
        const payload = {
            service_id: SERVICE_ID,
            template_id: TEMPLATE_ID,
            user_id: USER_ID,
            accessToken: ACCESS_TOKEN,
            template_params: {
                to_email: to_email,
                otp_code: otp.toString(),
                email: to_email,
                code: otp.toString(),
                to_name: to_name || 'Customer'
            }
        };

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const statusText = await response.text();

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            // Log the actual payload (excluding full access token for safety, just show length)
            console.error(`EmailJS Failed. Status: ${response.status}, TokenLen: ${ACCESS_TOKEN.length}, Response: ${statusText}`);

            // If it still says "no private key", try passing it as 'secret_key' (older EmailJS param)
            const fallbackPayload = { ...payload, secret_key: ACCESS_TOKEN };
            const response2 = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                body: JSON.stringify(fallbackPayload),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response2.ok) return res.status(200).json({ success: true });

            return res.status(response.status).json({
                success: false,
                error: statusText,
                debug: "Strict mode error persists even with hardcoded key."
            });
        }

    } catch (error) {
        console.error('API Handler Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
