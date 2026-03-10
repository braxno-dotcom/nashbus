// ==================== i18n ====================
const DICT = {
  uk: {
    nav: { title: "NashBus", driverPanel: "Панель водія", complaints: "Книга скарг", logout: "Вийти" },
    hero: { title: "NashBus: Перевезення Україна — Європа — Молдова", subtitle: "Знаходьте рейси, відправляйте посилки — просто та зручно" },
    actions: { findTrip: "Знайти рейс", sendParcel: "Передати посилку" },
    search: { from: "Звідки", to: "Куди", date: "Дата", submit: "Знайти" },
    trips: { title: "Найближчі рейси", pickupPoint: "Точка збору", seats: "місць", parcels: "Посилки", book: "Забронювати", route: "Маршрут", noResults: "Рейсів не знайдено", call: "Зателефонувати",
      bookMessage: "Доброго дня! Я з приводу рейсу {from} — {to} на {date}. Чи є вільні місця?" },
    ad: { title: "Страховка для подорожей", text: "Оформіть страховку онлайн за 2 хвилини.", button: "Дізнатися більше" },
    driver: { title: "Додати свій рейс", subtitle: "Заповніть форму і ваш рейс побачать тисячі пасажирів", from: "Звідки", to: "Куди", price: "Ціна (€)", seats: "Кількість місць", phone: "Ваш телефон", submit: "Опублікувати", success: "Рейс додано!", addWaypoint: "Додати зупинку", removeWaypoint: "Видалити", waypoints: "Проміжна зупинка" },
    clients: { title: "Мої клієнти", subtitle: "Ваш особистий сейф — дані видно тільки вам", name: "ПІБ клієнта", phone: "Телефон клієнта", address: "Адреса доставки", save: "Зберегти", saved: "Збережено!", noClients: "Поки немає клієнтів.", sendReceipt: "Відправити чек", generateReceipt: "Сформувати чек", busNumber: "Номер автобуса", routeFrom: "Рейс звідки", routeTo: "Рейс куди", via: "Надіслати через:", delete: "Видалити",
      receiptMessage: "NashBus — Чек\nРейс: {from} → {to}\nДата: {date}\nАвтобус: {bus}\nКлієнт: {client}\nАдреса: {address}\nСтатус: Підтверджено ✓" },
    auth: { title: "Вхід для водіїв", subtitle: "Увійдіть для доступу до панелі", name: "Ваше ім'я", phone: "Номер телефону", password: "Пароль", login: "Увійти", register: "Зареєструватися", noAccount: "Немає акаунту?", hasAccount: "Вже є акаунт?", registered: "Реєстрація успішна!", wrongPassword: "Невірний пароль", notFound: "Акаунт не знайдено", welcome: "Ласкаво просимо", sessionExpired: "Сесія закінчилася. Увійдіть знову." },
    complaints: { title: "Книга скарг та пропозицій", subtitle: "Залиште відгук, скаргу або ідею.", name: "Ваше ім'я", email: "Email (необов'язково)", typeReview: "Відгук", typeComplaint: "Скарга", typeIdea: "Ідея", route: "Рейс (якщо стосується)", message: "Ваше повідомлення", submit: "Відправити", success: "Дякуємо! Повідомлення збережено.", history: "Останні повідомлення" },
    cities: { paris: "Париж", chernivtsi: "Чернівці", madrid: "Мадрид", kyiv: "Київ", chisinau: "Кишинів", odesa: "Одеса", berlin: "Берлін", lviv: "Львів", warsaw: "Варшава", prague: "Прага", krakow: "Краків", bratislava: "Братислава", budapest: "Будапешт", vienna: "Відень", munich: "Мюнхен", nuremberg: "Нюрнберг", frankfurt: "Франкфурт", strasbourg: "Страсбург", katowice: "Катовіце", wroclaw: "Вроцлав", ternopil: "Тернопіль", ivanofrankivsk: "Івано-Франківськ", vinnytsya: "Вінниця", zhytomyr: "Житомир", lublin: "Люблін", rzeszow: "Жешув", dnipro: "Дніпро", mykolaiv: "Миколаїв", tiraspol: "Тирасполь", iasi: "Ясси", suceava: "Сучава", siret: "Сірет" }
  },
  ru: {
    nav: { title: "NashBus", driverPanel: "Панель водителя", complaints: "Книга жалоб", logout: "Выйти" },
    hero: { title: "NashBus: Перевозки Украина — Европа — Молдова", subtitle: "Находите рейсы, отправляйте посылки — просто и удобно" },
    actions: { findTrip: "Найти рейс", sendParcel: "Передать посылку" },
    search: { from: "Откуда", to: "Куда", date: "Дата", submit: "Найти" },
    trips: { title: "Ближайшие рейсы", pickupPoint: "Точка сбора", seats: "мест", parcels: "Посылки", book: "Забронировать", route: "Маршрут", noResults: "Рейсы не найдены", call: "Позвонить",
      bookMessage: "Здравствуйте! Я по поводу рейса {from} — {to} на {date}. Есть ли места?" },
    ad: { title: "Страховка для путешествий", text: "Оформите страховку онлайн за 2 минуты.", button: "Узнать больше" },
    driver: { title: "Добавить рейс", subtitle: "Заполните форму и ваш рейс увидят тысячи пассажиров", from: "Откуда", to: "Куда", price: "Цена (€)", seats: "Количество мест", phone: "Ваш телефон", submit: "Опубликовать", success: "Рейс добавлен!", addWaypoint: "Добавить остановку", removeWaypoint: "Удалить", waypoints: "Промежуточная остановка" },
    clients: { title: "Мои клиенты", subtitle: "Ваш личный сейф — данные видны только вам", name: "ФИО клиента", phone: "Телефон клиента", address: "Адрес доставки", save: "Сохранить", saved: "Сохранено!", noClients: "Пока нет клиентов.", sendReceipt: "Отправить чек", generateReceipt: "Сформировать чек", busNumber: "Номер автобуса", routeFrom: "Рейс откуда", routeTo: "Рейс куда", via: "Отправить через:", delete: "Удалить",
      receiptMessage: "NashBus — Чек\nРейс: {from} → {to}\nДата: {date}\nАвтобус: {bus}\nКлиент: {client}\nАдрес: {address}\nСтатус: Подтверждено ✓" },
    auth: { title: "Вход для водителей", subtitle: "Войдите для доступа к панели", name: "Ваше имя", phone: "Номер телефона", password: "Пароль", login: "Войти", register: "Зарегистрироваться", noAccount: "Нет аккаунта?", hasAccount: "Уже есть аккаунт?", registered: "Регистрация успешна!", wrongPassword: "Неверный пароль", notFound: "Аккаунт не найден", welcome: "Добро пожаловать", sessionExpired: "Сессия истекла. Войдите снова." },
    complaints: { title: "Книга жалоб и предложений", subtitle: "Оставьте отзыв, жалобу или идею.", name: "Ваше имя", email: "Email (необязательно)", typeReview: "Отзыв", typeComplaint: "Жалоба", typeIdea: "Идея", route: "Рейс (если касается)", message: "Ваше сообщение", submit: "Отправить", success: "Спасибо! Сообщение сохранено.", history: "Последние сообщения" },
    cities: { paris: "Париж", chernivtsi: "Черновцы", madrid: "Мадрид", kyiv: "Киев", chisinau: "Кишинёв", odesa: "Одесса", berlin: "Берлин", lviv: "Львов", warsaw: "Варшава", prague: "Прага", krakow: "Краков", bratislava: "Братислава", budapest: "Будапешт", vienna: "Вена", munich: "Мюнхен", nuremberg: "Нюрнберг", frankfurt: "Франкфурт", strasbourg: "Страсбург", katowice: "Катовице", wroclaw: "Вроцлав", ternopil: "Тернополь", ivanofrankivsk: "Ивано-Франковск", vinnytsya: "Винница", zhytomyr: "Житомир", lublin: "Люблин", rzeszow: "Жешув", dnipro: "Днепр", mykolaiv: "Николаев", tiraspol: "Тирасполь", iasi: "Яссы", suceava: "Сучава", siret: "Сирет" }
  },
  ro: {
    nav: { title: "NashBus", driverPanel: "Panou șofer", complaints: "Reclamații", logout: "Deconectare" },
    hero: { title: "NashBus: Transport Ucraina — Europa — Moldova", subtitle: "Găsiți curse, trimiteți colete — simplu și comod" },
    actions: { findTrip: "Găsește cursă", sendParcel: "Trimite colet" },
    search: { from: "De unde", to: "Încotro", date: "Data", submit: "Caută" },
    trips: { title: "Curse apropiate", pickupPoint: "Punct colectare", seats: "locuri", parcels: "Colete", book: "Rezervă", route: "Traseu", noResults: "Nu s-au găsit curse", call: "Sună",
      bookMessage: "Bună ziua! Sunt interesat de cursa {from} — {to} din {date}. Mai sunt locuri?" },
    ad: { title: "Asigurare de călătorie", text: "Obțineți asigurare online în 2 minute.", button: "Aflați mai multe" },
    driver: { title: "Adaugă cursă", subtitle: "Completează formularul și cursa ta va fi văzută de mii de pasageri", from: "De unde", to: "Încotro", price: "Preț (€)", seats: "Nr. locuri", phone: "Telefonul dvs.", submit: "Publică", success: "Cursa adăugată!", addWaypoint: "Adaugă oprire", removeWaypoint: "Șterge", waypoints: "Oprire intermediară" },
    clients: { title: "Clienții mei", subtitle: "Seiful personal — datele sunt vizibile doar pentru dvs.", name: "Numele clientului", phone: "Telefonul clientului", address: "Adresa de livrare", save: "Salvează", saved: "Salvat!", noClients: "Nu aveți clienți încă.", sendReceipt: "Trimite chitanța", generateReceipt: "Generează chitanță", busNumber: "Nr. autobuz", routeFrom: "Cursă de la", routeTo: "Cursă la", via: "Trimite prin:", delete: "Șterge",
      receiptMessage: "NashBus — Chitanță\nCursa: {from} → {to}\nData: {date}\nAutobuz: {bus}\nClient: {client}\nAdresa: {address}\nStatus: Confirmat ✓" },
    auth: { title: "Autentificare șofer", subtitle: "Conectați-vă pentru acces la panou", name: "Numele dvs.", phone: "Nr. telefon", password: "Parola", login: "Autentificare", register: "Înregistrare", noAccount: "Nu aveți cont?", hasAccount: "Aveți deja cont?", registered: "Înregistrare reușită!", wrongPassword: "Parolă greșită", notFound: "Cont negăsit", welcome: "Bun venit", sessionExpired: "Sesiunea a expirat. Conectați-vă din nou." },
    complaints: { title: "Cartea de reclamații", subtitle: "Lăsați o recenzie, reclamație sau idee.", name: "Numele dvs.", email: "Email (opțional)", typeReview: "Recenzie", typeComplaint: "Reclamație", typeIdea: "Idee", route: "Cursa (dacă este cazul)", message: "Mesajul dvs.", submit: "Trimite", success: "Mulțumim! Mesajul a fost salvat.", history: "Ultimele mesaje" },
    cities: { paris: "Paris", chernivtsi: "Cernăuți", madrid: "Madrid", kyiv: "Kiev", chisinau: "Chișinău", odesa: "Odesa", berlin: "Berlin", lviv: "Liov", warsaw: "Varșovia", prague: "Praga", krakow: "Cracovia", bratislava: "Bratislava", budapest: "Budapesta", vienna: "Viena", munich: "München", nuremberg: "Nürnberg", frankfurt: "Frankfurt", strasbourg: "Strasbourg", katowice: "Katowice", wroclaw: "Wrocław", ternopil: "Ternopil", ivanofrankivsk: "Ivano-Frankivsk", vinnytsya: "Vinnița", zhytomyr: "Jîtomîr", lublin: "Lublin", rzeszow: "Rzeszów", dnipro: "Dnipro", mykolaiv: "Mîkolaiv", tiraspol: "Tiraspol", iasi: "Iași", suceava: "Suceava", siret: "Siret" }
  }
};

