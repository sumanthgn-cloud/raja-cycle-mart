const emailjs = require('@emailjs/nodejs');

export default async function handler(req, res) {
    // CORS Headers to allow Firebase Hosting to call this Vercel API
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow both Vercel and Firebase
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle Preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to_email, to_name, otp } = req.body;

    // Use Private Key from Environment Variables for security
    // The User ID (Public Key) is safe to be hardcoded, but Private Key must be secret
    const PUBLIC_KEY = 'OsE88-Hsi7dIUcDaX';
    const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '_zRkccABwVv-5MaKlW6S';
    const SERVICE_ID = 'service_d7uro8b';
    const TEMPLATE_ID = 'template_6bakgu6';

    if (!PRIVATE_KEY) {
        console.error("Missing EMAILJS_PRIVATE_KEY");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // Initialize with Private Key (Required for NodeJS)
        const emailClient = new emailjs.EmailJS({
            publicKey: PUBLIC_KEY,
            privateKey: PRIVATE_KEY
        });

        await emailClient.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                to_email: to_email,
                to_name: to_name || 'Customer',
                message: otp,
                otp_code: otp,
                code: otp,
                reply_to: to_email
            }
        );

        return res.status(200).json({ success: true, message: 'Email sent successfully via secure API' });
    } catch (error) {
        console.error('Email send failed:', error);
        return res.status(500).json({ success: false, error: error.message || 'Failed to send email' });
    }
}
