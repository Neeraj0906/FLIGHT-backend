// routes/bookingRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const { sendBookingConfirmation } = require('../utils/mailer'); 
require('dotenv').config();

const router = express.Router();

// Define a Booking model
const BookingSchema = new mongoose.Schema({
  flightId: { type: String, required: true },
  userId: { type: String, required: true }, 
  adults: { type: Number, required: true },
  children: { type: Number, required: true },
  departureDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', BookingSchema);

// Middleware to protect routes (import this from authMiddleware)
const authenticateJWT = require('../middleware/authMiddleware');
const User = require('../models/User');

// Create a new booking
// routes/bookingRoutes.js
router.post('/', authenticateJWT, async (req, res) => {
  const { flightId, adults, children, departureDate } = req.body;

  try {
      const existingBooking = await Booking.findOne({ userId: req.userId, flightId });
      if (existingBooking) {
          return res.status(400).json({ error: 'Booking already exists for this flight.' });
      }

      const newBooking = new Booking({
          flightId,
          userId: req.userId,
          adults,
          children,
          departureDate,
      });

      await newBooking.save();

      const user = await User.findById(req.userId);
      console.log(user)

      console.log(user.email);
      await sendBookingConfirmation(user.email, newBooking);
      
      res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
      console.error('Error creating booking:', error.message);
      res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
});

// Route to get user bookings
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId }); 
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Route to delete a booking by ID
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
      const bookingId = req.params.id;
      const result = await Booking.findOneAndDelete({ _id: bookingId, userId: req.userId });

      if (!result) {
          return res.status(404).json({ error: 'Booking not found or you do not have permission to delete this booking.' });
      }

      res.status(200).json({ message: 'Booking deleted successfully.' });
  } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;