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

  fetch('data/nsw-suburbs.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.SA2_NAME16) {
                    layer.bindPopup(feature.properties.SA2_NAME16);
                }
            }
        }).addTo(map);
    });

      if (matched.length) {
        let group = new L.featureGroup(matched);
        map.fitBounds(group.getBounds());
      }
    });
});
