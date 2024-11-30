const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const bookingRoutes = require('./routes/bookingRoutes'); // Import booking routes
const flightRoutes = require('./routes/flightRoutes'); // Import flight routes
const paymentRoutes = require('./routes/paymentRoutes'); // Adjust path as necessary
require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'https://flight-frontend-zeta.vercel.app'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Middleware
app.use(helmet());
app.use(express.json()); // Parse JSON bodies

// Set Content Security Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;");
    next();
});

// Use payment routes
app.use('/api/payments', paymentRoutes);

// Connect to MongoDB
connectDB();

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Flight Booking API is running!');
});

// Use routes
app.use('/api/auth', authRoutes); // Prefix for authentication routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/bookings', bookingRoutes); // Booking-related routes
app.use('/api/flights', flightRoutes); // Flight-related routes

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});