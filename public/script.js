document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map centered on Indonesia
    const map = L.map('map').setView([-2.5489, 118.0149], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    const newsListContainer = document.getElementById('news-list');
    let markers = [];

    // Custom red marker icon
    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class='marker-pin'></div>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -35]
    });

    async function fetchNews() {
        try {
            const response = await fetch('/api/news');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            renderNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
            newsListContainer.innerHTML = '<p class="loading">Failed to load reports. Please try again later.</p>';
        }
    }

    function renderNews(newsData) {
        if (!newsData || newsData.length === 0) {
            newsListContainer.innerHTML = '<p class="loading">No reports found at the moment.</p>';
            return;
        }

        newsListContainer.innerHTML = '';

        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        newsData.forEach((item, index) => {
            // Add to sidebar
            const date = new Date(item.pubDate).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const card = document.createElement('div');
            card.className = 'news-card';

            // basic sanitize to prevent html injection from snippet
            const snippet = item.contentSnippet.replace(/<[^>]*>?/gm, '');

            card.innerHTML = `
                <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                <div class="news-meta">
                    <span>📍 ${item.location.name}</span>
                    <span>🕒 ${date}</span>
                </div>
                <div class="news-snippet">${snippet}</div>
            `;

            newsListContainer.appendChild(card);

            // Add marker to map
            // Adding slight random offset so markers at exact same city don't overlap completely
            const latOffset = (Math.random() - 0.5) * 0.05;
            const lngOffset = (Math.random() - 0.5) * 0.05;

            const markerLat = item.location.lat + latOffset;
            const markerLng = item.location.lng + lngOffset;

            const marker = L.marker([markerLat, markerLng], { icon: customIcon })
                .addTo(map)
                .bindPopup(`
                    <b><a href="${item.link}" target="_blank">${item.title}</a></b><br>
                    ${item.location.name}<br>
                    <small>${date}</small>
                `);

            markers.push(marker);

            // Interaction: pan map when clicking sidebar item
            card.addEventListener('click', () => {
                map.flyTo([markerLat, markerLng], 10);
                marker.openPopup();

                // Highlight the clicked card
                document.querySelectorAll('.news-card').forEach(c => c.style.borderLeft = '1px solid #e0e0e0');
                card.style.borderLeft = '4px solid #e74c3c';
            });
        });
    }

    // Initial fetch
    fetchNews();

    // Auto-refresh every 5 minutes
    setInterval(fetchNews, 5 * 60 * 1000);
});
