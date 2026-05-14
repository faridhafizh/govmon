const express = require('express');
const cors = require('cors');
const path = require('path');
const scraper = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Start the background scraper when the server starts
scraper.initScraper();

// API endpoint to get the latest news
app.get('/api/news', (req, res) => {
    const news = scraper.getNews();
    res.json(news);
});

// Fallback to index.html for any other request (SPA support if needed)
app.get('/*path', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
