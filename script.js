// script.js — логика каталога и корзины интернет-магазина TechStore.
// Корзина сохраняется в LocalStorage (Практическая работа № 4).

// Список товаров каталога.
const products = [
  { id: 1, name: 'Aurora X5',     brand: 'Aurora',  price: 59990, img: 'assets/phone-1.jpg' },
  { id: 2, name: 'Nebula Pro 12', brand: 'Nebula',  price: 74990, img: 'assets/phone-2.jpg' },
  { id: 3, name: 'Pixel Wave 9',  brand: 'Wave',    price: 52990, img: 'assets/phone-3.jpg' },
  { id: 4, name: 'Lumen Air',     brand: 'Lumen',   price: 41990, img: 'assets/phone-4.jpg' },
];

// Корзина — массив объектов товаров.
let cart = [];

// Ключ, по которому корзина хранится в LocalStorage.
const STORAGE_KEY = 'cart';

const catalogGrid = document.getElementById('catalog-grid');
const cartList = document.getElementById('cart-list');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const toastEl = document.getElementById('toast');

// Форматирование цены с разделителями разрядов.
const formatPrice = (value) => value.toLocaleString('ru-RU');

// --- Работа с LocalStorage ---------------------------------------------

// Сохраняет корзину в LocalStorage в формате JSON.
const saveCart = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

// Загружает корзину из LocalStorage при открытии страницы.
const loadCart = () => {
  const savedCart = localStorage.getItem(STORAGE_KEY);
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
};

// --- Отрисовка ----------------------------------------------------------

// Формирует карточки товаров каталога.
const renderCatalog = () => {
  catalogGrid.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product';
    card.innerHTML = `
      <div class="product-img"><img src="${product.img}" alt="${product.name}"></div>
      <div class="product-info">
        <span class="product-brand">${product.brand}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">${formatPrice(product.price)} ₽</div>
      </div>
      <button class="btn btn-primary product-add" data-id="${product.id}">В корзину</button>
    `;
    catalogGrid.appendChild(card);
  });
};

// Перерисовывает корзину и обновляет итоговую сумму.
const renderCart = () => {
  cartList.innerHTML = '';

  if (cart.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'cart-empty';
    empty.textContent = 'Корзина пуста.';
    cartList.appendChild(empty);
  }

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">${formatPrice(item.price)} ₽</span>
      <button class="btn-remove" data-index="${index}">Удалить</button>
    `;
    cartList.appendChild(li);
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent = formatPrice(total);
  cartCountEl.textContent = cart.length + ' ' + plural(cart.length);
};

// Склонение слова «товар».
function plural(n) {
  const forms = ['товаров', 'товар', 'товара'];
  const cases = [2, 0, 1, 1, 1, 2];
  return forms[(n % 100 > 4 && n % 100 < 20) ? 0 : cases[Math.min(n % 10, 5)]];
}

// Короткое всплывающее уведомление.
const showToast = (message) => {
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { toastEl.hidden = true; }, 2500);
};

// --- Операции с корзиной ------------------------------------------------

// Добавление товара в корзину.
const addToCart = (product) => {
  cart.push(product);
  saveCart();
  renderCart();
};

// Удаление товара по индексу.
const removeFromCart = (index) => {
  cart.splice(index, 1);
  saveCart();
  renderCart();
};

// Полная очистка корзины.
const clearCart = () => {
  cart = [];
  saveCart();
  renderCart();
};

// Оформление заказа: показываем подтверждение и очищаем корзину.
const checkout = () => {
  if (cart.length === 0) {
    showToast('Корзина пуста — добавьте товар.');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  showToast('Оплата прошла успешно! Сумма заказа: ' + formatPrice(total) + ' ₽');
  clearCart();
};

// --- Обработчики событий -------------------------------------------------

catalogGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.product-add');
  if (!button) return;
  const id = Number(button.dataset.id);
  const product = products.find((p) => p.id === id);
  addToCart(product);
});

cartList.addEventListener('click', (event) => {
  const button = event.target.closest('.btn-remove');
  if (!button) return;
  removeFromCart(Number(button.dataset.index));
});

document.getElementById('checkout-btn').addEventListener('click', checkout);
document.getElementById('clear-btn').addEventListener('click', clearCart);

// --- Инициализация ------------------------------------------------------

renderCatalog();
loadCart();   // восстановление сохранённой корзины
renderCart();
