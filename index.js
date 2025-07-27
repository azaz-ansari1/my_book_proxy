const express = require('express');
const fetch = require('node-fetch');

const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Proxy route
app.get('/api/books', async (req, res) => {
  try {
    const response = await fetch('https://bookfinder.is-great.org/get_books.php');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy failed: ' + error.message });
  }
});

// Export for Vercel
module.exports = app;
