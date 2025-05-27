// ===== Список музеев =====
export function loadMuseums() {
  fetch("/museums.json")
    .then(res => res.json())
    .then(data => {
        const countryList = document.getElementById("countryList");
        const museumList = document.getElementById("museumList");
        const museumTemplate = museumList.querySelector(".museum__item");
        if (!countryList || !museumList || !museumTemplate) return;

        // Сохраняем шаблон и удаляем оригинал
        const templateClone = museumTemplate.cloneNode(true);
        museumTemplate.remove();

        const renderMuseums = (country) => {
          museumList.innerHTML = "";
          if (!data[country]) return;

          data[country].forEach(museum => {
            const item = templateClone.cloneNode(true);
            item.querySelector(".museum__name").textContent = museum.name;
            item.querySelector(".museum__city").textContent = museum.location;
            item.querySelector(".museum__note").textContent = museum.note;
            museumList.appendChild(item);
          });
        };

        Object.keys(data).forEach((country, index) => {
            const li = document.createElement("li");
            li.textContent = country;
            li.className = "country__item";
            if (index === 0) li.classList.add("active");

            li.addEventListener("click", () => {
              document.querySelectorAll(".country__item").forEach(el => el.classList.remove("active"));
              li.classList.add("active");
              renderMuseums(country);
            });

            countryList.appendChild(li);
          });

          // Первая страна по умолчанию
          renderMuseums(Object.keys(data)[0]);
      })
      .catch(err => console.error("Ошибка загрузки музеев:", err));
};