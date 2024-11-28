// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Login route example
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate username and password...
    const user = await User.findOne({ username }); // Find user by username

    if (!user || !user.comparePassword(password)) { // Assuming you have a method to compare passwords
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT with user ID and email
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.json({ token }); // Send back the token to the client
});

module.exports = router;