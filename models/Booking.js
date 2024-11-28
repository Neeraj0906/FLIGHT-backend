// server/models/Booking.js
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    flightDetails: { type: Object, required: true }, // Store flight details
    chargeId: { type: String }, // New field for storing Stripe charge ID
    amount: { type: Number, required: true }, // Amount charged in cents
    departureDate: { type: Date, required: true }, // Departure date of the flight
    timestamp: { type: Date, default: Date.now }, // Timestamp for booking
});

module.exports = mongoose.model("Booking", BookingSchema);