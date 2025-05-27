// ===== Навигация =====

export function initNavigation() {
  const nav = document.querySelector(".header__nav");
  if (!nav) return;

  const links = nav.querySelectorAll(".navigation__link");
  links.forEach(link => link.classList.remove("active"));

  nav.addEventListener("click", (e) => {
    const clicked = e.target.closest(".navigation__link");
    if (!clicked) return;

    links.forEach(link => link.classList.remove("active"));
    clicked.classList.add("active");
  });
}