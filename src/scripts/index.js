// Главный запуск после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  setupNavigationHighlighting();

  setTimeout(loadTypes, 0);
  setTimeout(loadFacts, 300);
  setTimeout(loadSpaceFacts, 600);

  // Ждём полной отрисовки, потом запускаем карту
  requestAnimationFrame(() => {
    initMap();
  });
});

// TYPES
function loadTypes() {
  fetch("/data.json")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.types)) renderTypes(data.types);
    });
}

function renderTypes(types) {
  renderTemplate(".types__container", ".types__block-template", types, (clone, type) => {
    const block = clone.querySelector(".types__block");
    if (!block) return;

    block.querySelector(".block__title").textContent = type.title;
    block.querySelector(".types__text").textContent = type.description;
    const img = block.querySelector(".types__feature-cover");
    if (img) {
      img.src = type.image;
      img.alt = type.title;
    }
  });
}

// FACTS
function loadFacts() {
  fetch("/data.json")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.facts)) renderFacts(data.facts);
    });
}

function renderFacts(facts) {
  renderTemplate(".facts__swiper-wrapper", ".facts__template", facts, (clone, fact) => {
    const slide = clone.querySelector(".facts__slide");
    slide.querySelector(".fact__image").src = fact.image;
    slide.querySelector(".fact__image").alt = fact.title;
    slide.querySelector(".fact__title").textContent = fact.title;
    slide.querySelector(".fact__text").textContent = fact.description;
  });

  new Swiper(".facts__swiper", {
    slidesPerView: "auto",
    freeMode: true,
    navigation: {
      nextEl: ".facts__button--next",
      prevEl: ".facts__button--prev",
    },
    pagination: {
      el: ".facts__pagination",
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 10 },
      800: { slidesPerView: 2, spaceBetween: 15 },
      1600: { slidesPerView: 3, spaceBetween: 20 },
    }
  });
}

// SPACE FACTS
function loadSpaceFacts() {
  fetch("/data.json")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.spaceFacts)) renderSpaceFacts(data.spaceFacts);
    });
}

function renderSpaceFacts(facts) {
  renderTemplate(".space-facts__container", ".space-facts__item-template", facts, (clone, fact) => {
    const block = clone.querySelector(".space-facts__item");
    block.querySelector(".space-facts__item-title").textContent = fact.title;
    block.querySelector(".space-facts__item-text").textContent = fact.text;
  });
}

// Универсальный рендер
function renderTemplate(containerSelector, templateSelector, items, renderCallback) {
  const container = document.querySelector(containerSelector);
  const template = document.querySelector(templateSelector);
  if (!container || !template) return;

  container.innerHTML = "";
  items.forEach(item => {
    const clone = template.content.cloneNode(true);
    renderCallback(clone, item);
    container.appendChild(clone);
  });
}

// Калькулятор кратера
function setupCraterCalculator() {
  document.getElementById("calcButton").addEventListener("click", () => {
    const massKg = parseFloat(document.getElementById("massInput").value);
    if (isNaN(massKg) || massKg <= 0) {
      alert("Введите корректную массу метеорита.");
      return;
    }
    const massTonnes = massKg / 1000;
    const diameter = (massTonnes ** 0.33 * 10).toFixed(2);
    const depth = (diameter * 0.25).toFixed(2);
    document.getElementById("diameterOutput").textContent = `Диаметр кратера: ${diameter} м`;
    document.getElementById("depthOutput").textContent = `Глубина кратера: ${depth} м`;
  });
}

// ======= Карта =======
let map;
let meteoriteLayer;
const shownMeteorites = new Set();

function initMap() {
  map = L.map("map", {
    center: [20, 0],
    zoom: 2,
    minZoom: 1,
    maxZoom: 8,
    worldCopyJump: false,
    maxBounds: [
      [-85, -180],
      [85, 180]
    ],
    maxBoundsViscosity: 1
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    noWrap: true 
  }).addTo(map);

  meteoriteLayer = L.layerGroup().addTo(map);

  loadInitialMeteorites();
}

function loadInitialMeteorites() {
  fetch("meteorites.json")
    .then(res => res.json())
    .then(data => {
      const initialSubset = data;
      renderMeteorites(initialSubset);
    })
    .catch(err => console.error("Ошибка загрузки метеоритов:", err));
}

function renderMeteorites(meteorites) {
  if (!Array.isArray(meteorites)) return;

  const renderer = L.canvas();

  meteorites.forEach(meteorite => {
    const { id, name, reclat, reclong, mass } = meteorite;

    if (!reclat || !reclong || shownMeteorites.has(id)) return;
    shownMeteorites.add(id);

    const marker = L.circleMarker([+reclat, +reclong], {
      radius: 4,          
      color: "#ff5722",
      fillColor: "#ff5722",
      fillOpacity: 0.7,
      weight: 1,
      renderer     
    }).bindPopup(`
      <strong>${name || "Без названия"}</strong><br>
      Масса: ${mass ? mass + " г" : "неизвестна"}
    `);

    meteoriteLayer.addLayer(marker);
  });
}

// ======= Навигация =======
function setupNavigationHighlighting() {
  const nav = document.querySelector(".header__nav");
  const links = nav.querySelectorAll(".navigation__link");

  links.forEach(link => link.classList.remove("active"));

  nav.addEventListener("click", (e) => {
    const clickedLink = e.target.closest(".navigation__link");
    if (!clickedLink) return;

    links.forEach(link => link.classList.remove("active"));
    clickedLink.classList.add("active");
  });
}