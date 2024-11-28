// utils/mailer.js
const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

const sendBookingConfirmation = (to, booking, chargeId) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to || 'eng20cs0301.neeraj@gmail.com', // Use a default email if 'to' is undefined
        subject: 'Booking Confirmation',
        text: `Your booking has been confirmed!\n\nDetails:\nFlight ID: ${booking.flightId}\nAdults: ${booking.adults}\nChildren: ${booking.children}\nDeparture Date: ${new Date(booking.departureDate).toLocaleString()}\n\nPayment Details:\nCharge ID: ${chargeId}\nAmount Charged: $${booking.amount / 100}`, // Assuming amount is passed in cents
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation };