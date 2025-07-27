const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/books', async (req, res) => {
  try {
    // Add browser-like headers to bypass Cloudflare
    const response = await fetch('https://bookfinder.is-great.org/get_books.php', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    
    const contentType = response.headers.get('content-type');
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      // If we get HTML, show the error
      const html = await response.text();
      console.error('Cloudflare challenge received:', html.substring(0, 100));
      res.status(500).json({ 
        error: 'Cloudflare protection triggered',
        solution: 'Try again later or implement headless browser solution'
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed', details: error.message });
  }
});

module.exports = app;
