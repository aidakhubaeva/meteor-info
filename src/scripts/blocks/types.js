export function renderTypeItem(clone, type) {
  const block = clone.querySelector(".types__block");
  if (!block) return;

  block.querySelector(".block__title").textContent = type.title;
  block.querySelector(".types__text").textContent = type.description;

  const img = block.querySelector(".types__feature-cover");
  if (img) {
            img.src = type.image;
            img.alt = type.title;
  }
}