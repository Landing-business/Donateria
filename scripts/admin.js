const passwordHash = '53cba48eefbe3dc0a097ad3e5ea05799985cfbbd0e2aca7a75c2aeee8414653a';


const htmlString = `
  <div>
    <label for="margarita-input">Маргарита:</label>
    <input type="text" id="margarita-input">
  </div>
  <div>
    <label for="peperoni-input">Пеперони:</label>
    <input type="text" id="peperoni-input">
  </div>
  <div>
    <label for="gavaiskaia-input">Гавайская:</label>
    <input type="text" id="gavaiskaia-input">
  </div>
  <div>
    <label for="meat-input">Мясная:</label>
    <input type="text" id="meat-input">
  </div>
  <div>
    <label for="kaprichoza-input">Капричоза:</label>
    <input type="text" id="kaprichoza-input">
  </div>
  <div>
    <label for="apetitnaia-input">Аппетитная:</label>
    <input type="text" id="apetitnaia-input">
  </div>
  <div>
    <label for="posipka-input">Пончик с посыпкой:</label>
    <input type="text" id="posipka-input">
  </div>
  <div>
    <label for="marmelade-input">Пончик с мармеладом:</label>
    <input type="text" id="marmelade-input">
  </div>
  <div>
    <label for="blueberrie-input">Коктейль Виноград:</label>
    <input type="text" id="blueberrie-input">
  </div>
  <div>
    <label for="malina-input">Коктейль Клубника:</label>
    <input type="text" id="malina-input">
  </div>
  <b>Цены указывать в руб.<br>Копейки писать через запятую.</b>
  <b><br>Обязательно сохранить после изменения!</b>
  <button id="save-button">💾 Сохранить цены</button>
`;

// ✅ Проверка пароля
function PasswordCheck() {
  const inputField = document.getElementById("password-input");
  const wrapper = document.getElementById("admin-wrapper");

  const password = inputField.value.trim();
  const inputHash = CryptoJS.SHA256(password).toString();

  if (inputHash === passwordHash) {
    wrapper.innerHTML = htmlString;
    loadPrices();
    setupSaveHandler();
  } else {
    alert("❌ Неверный пароль");
  }
}

// Загрузка цен из localStorage
function loadPrices() {
  const saved = JSON.parse(localStorage.getItem("menuPrices")) || {};

  set("margarita-input", saved.margarita);
  set("peperoni-input", saved.peperoni);
  set("gavaiskaia-input", saved.gavaiskaia);
  set("meat-input", saved.meat);
  set("kaprichoza-input", saved.kaprichoza);
  set("apetitnaia-input", saved.apetitnaia);
  set("posipka-input", saved.posipka);
  set("marmelade-input", saved.marmelade);
  set("blueberrie-input", saved.blueberrie);
  set("malina-input", saved.malina);
}

// Сохранение цен
function setupSaveHandler() {
  document.getElementById("save-button").addEventListener("click", () => {
    const prices = {
      margarita: get("margarita-input"),
      peperoni: get("peperoni-input"),
      gavaiskaia: get("gavaiskaia-input"),
      meat: get("meat-input"),
      kaprichoza: get("kaprichoza-input"),
      apetitnaia: get("apetitnaia-input"),
      posipka: get("posipka-input"),
      marmelade: get("marmelade-input"),
      blueberrie: get("blueberrie-input"),
      malina: get("malina-input")
    };

    localStorage.setItem("menuPrices", JSON.stringify(prices));
    alert("✅ Цены сохранены");
  });
}

// Утилиты
function get(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function set(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.value = value;
}
