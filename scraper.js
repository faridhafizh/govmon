const Parser = require('rss-parser');
const cron = require('node-cron');

const parser = new Parser();

// In-memory store for news
let newsData = [];

// Dictionary of Indonesian regions/cities and their coordinates
const locationDict = {
    "jakarta": { lat: -6.2088, lng: 106.8456, name: "Jakarta" },
    "surabaya": { lat: -7.2504, lng: 112.7688, name: "Surabaya" },
    "bandung": { lat: -6.9147, lng: 107.6098, name: "Bandung" },
    "medan": { lat: 3.5952, lng: 98.6722, name: "Medan" },
    "semarang": { lat: -6.9932, lng: 110.4203, name: "Semarang" },
    "makassar": { lat: -5.1477, lng: 119.4327, name: "Makassar" },
    "palembang": { lat: -2.9909, lng: 104.7566, name: "Palembang" },
    "tangerang": { lat: -6.1702, lng: 106.6403, name: "Tangerang" },
    "depok": { lat: -6.4025, lng: 106.7942, name: "Depok" },
    "bekasi": { lat: -6.2383, lng: 106.9756, name: "Bekasi" },
    "bogor": { lat: -6.5971, lng: 106.7905, name: "Bogor" },
    "papua": { lat: -4.2699, lng: 138.0804, name: "Papua" },
    "bali": { lat: -8.4095, lng: 115.1889, name: "Bali" },
    "aceh": { lat: 4.6951, lng: 96.8225, name: "Aceh" },
    "yogyakarta": { lat: -7.7956, lng: 110.3695, name: "Yogyakarta" },
    "maluku": { lat: -3.2385, lng: 130.1453, name: "Maluku" },
    "sulawesi": { lat: -1.4064, lng: 121.4111, name: "Sulawesi" },
    "kalimantan": { lat: 1.0827, lng: 114.1601, name: "Kalimantan" },
    "sumatera": { lat: -0.5897, lng: 101.3431, name: "Sumatera" },
    "jawa": { lat: -7.6145, lng: 110.7128, name: "Jawa" },
    // default location if not found, put it central indonesia or capital
    "indonesia": { lat: -0.7893, lng: 113.9213, name: "Indonesia" }
};

// Search keywords relevant to the prompt (Indonesian corruption/absurd government projects)
const searchQueries = [
    "korupsi pemerintah indonesia",
    "kpk tersangka proyek",
    "proyek mangkrak pemerintah",
    "kasus suap pejabat",
    "anggaran janggal pemerintah"
];

function extractLocation(text) {
    if (!text) return locationDict["indonesia"];

    const lowerText = text.toLowerCase();
    for (const [key, value] of Object.entries(locationDict)) {
        if (lowerText.includes(key) && key !== "indonesia" && key !== "jawa" && key !== "sumatera" && key !== "kalimantan" && key !== "sulawesi") {
            return value;
        }
    }
    // Try broader regions if specific cities aren't found
    for (const [key, value] of Object.entries(locationDict)) {
        if (lowerText.includes(key) && key !== "indonesia") {
            return value;
        }
    }
    return locationDict["indonesia"]; // default
}

async function fetchNews() {
    console.log("Fetching new data from Google News...");
    let newItems = [];

    for (const query of searchQueries) {
        try {
            // Encode the query for URL
            const encodedQuery = encodeURIComponent(query);
            // Google News RSS feed for specific queries, language set to ID
            const feedUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=id&gl=ID&ceid=ID:id`;

            const feed = await parser.parseURL(feedUrl);

            feed.items.forEach(item => {
                // Ensure unique items using link as an ID
                if (!newItems.find(i => i.link === item.link) && !newsData.find(i => i.link === item.link)) {
                    const loc = extractLocation(item.title + " " + item.contentSnippet);

                    newItems.push({
                        title: item.title,
                        link: item.link,
                        pubDate: item.pubDate,
                        contentSnippet: item.contentSnippet || item.content || "No description available.",
                        source: item.source || "Google News",
                        location: loc
                    });
                }
            });

        } catch (error) {
            console.error(`Error fetching news for query "${query}":`, error.message);
        }
    }

    // Sort new items by date, descending
    newItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Append new items to the top of our in-memory store
    if (newItems.length > 0) {
        newsData = [...newItems, ...newsData];
        // Keep only the latest 200 to prevent memory leak
        if (newsData.length > 200) {
            newsData = newsData.slice(0, 200);
        }
        console.log(`Added ${newItems.length} new articles.`);
    } else {
        console.log("No new articles found.");
    }
}

function initScraper() {
    // Run immediately on start
    fetchNews();

    // Schedule to run every hour
    cron.schedule('0 * * * *', () => {
        fetchNews();
    });
}

function getNews() {
    return newsData;
}

module.exports = {
    initScraper,
    getNews
};
