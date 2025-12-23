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

    // Configuration with Fallback
    const PUBLIC_KEY = 'OsE88-Hsi7dIUcDaX'.trim();
    const PRIVATE_KEY = (process.env.EMAILJS_PRIVATE_KEY || '_zRkccABwVv-5MaKlW6S').trim();
    const SERVICE_ID = 'service_d7uro8b';
    const TEMPLATE_ID = 'template_6bakgu6';

    console.log(`EmailJS Server Sync: Attempting send to ${to_email} (Private Key Fallback: ${!process.env.EMAILJS_PRIVATE_KEY})`);

    try {
        // Step 1: Initialize with Private Key (Standard procedure for Node.js / Strict Mode)
        emailjs.init({
            publicKey: PUBLIC_KEY,
            privateKey: PRIVATE_KEY
        });

        // Step 2: Send
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
            }
        );

        console.log("EmailJS Server Success:", response);
        return res.status(200).json({ success: true, message: 'Email sent!' });

    } catch (error) {
        console.error('EmailJS Server Fatal Error:', error);
        return res.status(500).json({
            success: false,
            error: error.text || error.message || 'Email delivery failed',
            debug: "Check EmailJS 'Strict Mode' settings in your dashboard."
        });
    }
}
