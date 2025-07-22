// Initialize Leaflet map
const map = L.map('map').setView([-33.8688, 151.2093], 8); // Centered on Sydney, NSW

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Global variable to hold GeoJSON layer
let suburbLayer;

// Load NSW suburbs GeoJSON from main folder
fetch('nsw-suburbs.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        // Store original GeoJSON data
        suburbLayer = L.geoJSON(geojsonData, {
            onEachFeature: function (feature, layer) {
                const name = feature.properties.SA2_NAME16 || "Unknown";
                layer.bindPopup(`<strong>${name}</strong>`);
                layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
            style: {
                color: '#555',
                weight: 1,
                fillOpacity: 0.2
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Failed to load suburb data:', error);
    });

// Handle postcode search
function searchPostcodes() {
    const input = document.getElementById('postcode-input').value;
    const postcodes = input.split(',').map(code => code.trim());

    if (!suburbLayer) return;

    // Clear existing highlights
    suburbLayer.eachLayer(layer => {
        suburbLayer.resetStyle(layer);
    });

    // Highlight matching suburbs
    suburbLayer.eachLayer(layer => {
        const suburbName = layer.feature.properties.SA2_NAME16 || '';
        const matches = postcodes.some(code =>
            suburbName.toLowerCase().includes(code.toLowerCase())
        );

        if (matches) {
            layer.setStyle({
                color: 'blue',
                fillColor: 'orange',
                fillOpacity: 0.6
            });
            layer.openPopup();
        }
    });
}
