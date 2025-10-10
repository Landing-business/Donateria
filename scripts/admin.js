import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Инициализация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDbGl-KrsQquB5NuT67Tycx8-CcbwTzq5c",
  authDomain: "donateria-e9363.firebaseapp.com",
  projectId: "donateria-e9363",
  storageBucket: "donateria-e9363.firebasestorage.app",
  messagingSenderId: "581628783077",
  appId: "1:581628783077:web:ce11d7ec9b95c578fe670c",
  measurementId: "G-1H8C2028Z4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Хеш пароля
const passwordHash = '53cba48eefbe3dc0a097ad3e5ea05799985cfbbd0e2aca7a75c2aeee8414653a';

// HTML для админки
const htmlString = `
  <div><label for="margarita-input">Маргарита:</label><input type="text" id="margarita-input"></div>
  <div><label for="peperoni-input">Пеперони:</label><input type="text" id="peperoni-input"></div>
  <div><label for="gavaiskaia-input">Гавайская:</label><input type="text" id="gavaiskaia-input"></div>
  <div><label for="meat-input">Мясная:</label><input type="text" id="meat-input"></div>
  <div><label for="kaprichoza-input">Капричоза:</label><input type="text" id="kaprichoza-input"></div>
  <div><label for="apetitnaia-input">Аппетитная:</label><input type="text" id="apetitnaia-input"></div>
  <div><label for="posipka-input">Пончик с посыпкой:</label><input type="text" id="posipka-input"></div>
  <div><label for="marmelade-input">Пончик с мармеладом:</label><input type="text" id="marmelade-input"></div>
  <div><label for="blueberrie-input">Коктейль Виноград:</label><input type="text" id="blueberrie-input"></div>
  <div><label for="malina-input">Коктейль Клубника:</label><input type="text" id="malina-input"></div>
  <b>Цены указывать в руб.<br>Копейки писать через запятую.</b>
  <b><br>Обязательно сохранить после изменения!</b>
  <button id="save-button">💾 Сохранить цены</button>
`;

// Проверка пароля
function PasswordCheck() {
  const inputField = document.getElementById("password-input");
  const wrapper = document.getElementById("admin-wrapper");

  const password = inputField.value.trim();
  const inputHash = CryptoJS.SHA256(password).toString();

  if (inputHash === passwordHash) {
    wrapper.innerHTML = htmlString;
    getPrices();

    // Привязка кнопки после генерации
    document.getElementById("save-button").addEventListener("click", () => {
      const updated = {
        "Маргарита": get("margarita-input"),
        "Пеперони": get("peperoni-input"),
        "Гавайская": get("gavaiskaia-input"),
        "Мясная": get("meat-input"),
        "Капричоза": get("kaprichoza-input"),
        "Аппетитная": get("apetitnaia-input"),
        "Пончик с посыпкой": get("posipka-input"),
        "Пончик с мармеладом": get("marmelade-input"),
        "Коктейль виноградный": get("blueberrie-input"),
        "Коктейль клубничный": get("malina-input")
      };
      updateFields("menu", "prices", updated);
    });
  } else {
    alert("❌ Неверный пароль");
  }
}

window.PasswordCheck = PasswordCheck;

// Загрузка цен
async function getPrices() {
  try {
    const docRef = doc(db, "menu", "prices");
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    set("margarita-input", data["Маргарита"]);
    set("peperoni-input", data["Пеперони"]);
    set("gavaiskaia-input", data["Гавайская"]);
    set("meat-input", data["Мясная"]);
    set("kaprichoza-input", data["Капричоза"]);
    set("apetitnaia-input", data["Аппетитная"]);
    set("posipka-input", data["Пончик с посыпкой"]);
    set("marmelade-input", data["Пончик с мармеладом"]);
    set("blueberrie-input", data["Коктейль виноградный"]);
    set("malina-input", data["Коктейль клубничный"]);
  } catch (err) {
    console.error("Ошибка загрузки:", err);
  }
}

// Обновление цен
async function updateFields(collection, docId, updatedFields) {
  try {
    const ref = doc(db, collection, docId);
    await updateDoc(ref, updatedFields);
    alert("✅ Цены успешно сохранены!");
  } catch (err) {
    console.error("❌ Ошибка при обновлении:", err);
    alert("❌ Не удалось сохранить изменения");
  }
}

// Утилиты
function set(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function get(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

