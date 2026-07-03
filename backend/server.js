require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Log env var status at startup (does not expose values)
console.log('Env check:', {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'MISSING',
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY ? 'SET' : 'MISSING',
});

// Security headers
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-origin' },
}));

// Rate limiting - 100 requests per 15 min per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Debug endpoint - verify env vars are loaded (safe, no secrets exposed)
app.get('/api/debug', (_req, res) => {
    res.json({
        env: {
            SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'MISSING',
            SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY ? 'SET' : 'MISSING',
        },
        node: process.version,
    });
});

// API proxy - fetch bookings from Supabase (server-side only)
app.get('/api/bookings', async (req, res) => {
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing env vars:', {
                url: !!supabaseUrl,
                key: !!supabaseKey,
            });
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        const response = await fetch(
            `${supabaseUrl}/rest/v1/bookvenuebmc?select=*&order=Date.desc`,
            {
                headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const body = await response.text();
            console.error('Supabase error:', response.status, body);
            throw new Error(`Supabase returned ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('API error:', error.message);
        res.status(502).json({ error: 'Failed to fetch booking data.' });
    }
});

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use(express.static(path.join(__dirname, '../frontend')));

// SPA fallback
app.get('*splat', (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Global error handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` BMC Venue Booking Server running on port ${PORT}`);
    console.log(` App is live at: http://localhost:${PORT}`);
    console.log(`==================================================`);
});
