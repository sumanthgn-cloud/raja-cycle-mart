import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Singleton initialization to prevent "App already exists" error in hot-reload envs
if (getApps().length === 0) {
    initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    });
}

const db = getFirestore();

export default async function handler(request, response) {
    try {
        // Get the latest winner
        const winnersRef = db.collection('winners');
        const snapshot = await winnersRef.orderBy('drawnAt', 'desc').limit(1).get();

        if (snapshot.empty) {
            return response.status(200).json({ success: true, winner: null });
        }

        const doc = snapshot.docs[0];
        const winnerData = doc.data();

        return response.status(200).json({
            success: true,
            winner: winnerData
        });

    } catch (error) {
        console.error('Error fetching winner:', error);
        return response.status(500).json({ success: false, error: 'Failed to fetch winner' });
    }
}
