const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ensure this is correctly set
const router = express.Router();

// Endpoint to create a payment
router.post('/create-payment', async (req, res) => {
    const { amount, currency, source } = req.body; // amount should be in cents

    try {
        const charge = await stripe.charges.create({
            amount,
            currency,
            source,
            description: 'Flight Booking Charge',
        });
        res.status(200).json({ success: true, charge });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

module.exports = router;