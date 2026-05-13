<div align="center">
  <img src="public/logo.svg" alt="GovMon Logo" width="200" height="200">
  <h1>GovMon</h1>
  <p><strong>Indonesia Government Project & Corruption Monitor</strong></p>
  <p>A real-time web application to track and visualize public, open-source information regarding corruption, stalled projects, and other government-related anomalies in Indonesia.</p>
</div>

---

## 📌 Overview

GovMon aggregates news related to government corruption, bribery cases, and absurd or stalled public projects across Indonesia. It provides a real-time, interactive map utilizing Leaflet.js to pinpoint exactly where these reports are originating from, ensuring transparency and public awareness.

## ✨ Features

- **Real-Time News Aggregation:** Automatically scrapes the latest public news from Google News RSS using targeted keywords.
- **Interactive Mapping:** Visualizes news locations on an interactive map of Indonesia using Leaflet.js.
- **Automated Updates:** A background worker fetches new data every hour, keeping the feed constantly up-to-date.
- **Smart Geocoding:** Simple natural language parsing to extract Indonesian regional locations from news context and plot them accurately.

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Scraping:** `rss-parser`, `node-cron`
- **Frontend:** Vanilla HTML/CSS/JS, Leaflet.js (for interactive maps)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/faridhafizh/govmon.git
   cd govmon
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   node server.js
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📂 Project Structure

```
govmon/
│
├── public/               # Frontend static assets
│   ├── index.html        # Main entry point
│   ├── style.css         # UI Styling
│   ├── script.js         # Frontend logic and Leaflet integration
│   └── logo.svg          # GovMon Logo
│
├── scraper.js            # RSS parsing and geolocation logic
├── server.js             # Express API server
├── package.json          # Node dependencies
└── README.md             # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request if you have ideas on how to improve the NLP geocoding, expand the keyword search, or enhance the UI.

## 📝 License

This project is licensed under the ISC License.