let currentLang = localStorage.getItem("nashbus_lang") || "uk";
function t(key) {
  const keys = key.split(".");
  let val = DICT[currentLang];
  for (const k of keys) { val = val?.[k]; }
  return val || key;
}
function cityName(key) { return DICT[currentLang].cities[key] || key; }

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("nashbus_lang", lang);
  document.documentElement.lang = lang;
  applyTranslations();
  renderTrips();
  renderClients();
  renderComplaints();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("select option[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll(".lang-switcher button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

// ==================== Navigation ====================
function navigate(page) {
  document.getElementById("page-home").style.display = page === "home" ? "" : "none";
  document.getElementById("page-driver").style.display = page === "driver" ? "" : "none";
  document.getElementById("page-complaints").style.display = page === "complaints" ? "" : "none";
  if (page === "driver") checkDriverSession();
  if (page === "complaints") renderComplaints();
  window.scrollTo(0, 0);
  return false;
}

// ==================== Trips (Supabase) ====================
var TRIPS = [];

// Load trips from Supabase, then render
sbLoadTrips().then(function(data) {
  TRIPS = data;
  renderTrips();
});

// Realtime: auto-update when admin adds/edits/deletes
sb.channel("routes-realtime")
  .on("postgres_changes", { event: "*", schema: "public", table: "routes" }, function() {
    sbLoadTrips().then(function(data) {
      TRIPS = data;
      renderTrips();
    });
  })
  .subscribe();

let searchActive = false;
let openMenuId = null;
let openRouteId = null;

function fullRoute(trip) { return [trip.fromKey, ...trip.waypoints, trip.toKey]; }

function handleSearch(e) {
  e.preventDefault();
  searchActive = true;
  document.getElementById("search-reset").style.display = "";
  document.getElementById("trips-section").style.display = "";
  renderTrips();
}
function resetSearch() {
  searchActive = false;
  document.getElementById("search-from").value = "";
  document.getElementById("search-to").value = "";
  document.getElementById("search-date").value = "";
  document.getElementById("search-reset").style.display = "none";
  document.getElementById("trips-section").style.display = "none";
}

function filterTrips() {
  if (!searchActive) return TRIPS;
  const sf = document.getElementById("search-from").value.toLowerCase().trim();
  const st = document.getElementById("search-to").value.toLowerCase().trim();
  const sd = document.getElementById("search-date").value;
  return TRIPS.filter(trip => {
    const route = fullRoute(trip);
    const matchCity = (q, key) => !q || key.toLowerCase().includes(q) || cityName(key).toLowerCase().includes(q);
    const fromIdx = sf ? route.findIndex(k => matchCity(sf, k)) : 0;
    const toIdx = st ? route.findIndex((k, i) => i > fromIdx && matchCity(st, k)) : route.length - 1;
    const routeOk = fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    const dateOk = !sd || trip.date.includes(sd.split("-").reverse().join("."));
    return routeOk && dateOk;
  });
}

function amenityIcons(trip) {
  var icons = [];
  if (trip.wifi) icons.push('<span class="amenity" title="Wi-Fi"><i class="fas fa-wifi"></i></span>');
  if (trip.powerOutlets) icons.push('<span class="amenity" title="Power"><i class="fas fa-plug"></i></span>');
  if (trip.ac) icons.push('<span class="amenity" title="A/C"><i class="fas fa-snowflake"></i></span>');
  if (trip.toilet) icons.push('<span class="amenity" title="WC"><i class="fas fa-restroom"></i></span>');
  if (trip.luggage) icons.push('<span class="amenity" title="Luggage"><i class="fas fa-suitcase-rolling"></i></span>');
  if (trip.pets) icons.push('<span class="amenity" title="Pets"><i class="fas fa-paw"></i></span>');
  return icons.length ? '<div class="trip-amenities">' + icons.join('') + '</div>' : '';
}

function carrierLogo(trip) {
  if (trip.logoUrl) return '<img class="trip-logo" src="' + trip.logoUrl + '" alt="' + trip.carrier + '">';
  return '<div class="trip-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 17v2m8-2v2M3 11h18M7 7h.01M17 7h.01"/></svg></div>';
}

function renderTrips() {
  const grid = document.getElementById("trips-grid");
  const noRes = document.getElementById("no-results");
  if (!searchActive) { grid.innerHTML = ""; noRes.style.display = "none"; return; }
  const filtered = filterTrips();
  if (filtered.length === 0) {
    grid.innerHTML = "";
    noRes.style.display = "";
    noRes.textContent = t("trips.noResults");
    return;
  }
  noRes.style.display = "none";
  grid.innerHTML = filtered.map(trip => {
    const from = cityName(trip.fromKey), to = cityName(trip.toKey);
    const route = fullRoute(trip);
    const ph = trip.phone.replace(/[^0-9+]/g, "");
    const phClean = ph.replace(/[^0-9]/g, "");
    const msg = t("trips.bookMessage").replace("{from}", from).replace("{to}", to).replace("{date}", trip.date);
    const waUrl = "https://wa.me/" + phClean + "?text=" + encodeURIComponent(msg);
    const viberUrl = "viber://chat?number=" + encodeURIComponent(ph) + "&draft=" + encodeURIComponent(msg);
    const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + trip.pickupLat + "," + trip.pickupLng;
    const hasWP = trip.waypoints.length > 0;
    return '<div class="trip-card">' +
      '<button class="trip-fav" onclick="toggleFav(this)"><svg fill="none" stroke="#d1d5db" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></button>' +
      '<div class="trip-top"><div class="trip-carrier">' + carrierLogo(trip) + '<div><p class="trip-carrier-name">' + trip.carrier + '</p><p class="trip-carrier-date">' + trip.date + '</p></div></div><span class="trip-price">' + trip.price + '</span></div>' +
      '<div class="trip-route"><div class="city"><p class="time">' + trip.departure + '</p><p class="name">' + from + '</p></div><div class="arrow"><span>→</span><span>' + trip.duration + '</span></div><div class="city right"><p class="time">' + trip.arrival + '</p><p class="name">' + to + '</p></div></div>' +
      amenityIcons(trip) +
      '<div class="trip-badges"><span class="badge badge-seats">' + trip.seats + ' ' + t("trips.seats") + '</span>' +
      (trip.parcels ? '<span class="badge badge-parcels">' + t("trips.parcels") + '</span>' : '') +
      (hasWP ? '<button class="badge badge-route" onclick="toggleRoute(\'' + trip.id + '\')"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>' + t("trips.route") + ' (' + route.length + ')</button>' : '') +
      '</div>' +
      (openRouteId === trip.id ? '<div class="route-details">' + route.map(function(k, i) { return '<div class="route-stop"><div class="route-dot ' + (i === 0 ? 'start' : i === route.length - 1 ? 'end' : 'mid') + '"></div><span class="route-stop-name">' + cityName(k) + '</span></div>'; }).join('') + '</div>' : '') +
      '<div class="trip-actions"><a href="' + mapsUrl + '" target="_blank" rel="noopener" class="btn-pickup"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' + t("trips.pickupPoint") + '</a>' +
      '<div class="btn-book-wrap"><button class="btn-book" onclick="toggleBookMenu(\'' + trip.id + '\')">' + t("trips.book") + '</button>' +
      (openMenuId === trip.id ? '<div class="book-menu"><a href="tel:' + ph + '" class="tel"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>' + t("trips.call") + '</a><a href="' + waUrl + '" target="_blank" class="wa"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>WhatsApp</a><a href="' + viberUrl + '" class="vb"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.4 0C9.473.028 5.333.344 3.353 2.09 1.89 3.47 1.338 5.54 1.26 8.097c-.078 2.557-.178 7.35 4.504 8.758h.004l-.004 2.013s-.032.815.507.981c.652.2.968-.369 1.555-.958.322-.322.766-.797 1.1-1.16 3.022.254 5.345-.326 5.607-.415.606-.207 4.028-.635 4.586-5.178.575-4.67-.27-7.63-1.779-8.96l-.003-.003c-.46-.432-2.466-2.026-7.04-2.153 0 0-.327-.02-.897-.022z"/></svg>Viber</a></div>' : '') +
      '</div></div></div>';
  }).join("");
}

function toggleFav(btn) { btn.classList.toggle("active"); }
function toggleBookMenu(id) { openMenuId = openMenuId === id ? null : id; renderTrips(); }
function toggleRoute(id) { openRouteId = openRouteId === id ? null : id; renderTrips(); }
document.addEventListener("click", function(e) {
  if (openMenuId && !e.target.closest(".btn-book-wrap")) { openMenuId = null; renderTrips(); }
});

// ==================== Auth ====================
let authMode = "login";
function toggleAuthMode() {
  authMode = authMode === "login" ? "register" : "login";
  document.getElementById("auth-name").style.display = authMode === "register" ? "" : "none";
  document.getElementById("auth-submit-btn").textContent = t(authMode === "login" ? "auth.login" : "auth.register");
  document.getElementById("auth-toggle-text").textContent = t(authMode === "login" ? "auth.noAccount" : "auth.hasAccount");
  document.getElementById("auth-toggle-link").textContent = t(authMode === "login" ? "auth.register" : "auth.login");
}
function simpleHash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return h.toString(); }

