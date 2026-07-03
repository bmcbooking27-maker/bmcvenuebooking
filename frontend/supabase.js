const SUPABASE_URL = 'https://uhulzdjzdkchiywjiayj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_4WKtinY-9NmBJoy8GT2O1w_kWYE3gJJ';

async function fetchBookings() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/bookvenuebmc?select=*&order=Date.desc`,
            {
                headers: {
                    apikey: SUPABASE_PUBLISHABLE_KEY,
                    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return await response.json();
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}
