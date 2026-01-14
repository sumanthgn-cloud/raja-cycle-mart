import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

// 1. Initialize Firebase Admin with your secret key from Vercel env
const app = initializeApp({
<<<<<<< HEAD
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
=======
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
>>>>>>> 0ba7d03 (feat: Initial commit with lucky draw backend)
});
const db = getFirestore(app);

export default async function handler(request, response) {
<<<<<<< HEAD
    console.log('🚀 Lucky draw function triggered at:', new Date().toISOString());

    try {
        // 2. Reference to the entries for the current month
        //    (Assuming you store entries in a monthly collection like 'entries_2024_12')
        const currentMonth = new Date().toISOString().slice(0, 7); // Gets "2024-12"
        const entriesRef = db.collection(`entries_${currentMonth.replace('-', '_')}`);

        const snapshot = await entriesRef.get();

        if (snapshot.empty) {
            console.log('ℹ️ No entries found for this month.');
            return response.status(200).json({
                success: true,
                message: 'Draw completed. No entries found for this month.'
            });
        }

        const entries = [];
        snapshot.forEach(doc => {
            // Only include entries with all required data
            const data = doc.data();
            if (data.name && data.phone && data.luckyCode) {
                entries.push({
                    id: doc.id,
                    name: data.name,
                    phone: data.phone
                });
            }
        });

        console.log(`🎯 Found ${entries.length} valid entries.`);

        // 3. CRITICAL: Use cryptographically secure random selection
        const randomIndex = crypto.randomInt(0, entries.length);
        const winner = entries[randomIndex];
        console.log(`🏆 Winner selected: ${winner.name} (ID: ${winner.id})`);

        // 4. Save the winner to a public 'winners' collection
        const winnerData = {
            name: winner.name,
            phoneMasked: `******${winner.phone.slice(-2)}`, // Mask phone for privacy
            entryId: winner.id,
            month: currentMonth,
            drawnAt: new Date().toISOString(),
            drawnBy: 'automated_lucky_draw_function'
        };

        await db.collection('winners').doc(currentMonth).set(winnerData);
        console.log('✅ Winner saved to Firestore.');

        // 5. Optional: Mark the draw as closed in a config document
        await db.collection('config').doc('draw_status').set({
            lastDrawMonth: currentMonth,
            isActive: false,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        response.status(200).json({
            success: true,
            winner: winnerData,
            totalEntries: entries.length
        });

    } catch (error) {
        console.error('❌ Error in draw function:', error);
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
=======
  console.log('🚀 Lucky draw function triggered at:', new Date().toISOString());

  try {
    // 2. Reference to the entries for the current month
    //    (Assuming you store entries in a monthly collection like 'entries_2024_12')
    const currentMonth = new Date().toISOString().slice(0, 7); // Gets "2024-12"
    const entriesRef = db.collection(`entries_${currentMonth.replace('-', '_')}`);
    
    const snapshot = await entriesRef.get();

    if (snapshot.empty) {
      console.log('ℹ️ No entries found for this month.');
      return response.status(200).json({ 
        success: true, 
        message: 'Draw completed. No entries found for this month.' 
      });
    }

    const entries = [];
    snapshot.forEach(doc => {
      // Only include entries with all required data
      const data = doc.data();
      if (data.name && data.phone && data.luckyCode) {
        entries.push({ 
          id: doc.id, 
          name: data.name,
          phone: data.phone 
        });
      }
    });

    console.log(`🎯 Found ${entries.length} valid entries.`);

    // 3. CRITICAL: Use cryptographically secure random selection
    const randomIndex = crypto.randomInt(0, entries.length);
    const winner = entries[randomIndex];
    console.log(`🏆 Winner selected: ${winner.name} (ID: ${winner.id})`);

    // 4. Save the winner to a public 'winners' collection
    const winnerData = {
      name: winner.name,
      phoneMasked: `******${winner.phone.slice(-2)}`, // Mask phone for privacy
      entryId: winner.id,
      month: currentMonth,
      drawnAt: new Date().toISOString(),
      drawnBy: 'automated_lucky_draw_function'
    };

    await db.collection('winners').doc(currentMonth).set(winnerData);
    console.log('✅ Winner saved to Firestore.');

    // 5. Optional: Mark the draw as closed in a config document
    await db.collection('config').doc('draw_status').set({ 
      lastDrawMonth: currentMonth,
      isActive: false,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    response.status(200).json({ 
      success: true, 
      winner: winnerData,
      totalEntries: entries.length 
    });

  } catch (error) {
    console.error('❌ Error in draw function:', error);
    response.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
>>>>>>> 0ba7d03 (feat: Initial commit with lucky draw backend)
}
