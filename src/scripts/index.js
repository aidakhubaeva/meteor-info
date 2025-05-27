
import { initNavigation } from "./blocks/navigation.js";
import { renderTypeItem } from "./blocks/types.js";
import { renderFactItem, initFactsSlider } from "./blocks/facts.js";
import { renderSpaceFactItem } from "./blocks/spaceFacts.js";
import { initMap } from "./blocks/map.js";
import { setupCraterCalculator } from "./blocks/calculator.js";
import { initGame } from "./blocks/game.js";
import { loadMuseums } from "./blocks/loadMuseums.js";

// ===== Запуск при загрузке страницы =====
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();

  loadAndRenderSection("/data.json", "types", ".types__container", ".types__block-template", renderTypeItem);
  loadAndRenderSection("/data.json", "facts", ".facts__swiper-wrapper", ".facts__template", renderFactItem, initFactsSlider);
  loadAndRenderSection("/data.json", "spaceFacts", ".space-facts__container", ".space-facts__item-template", renderSpaceFactItem);

  initGame();
  requestAnimationFrame(initMap);
  setupCraterCalculator();

  if (document.getElementById("museumList")) {
    loadMuseums();
  }
});


// ===== Универсальная загрузка и рендер =====
function loadAndRenderSection(url, key, containerSel, templateSel, renderCallback, afterRender) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data[key])) return;
      renderTemplate(containerSel, templateSel, data[key], renderCallback);
      afterRender?.();
    })
    .catch(err => console.error(`Ошибка загрузки ${key}:`, err));
}

function renderTemplate(containerSelector, templateSelector, items, renderItem) {
  const container = document.querySelector(containerSelector);
  const template = document.querySelector(templateSelector);
  if (!container || !template) return;

  container.innerHTML = "";
  items.forEach(item => {
    const clone = template.content.cloneNode(true);
    renderItem(clone, item);
    container.appendChild(clone);
  });
}