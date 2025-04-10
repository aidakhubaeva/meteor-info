
document.addEventListener("DOMContentLoaded", () => {
  console.log(`
  ===============================
  Welcome, space explorer!
  Especially meteorite lover.
  
  Got ideas or feedback?
  Message me on Telegram → @AidaKhubaeva
  ===============================
  `);

  loadData();
  setupNavigationHighlighting();
  setupCraterCalculator();
  initMap();
});

// Загрузка и отрисовка данных
function loadData() {
  fetch("/data.json")
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data.types)) {
        try {
          renderTypes(data.types);
        } catch (err) {
          console.error("Failed to render TYPES:", err);
        }
      }

      if (Array.isArray(data.spaceFacts)) {
        try {
          renderSpaceFacts(data.spaceFacts);
        } catch (err) {
          console.error("Failed to render SPACE FACTS:", err);
        }
      }

      if (Array.isArray(data.facts)) {
        try {
          renderFacts(data.facts);
        } catch (err) {
          console.error("Failed to render FACTS:", err);
        }
      }
    })
    .catch(error => console.error("Failed to load data.json:", error));
}

// Универсальный рендер шаблона
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

// TYPES
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
    } else {
      const imageWrapper = block.querySelector(".types__feature-image");
      if (imageWrapper) imageWrapper.remove();
    }
  });
}

// SPACE FACTS
function renderSpaceFacts(facts) {
  renderTemplate(".space-facts__container", ".space-facts__item-template", facts, (clone, fact) => {
    const block = clone.querySelector(".space-facts__item");
    if (!block) return;

    block.querySelector(".space-facts__item-title").textContent = fact.title;
    block.querySelector(".space-facts__item-text").textContent = fact.text;
  });
}

// FACTS
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

// Карта метеоритов
function initMap() {
  const map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  fetch("meteorites.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(meteorite => {
        const lat = parseFloat(meteorite.reclat);
        const lon = parseFloat(meteorite.reclong);
        if (!isNaN(lat) && !isNaN(lon)) {
          L.circleMarker([lat, lon], {
            radius: 6,
            color: "#ffcc00",
            fillColor: "#ffaa00",
            fillOpacity: 0.8
          })
            .bindPopup(`<strong>${meteorite.name}</strong><br>Масса: ${meteorite.mass || "?"} г<br>Год: ${meteorite.year || "?"}`)
            .addTo(map);
        }
      });
    })
    .catch(err => console.error("Ошибка загрузки метеоритов из локального JSON:", err));
}

// Навигация: активная ссылка
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
