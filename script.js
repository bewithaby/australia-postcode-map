let map = L.map('map').setView([-25, 135], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 16,
  attribution: '© OpenStreetMap'
}).addTo(map);

let geojsonLayer;
const colorPool = ['red', 'blue', 'green', 'purple', 'orange', 'brown'];

document.getElementById('searchBtn').addEventListener('click', () => {
  const postcodes = document.getElementById('postcodeInput').value
    .split(',')
    .map(p => p.trim());
  const sameColor = document.getElementById('sameColor').checked;

  if (geojsonLayer) {
    map.removeLayer(geojsonLayer);
  }

  fetch('aus-postcodes.geojson')
    .then(res => res.json())
    .then(data => {
      let matched = [];
      geojsonLayer = L.geoJSON(data, {
        style: function (feature) {
          if (postcodes.includes(feature.properties.postcode)) {
            let color = sameColor
              ? 'blue'
              : colorPool[postcodes.indexOf(feature.properties.postcode) % colorPool.length];
            return { color, weight: 2, fillOpacity: 0.4 };
          }
          return { opacity: 0 };
        },
        onEachFeature: function (feature, layer) {
          if (postcodes.includes(feature.properties.postcode)) {
            matched.push(layer);
            layer.bindTooltip(
              `${feature.properties.suburb} (${feature.properties.postcode})`,
              { permanent: false }
            );
          }
        }
      }).addTo(map);

      if (matched.length) {
        let group = new L.featureGroup(matched);
        map.fitBounds(group.getBounds());
      }
    });
});
