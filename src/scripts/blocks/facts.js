export function renderFactItem(clone, fact) {
  const slide = clone.querySelector(".facts__slide");
  if (!slide) return;

  slide.querySelector(".fact__image").src = fact.image;
  slide.querySelector(".fact__image").alt = fact.title;
  slide.querySelector(".fact__title").textContent = fact.title;
  slide.querySelector(".fact__text").textContent = fact.description;
}

export function initFactsSlider() {
  new Swiper(".facts__swiper", {
    slidesPerView: "auto",
    freeMode: true,
    navigation: {
                  nextEl: ".facts__button--next",
                  prevEl: ".facts__button--prev"
                },

    pagination: {
                  el: ".facts__pagination",
                  clickable: true
                },

    breakpoints: {
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  800: { slidesPerView: 2, spaceBetween: 15 },
                  1600: { slidesPerView: 3, spaceBetween: 20 }
    }
    
  });
}