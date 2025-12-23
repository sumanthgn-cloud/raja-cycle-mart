const emailjs = require('@emailjs/nodejs');

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
    const PUBLIC_KEY = 'OsE88-Hsi7dIUcDaX';
    const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '_zRkccABwVv-5MaKlW6S';
    const SERVICE_ID = 'service_d7uro8b';
    const TEMPLATE_ID = 'template_6bakgu6';

    try {
        // Use the explicit Options object in the 4th argument
        // This is the most reliable way to pass keys in Node.js strict mode
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                to_email: to_email,
                to_name: to_name || 'Customer',
                message: otp.toString(),
                otp_code: otp.toString(),
                code: otp.toString(),
                reply_to: to_email
            },
            {
                publicKey: PUBLIC_KEY.trim(),
                privateKey: PRIVATE_KEY.trim()
            }
        );

        console.log("EmailJS Success:", response);
        return res.status(200).json({ success: true, message: 'OTP sent successfully!' });

    } catch (error) {
        console.error('EmailJS Server Error:', error);

        // Return a clear error message
        return res.status(500).json({
            success: false,
            error: error.text || error.message || 'Email delivery failed',
            debug: "Strict mode failure. Check Private Key."
        });
    }
}
