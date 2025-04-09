fetch("../museums.json")
  .then(res => res.json())
  .then(data => {
    const countryList = document.getElementById('countryList');
    const museumList = document.getElementById('museumList');
    const museumTemplate = museumList.querySelector('.museum__item');
    museumTemplate.remove(); // Удалим шаблон, он будет клонироваться

    const renderMuseums = (country) => {
      museumList.innerHTML = ''; // Очистить перед рендером

      if (!data[country]) return;

      data[country].forEach(museum => {
        const item = museumTemplate.cloneNode(true);
        item.querySelector('.museum__name').textContent = museum.name;
        item.querySelector('.museum__city').textContent = museum.location;
        item.querySelector('.museum__note').textContent = museum.note;
        museumList.appendChild(item);
      });
    };

    Object.keys(data).forEach((country, i) => {
      const li = document.createElement('li');
      li.textContent = country;
      li.className = 'country__item';
      if (i === 0) li.classList.add('active');
      li.addEventListener('click', () => {
        document.querySelectorAll('.country__item').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        renderMuseums(country);
      });
      countryList.appendChild(li);
    });

    renderMuseums(Object.keys(data)[0]); // Первая страна по умолчанию
  });