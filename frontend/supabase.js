const SUPABASE_URL = 'https://uhulzdjzdkchiywjiayj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodWx6ZGp6ZGtjaGl5d2ppYXlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc0NDMyNiwiZXhwIjoyMDk2MzIwMzI2fQ.h7oU8wpPIDPofzy7B_1c4jgNVWiR80n5JHrF_T4muMw';

async function fetchBookings() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/bookvenuebmc?select=*&order=Date.desc`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
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
