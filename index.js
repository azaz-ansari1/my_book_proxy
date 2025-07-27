const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/api/books', async (req, res) => {
  try {
    const response = await fetch('https://bookfinder.is-great.org/get_books.php', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://bookfinder.is-great.org/',
        'DNT': '1',
        'Connection': 'keep-alive'
      }
    });

    const data = await response.text();
    if (data.includes('<html>')) {
      throw new Error('Cloudflare challenge page detected');
    }
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({
      error: 'Cloudflare bypass failed',
      details: error.message,
      advancedSolution: 'Implement headless browser or contact website owner'
    });
  }
});
