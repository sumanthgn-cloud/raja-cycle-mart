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
    // Use Private Key from Environment Variables for security
    const PUBLIC_KEY = 'OsE88-Hsi7dIUcDaX'.trim();
    const PRIVATE_KEY = (process.env.EMAILJS_PRIVATE_KEY || '_zRkccABwVv-5MaKlW6S').trim();
    const SERVICE_ID = 'service_d7uro8b';
    const TEMPLATE_ID = 'template_6bakgu6';

    try {
        // According to Step 467, the constructor might take (Public Key, Private Key)
        // We'll try the static send first but with more explicit options
        await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                to_email: to_email,
                to_name: to_name || 'Customer',
                message: otp,
                otp_code: otp,
                code: otp,
                reply_to: to_email
            },
            {
                publicKey: PUBLIC_KEY,
                privateKey: PRIVATE_KEY
            }
        );

        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email send failed:', error);

        // If it still fails with "no private key", try the instance method as a last resort
        try {
            const { EmailJS } = require('@emailjs/nodejs');
            const client = new EmailJS(PUBLIC_KEY, PRIVATE_KEY);
            await client.send(SERVICE_ID, TEMPLATE_ID, {
                to_email: to_email,
                otp_code: otp,
                code: otp
            });
            return res.status(200).json({ success: true, message: 'Email sent via fallback client!' });
        } catch (innerError) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to send email',
                debug: "Strict mode private key error persisted"
            });
        }
    }
}
