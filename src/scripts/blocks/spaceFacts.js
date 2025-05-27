export function renderSpaceFactItem(clone, fact) {
  const block = clone.querySelector(".space-facts__item");
  if (!block) return;

  block.querySelector(".space-facts__item-title").textContent = fact.title;
  block.querySelector(".space-facts__item-text").textContent = fact.text;
}