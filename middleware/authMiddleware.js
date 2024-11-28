// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header

    console.log('Token:', token); // Log the token for debugging

    if (!token) return res.sendStatus(403); // Forbidden if no token

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid
        req.userId = user.id; // Store user ID for later use
        req.userEmail = user.email; // Store user email for sending confirmation email
        console.log('User Email:', user.email); // Log user email to check if it's set correctly
        next();
    });
};

module.exports = authenticateJWT;