function handleAuth(e) {
  e.preventDefault();
  var phone = document.getElementById("auth-phone").value;
  var pass = document.getElementById("auth-password").value;
  var hash = simpleHash(pass);
  var accounts = JSON.parse(localStorage.getItem("nashbus_accounts") || "[]");
  if (authMode === "register") {
    var name = document.getElementById("auth-name").value;
    if (!name) return;
    var id = Date.now().toString(36);
    accounts.push({ id: id, name: name, phone: phone, hash: hash });
    localStorage.setItem("nashbus_accounts", JSON.stringify(accounts));
    alert(t("auth.registered"));
    authMode = "login"; toggleAuthMode();
    return;
  }
  var acc = accounts.find(function(a) { return a.phone === phone; });
  if (!acc) { alert(t("auth.notFound")); return; }
  if (acc.hash !== hash) { alert(t("auth.wrongPassword")); return; }
  var session = { account: acc, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  localStorage.setItem("nashbus_session", JSON.stringify(session));
  showDriverPanel(acc);
}

function checkDriverSession() {
  var raw = localStorage.getItem("nashbus_session");
  if (!raw) { showAuthForm(false); return; }
  var session = JSON.parse(raw);
  if (Date.now() > session.expiresAt) {
    localStorage.removeItem("nashbus_session");
    showAuthForm(true);
    return;
  }
  showDriverPanel(session.account);
}

function showAuthForm(expired) {
  document.getElementById("auth-section").style.display = "";
  document.getElementById("driver-panel").style.display = "none";
  document.getElementById("session-expired-banner").style.display = expired ? "" : "none";
}
function showDriverPanel(acc) {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("driver-panel").style.display = "";
  document.querySelector(".welcome-name").textContent = t("auth.welcome") + ", " + acc.name + "!";
  currentDriverId = acc.id;
  renderClients();
}
function driverLogout() {
  localStorage.removeItem("nashbus_session");
  currentDriverId = null;
  showAuthForm(false);
}

// ==================== Add Trip ====================
var tripWaypoints = [];
function openTripModal() { tripWaypoints = []; renderWaypoints(); document.getElementById("modal-trip").style.display = ""; }
function closeTripModal() { document.getElementById("modal-trip").style.display = "none"; }
function addWaypoint() { tripWaypoints.push(""); renderWaypoints(); }
function removeWaypoint(i) { tripWaypoints.splice(i, 1); renderWaypoints(); }
function renderWaypoints() {
  document.getElementById("waypoints-list").innerHTML = tripWaypoints.map(function(wp, i) {
    return '<div class="waypoint-row"><span class="wp-num">' + (i + 1) + '.</span><input type="text" value="' + wp + '" oninput="tripWaypoints[' + i + ']=this.value" placeholder="' + t('driver.waypoints') + ' ' + (i + 1) + '"><button type="button" class="btn-remove-wp" onclick="removeWaypoint(' + i + ')">' + t('driver.removeWaypoint') + '</button></div>';
  }).join("");
}
function handleAddTrip(e) {
  e.preventDefault();
  var trip = {
    from: document.getElementById("trip-from").value,
    to: document.getElementById("trip-to").value,
    date: document.getElementById("trip-date").value,
    busNumber: document.getElementById("trip-bus").value,
    waypoints: tripWaypoints.filter(function(w) { return w.trim(); })
  };
  localStorage.setItem("nashbus_active_trip", JSON.stringify(trip));
  alert(t("driver.success"));
  closeTripModal();
}

// ==================== Clients ====================
var currentDriverId = null;
function clientsKey() { return "nashbus_clients_" + currentDriverId; }
function getClients() { return JSON.parse(localStorage.getItem(clientsKey()) || "[]"); }
function saveClients(list) { localStorage.setItem(clientsKey(), JSON.stringify(list)); }

function handleSaveClient(e) {
  e.preventDefault();
  var name = document.getElementById("client-name").value;
  var phone = document.getElementById("client-phone").value;
  var address = document.getElementById("client-address").value;
  var clients = getClients();
  var existing = clients.find(function(c) { return c.name.toLowerCase() === name.toLowerCase(); });
  if (existing) {
    if (existing.address !== address) {
      if (!existing.addressHistory) existing.addressHistory = [];
      existing.addressHistory.push(existing.address);
      existing.address = address;
    }
    existing.phone = phone;
  } else {
    clients.push({ id: Date.now().toString(36), name: name, phone: phone, address: address, addressHistory: [] });
  }
  saveClients(clients);
  document.getElementById("client-form").reset();
  document.getElementById("client-suggestions").style.display = "none";
  alert(t("clients.saved"));
  renderClients();
}

function onClientNameInput(val) {
  var box = document.getElementById("client-suggestions");
  if (val.length < 2) { box.style.display = "none"; return; }
  var clients = getClients().filter(function(c) { return c.name.toLowerCase().includes(val.toLowerCase()); });
  if (clients.length === 0) { box.style.display = "none"; return; }
  box.style.display = "";
  box.innerHTML = clients.map(function(c) {
    return '<button type="button" class="suggestion-item" onclick="selectClient(\'' + c.id + '\')"><span class="suggestion-name">' + c.name + '</span><span class="suggestion-phone">' + c.phone + '</span><span class="suggestion-addr">' + c.address + '</span></button>';
  }).join("");
}
function selectClient(id) {
  var c = getClients().find(function(x) { return x.id === id; });
  if (!c) return;
  document.getElementById("client-name").value = c.name;
  document.getElementById("client-phone").value = c.phone;
  document.getElementById("client-address").value = c.address;
  document.getElementById("client-suggestions").style.display = "none";
}

function deleteClient(id) {
  saveClients(getClients().filter(function(c) { return c.id !== id; }));
  renderClients();
}

function renderClients() {
  var list = document.getElementById("clients-list");
  if (!currentDriverId) { list.innerHTML = ""; return; }
  var clients = getClients();
  if (clients.length === 0) {
    list.innerHTML = '<p class="no-results">' + t("clients.noClients") + '</p>';
    return;
  }
  list.innerHTML = clients.map(function(c) {
    return '<div class="client-item"><div class="client-top"><div><p class="client-name">' + c.name + '</p><p class="client-phone">' + c.phone + '</p></div><button class="btn-delete" onclick="deleteClient(\'' + c.id + '\')"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button></div><p class="client-addr">' + c.address + '</p><button class="btn-green" onclick="openReceiptModal(\'' + c.id + '\')"><svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' + t("clients.sendReceipt") + '</button></div>';
  }).join("");
}

// ==================== Receipt ====================
var receiptClientId = null;
function openReceiptModal(clientId) {
  receiptClientId = clientId;
  var c = getClients().find(function(x) { return x.id === clientId; });
  if (!c) return;
  document.getElementById("receipt-client-info").innerHTML = '<p class="r-name">' + c.name + '</p><p class="r-detail">' + c.phone + '</p><p class="r-detail">' + c.address + '</p>';
  var trip = JSON.parse(localStorage.getItem("nashbus_active_trip") || "null");
  var cities = trip ? [trip.from].concat(trip.waypoints || []).concat([trip.to]).filter(Boolean) : [];
  var selFrom = document.getElementById("receipt-from");
  var selTo = document.getElementById("receipt-to");
  selFrom.innerHTML = '<option value="">' + t("clients.routeFrom") + '</option>' + cities.map(function(c) { return '<option value="' + c + '"' + (c === (trip && trip.from) ? ' selected' : '') + '>' + c + '</option>'; }).join("");
  selTo.innerHTML = '<option value="">' + t("clients.routeTo") + '</option>' + cities.map(function(c) { return '<option value="' + c + '"' + (c === (trip && trip.to) ? ' selected' : '') + '>' + c + '</option>'; }).join("");
  document.getElementById("receipt-date").value = (trip && trip.date) || "";
  document.getElementById("receipt-bus").value = (trip && trip.busNumber) || "";
  document.getElementById("modal-receipt").style.display = "";
}
function closeReceiptModal() { document.getElementById("modal-receipt").style.display = "none"; }

function sendReceipt(via) {
  var c = getClients().find(function(x) { return x.id === receiptClientId; });
  if (!c) return;
  var from = document.getElementById("receipt-from").value;
  var to = document.getElementById("receipt-to").value;
  var date = document.getElementById("receipt-date").value;
  var bus = document.getElementById("receipt-bus").value;
  var text = t("clients.receiptMessage").replace("{from}", from).replace("{to}", to).replace("{date}", date).replace("{bus}", bus).replace("{client}", c.name).replace("{address}", c.address);
  var ph = c.phone.replace(/[^0-9]/g, "");
  if (via === "whatsapp") window.open("https://wa.me/" + ph + "?text=" + encodeURIComponent(text), "_blank");
  else window.open("viber://chat?number=" + encodeURIComponent(c.phone) + "&draft=" + encodeURIComponent(text), "_blank");
  closeReceiptModal();
}

// ==================== Complaints ====================
function handleComplaint(e) {
  e.preventDefault();
  var complaint = {
    id: Date.now().toString(36),
    name: document.getElementById("complaint-name").value,
    email: document.getElementById("complaint-email").value,
    type: document.getElementById("complaint-type").value,
    route: document.getElementById("complaint-route").value,
    message: document.getElementById("complaint-message").value,
    date: new Date().toLocaleString()
  };
  var list = JSON.parse(localStorage.getItem("nashbus_complaints") || "[]");
  list.unshift(complaint);
  localStorage.setItem("nashbus_complaints", JSON.stringify(list));
  document.getElementById("complaints-form").reset();
  alert(t("complaints.success"));
  renderComplaints();
}
function renderComplaints() {
  var list = JSON.parse(localStorage.getItem("nashbus_complaints") || "[]").slice(0, 5);
  var el = document.getElementById("complaints-history");
  if (list.length === 0) { el.innerHTML = ""; return; }
  el.innerHTML = '<h3 style="font-size:12px;font-weight:700;margin:12px 0 8px">' + t("complaints.history") + '</h3>' +
    list.map(function(c) {
      var typeKey = "complaints.type" + c.type.charAt(0).toUpperCase() + c.type.slice(1);
      return '<div class="complaint-item"><span class="complaint-type ' + c.type + '">' + t(typeKey) + '</span><p class="complaint-msg">' + c.message + '</p><p class="complaint-meta">' + c.name + ' · ' + c.date + '</p></div>';
    }).join("");
}

// ==================== Service Worker ====================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(function() {});
}

// ==================== Init ====================
applyTranslations();
renderTrips();
