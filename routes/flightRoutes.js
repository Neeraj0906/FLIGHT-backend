const express = require('express');
const axios = require('axios');
require('dotenv').config();
const qs = require('qs'); // Import querystring library

const router = express.Router();

// Function to get access token from Amadeus
const getAccessToken = async () => {
  console.log('Client ID:', process.env.AMADEUS_CLIENT_ID);
  console.log('Client Secret:', process.env.AMADEUS_CLIENT_SECRET);

  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
      qs.stringify({ // Use qs to stringify the parameters
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Set correct content type
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error retrieving access token:', error.response?.data || error.message);
    throw new Error('Failed to retrieve access token');
  }
};

// Search Flights
router.get('/search', async (req, res) => {
  const { originLocationCode, destinationLocationCode, departureDate, adults, children } = req.query;

  console.log('Received search parameters:', req.query); // Log received parameters

  try {
    const accessToken = await getAccessToken();

    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults,
        children,
        nonStop: false, // Optional parameter
        max: 250, // Optional parameter
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching flight offers:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching flight offers', details: error.response?.data || error.message });
  }
});

// Test Token Endpoint
router.get('/test-token', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve access token', details: error.message });
  }
});

module.exports = router;