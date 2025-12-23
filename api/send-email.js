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

    // Configuration
    const USER_ID = 'OsE88-Hsi7dIUcDaX';
    const SERVICE_ID = 'service_d7uro8b';
    const TEMPLATE_ID = 'template_6bakgu6';
    const ACCESS_TOKEN = process.env.EMAILJS_PRIVATE_KEY || '_zRkccABwVv-5MaKlW6S';

    try {
        // BYPASSING SDK: Calling EmailJS REST API directly for maximum reliability
        // In "Strict Mode", the REST API expects "accessToken" which is your Private Key
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: SERVICE_ID,
                template_id: TEMPLATE_ID,
                user_id: USER_ID,
                accessToken: ACCESS_TOKEN.trim(),
                template_params: {
                    to_email: to_email,
                    to_name: to_name || 'Customer',
                    otp_code: otp.toString(),
                    code: otp.toString(),
                    email: to_email,
                    message: otp.toString()
                }
            })
        });

        const statusText = await response.text();

        if (response.ok) {
            console.log("EmailJS Success:", statusText);
            return res.status(200).json({ success: true, message: 'OTP sent successfully!' });
        } else {
            console.error("EmailJS API Error:", statusText);
            throw new Error(`EmailJS API Error: ${statusText}`);
        }

    } catch (error) {
        console.error('REST API Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Email delivery failed',
            debug: "Check your Private Key (AccessToken) and Template ID in EmailJS."
        });
    }
}
