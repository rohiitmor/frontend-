const STORAGE_KEY = 'rentease-cart';

const products = [
  {
    id: 1,
    name: 'Queen Bed Set',
    category: 'Furniture',
    rent: 1800,
    deposit: 5000,
    tenure: '3-12 months',
    description: 'Comfortable bed frame with storage and mattress support.'
  },
  {
    id: 2,
    name: '3-Seater Sofa',
    category: 'Furniture',
    rent: 1400,
    deposit: 4000,
    tenure: '2-10 months',
    description: 'Compact sofa for living rooms and studio apartments.'
  },
  {
    id: 3,
    name: 'Dining Table',
    category: 'Furniture',
    rent: 1100,
    deposit: 3500,
    tenure: '1-8 months',
    description: 'Space-saving dining set for shared urban spaces.'
  },
  {
    id: 4,
    name: 'Single Door Fridge',
    category: 'Appliances',
    rent: 2200,
    deposit: 6000,
    tenure: '3-12 months',
    description: 'Energy-efficient fridge for compact homes and dorms.'
  },
  {
    id: 5,
    name: 'Washing Machine',
    category: 'Appliances',
    rent: 2600,
    deposit: 7500,
    tenure: '4-12 months',
    description: 'Fully functional washer for everyday household needs.'
  },
  {
    id: 6,
    name: '4K Smart TV',
    category: 'Appliances',
    rent: 1900,
    deposit: 5500,
    tenure: '2-10 months',
    description: 'High-quality display for home entertainment and study rooms.'
  }
];

const inventory = [
  { name: 'Queen Bed Set', stock: 8 },
  { name: '3-Seater Sofa', stock: 5 },
  { name: 'Dining Table', stock: 9 },
  { name: 'Single Door Fridge', stock: 6 },
  { name: 'Washing Machine', stock: 4 },
  { name: '4K Smart TV', stock: 7 }
];

const maintenanceRequests = [
  { id: 'MR-101', item: 'Washing Machine', status: 'In progress' },
  { id: 'MR-102', item: 'Fridge', status: 'Scheduled' },
  { id: 'MR-103', item: 'Sofa', status: 'Resolved' }
];

let cart = loadCart();

function loadCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Unable to load cart from storage', error);
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderCartCount() {
  const counts = document.querySelectorAll('#cart-count');
  counts.forEach((el) => (el.textContent = cart.length));
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  const featured = products.slice(0, 3);
  container.innerHTML = featured.map(createProductCard).join('');
}

function renderCatalog() {
  const container = document.getElementById('catalog-grid');
  const filter = document.getElementById('category-filter');
  if (!container) return;

  const selected = filter?.value || 'all';
  const visible = products.filter((product) => selected === 'all' || product.category === selected);
  container.innerHTML = visible.map(createProductCard).join('');
}

function createProductCard(product) {
  return `
    <article class="card product-card">
      <h3>${product.name}</h3>
      <p class="meta">${product.category} • ${product.tenure}</p>
      <p>${product.description}</p>
      <div class="price">₹${product.rent}/month</div>
      <div class="meta">Deposit: ₹${product.deposit}</div>
      <button class="btn btn-primary" type="button" onclick="addToCart(${product.id})">Add to cart</button>
    </article>
  `;
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  cart.push(product);
  saveCart();
  renderCartCount();
  showToast(`${product.name} added to cart.`);
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = '<div class="card"><p>Your cart is empty. Browse the catalog to start a rental.</p></div>';
    updateSummary();
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="card stack-item">
      <div>
        <strong>${item.name}</strong>
        <p class="meta">₹${item.rent}/month • Deposit ₹${item.deposit}</p>
      </div>
      <button class="btn btn-secondary" type="button" onclick="removeFromCart(${index})">Remove</button>
    </div>
  `).join('');

  updateSummary();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartCount();
  renderCart();
  showToast('Item removed from cart.');
}

function updateSummary() {
  const totalRent = cart.reduce((sum, item) => sum + item.rent, 0);
  const totalDeposit = cart.reduce((sum, item) => sum + item.deposit, 0);
  const items = document.getElementById('summary-items');
  const rent = document.getElementById('summary-rent');
  const deposit = document.getElementById('summary-deposit');

  if (items) items.textContent = cart.length;
  if (rent) rent.textContent = `₹${totalRent}`;
  if (deposit) deposit.textContent = `₹${totalDeposit}`;
}

function renderAdmin() {
  const inventoryList = document.getElementById('inventory-list');
  const maintenanceList = document.getElementById('maintenance-list');
  const statRentals = document.getElementById('stat-rentals');
  const statMrr = document.getElementById('stat-mrr');
  const statAvailability = document.getElementById('stat-availability');

  if (!inventoryList || !maintenanceList) return;

  inventoryList.innerHTML = inventory.map((item) => `
    <div class="stack-item">
      <div>
        <strong>${item.name}</strong>
        <p class="meta">Availability: ${item.stock} units</p>
      </div>
      <span class="pill">${item.stock > 5 ? 'Healthy' : 'Low'}</span>
    </div>
  `).join('');

  maintenanceList.innerHTML = maintenanceRequests.map((request) => `
    <div class="stack-item">
      <div>
        <strong>${request.id}</strong>
        <p class="meta">${request.item}</p>
      </div>
      <span class="pill">${request.status}</span>
    </div>
  `).join('');

  if (statRentals) statRentals.textContent = '24';
  if (statMrr) statMrr.textContent = '₹86,400';
  if (statAvailability) statAvailability.textContent = '83%';
}

function initCheckout() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const city = formData.get('city')?.toString().trim();
    const date = formData.get('date')?.toString().trim();

    if (!city || !date) {
      showToast('Please complete delivery details before booking.');
      return;
    }

    if (!cart.length) {
      showToast('Your cart is empty.');
      return;
    }

    showToast(`Booking confirmed for ${city} on ${date}.`);
    form.reset();
    cart = [];
    saveCart();
    renderCart();
    renderCartCount();
  });
}

function initCatalogFilter() {
  const filter = document.getElementById('category-filter');
  if (!filter) return;
  filter.addEventListener('change', renderCatalog);
}

window.addEventListener('DOMContentLoaded', () => {
  renderCartCount();
  renderFeaturedProducts();
  renderCatalog();
  renderCart();
  renderAdmin();
  initCatalogFilter();
  initCheckout();
});
