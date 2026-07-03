async function fetchBookings() {
    try {
        const response = await fetch('/api/bookings');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return await response.json();
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}
