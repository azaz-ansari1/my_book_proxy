const express = require('express');
const fetch = require('node-fetch');

const app = express();

// Middleware to prevent crashes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  next();
});

app.get('/api/books', async (req, res) => {
  try {
    // 1. Add timeout to prevent hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    // 2. Browser-like headers
    const response = await fetch('https://bookfinder.is-great.org/get_books.php', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
      }
    });

    clearTimeout(timeout);

    // 3. Validate response
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Proxy crash prevented:', error);
    res.status(500).json({
      status: 'error',
      message: 'Proxy server error',
      details: error.message
    });
  }
});

// Export with error handling
module.exports = app;
