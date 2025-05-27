// ===== Карта падений =====

let map;
let meteoriteLayer;
const shownMeteorites = new Set();

export function initMap() {
  map = L.map("map", {
                      center: [20, 0],
                      zoom: 2,
                      minZoom: 1,
                      maxZoom: 8,
                      worldCopyJump: false,
                      maxBounds: [[-85, -180], [85, 180]],
                      maxBoundsViscosity: 1
                    });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    noWrap: true
  }).addTo(map);

  meteoriteLayer = L.layerGroup().addTo(map);

  fetch("/meteorites.json")
    .then(res => res.json())
    .then(renderMeteorites)
    .catch(err => console.error("Ошибка загрузки метеоритов:", err));
}

function renderMeteorites(meteorites) {
  if (!Array.isArray(meteorites)) return;

  const renderer = L.canvas();

  meteorites
    .filter(canRenderMeteorite)
    .forEach(m => {
      const marker = createMeteoriteMarker(m, renderer);
      meteoriteLayer.addLayer(marker);
      shownMeteorites.add(m.id);
    });
}

function canRenderMeteorite({ id, reclat, reclong }) {
  return reclat && reclong && !shownMeteorites.has(id);
}

function createMeteoriteMarker({ name, reclat, reclong, mass }, renderer) {
  return L.circleMarker([+reclat, +reclong], {
      radius: 4,
      color: "#ff5722",
      fillColor: "#ff5722",
      fillOpacity: 0.7,
      weight: 1,
      renderer
    }).bindPopup(`
    <strong>${name || "Без названия"}</strong><br>
    Масса: ${mass ? `${mass} г` : "неизвестна"}
  `);
}