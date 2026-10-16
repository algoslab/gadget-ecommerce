const products = [
 {id:1,name:"Galaxy S24 Ultra",brand:"Samsung",category:"Smartphones",price:149990,oldPrice:164990,rating:4.9,reviews:126,badge:"BESTSELLER",image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80"},
 {id:2,name:"AirPods Pro Wireless",brand:"Apple",category:"Audio",price:24990,oldPrice:28990,rating:4.8,reviews:98,badge:"POPULAR",image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80"},
 {id:3,name:"MacBook Air M2",brand:"Apple",category:"Laptops",price:109900,oldPrice:119900,rating:4.9,reviews:64,badge:"TOP RATED",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80"},
 {id:4,name:"Smart Watch Series 9",brand:"Apple",category:"Smartwatch",price:45990,oldPrice:49990,rating:4.7,reviews:120,badge:"TRENDING",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"},
 {id:5,name:"Sony WH-1000XM5",brand:"Sony",category:"Audio",price:29990,oldPrice:34990,rating:4.8,reviews:98,badge:"SAVE 14%",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"},
 {id:6,name:"Canon EOS R50",brand:"Canon",category:"Accessories",price:89990,oldPrice:94990,rating:4.6,reviews:60,badge:"NEW",image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80"},
 {id:7,name:"JBL Charge 5 Speaker",brand:"JBL",category:"Audio",price:13990,oldPrice:15990,rating:4.7,reviews:110,badge:"POPULAR",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"},
 {id:8,name:"Pro Wireless Controller",brand:"GamePro",category:"Gaming",price:7990,oldPrice:8990,rating:4.5,reviews:42,badge:"GAMING",image:"https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=700&q=80"},
 {id:9,name:"Ultra Slim Laptop",brand:"TechBook",category:"Laptops",price:82990,oldPrice:89990,rating:4.6,reviews:51,badge:"LIMITED DEAL",image:"https://images.unsplash.com/photo-149 наст?auto=format&fit=crop&w=700&q=80"},
 {id:10,name:"Fast Charge Power Bank",brand:"Volt",category:"Accessories",price:3490,oldPrice:4290,rating:4.4,reviews:73,badge:"VALUE PICK",image:"https://images.unsplash.com/photo-1609592806596-b43bada4f2c?auto=format&fit=crop&w=700&q=80"},
 {id:11,name:"Fitness Smartwatch",brand:"FitLife",category:"Smartwatch",price:6990,oldPrice:8490,rating:4.5,reviews:87,badge:"SAVE 18%",image:"https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80"},
 {id:12,name:"Wireless Gaming Headset",brand:"GamePro",category:"Gaming",price:5990,oldPrice:7490,rating:4.6,reviews:38,badge:"HOT DEAL",image:"https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=700&q=80"}
];
// Replace any image that fails to load with a neutral, valid gadget image.
const fallbackImage = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80";
let activeCategory = "all";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("gadgethub_cart") || "[]");
let wishlist = new Set();

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const taka = amount => "৳" + Number(amount).toLocaleString("en-BD");
const safeText = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));

function renderProducts() {
  let list = products.filter(p => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const haystack = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
    return matchesCategory && haystack.includes(searchTerm.toLowerCase());
  });
  const sort = document.getElementById("sortSelect").value;
  if (sort === "low") list.sort((a,b) => a.price-b.price);
  if (sort === "high") list.sort((a,b) => b.price-a.price);
  if (sort === "rating") list.sort((a,b) => b.rating-a.rating);
  productGrid.innerHTML = list.map(p => `
    <div class="col-6 col-md-4 col-lg-3">
      <article class="product-card">
        <div class="product-image">
          <span class="product-badge">${safeText(p.badge)}</span>
          <button class="wishlist-btn ${wishlist.has(p.id) ? "active" : ""}" data-wishlist="${p.id}" aria-label="Toggle wishlist"><i class="bi ${wishlist.has(p.id) ? "bi-heart-fill" : "bi-heart"}"></i></button>
          <img src="${p.image}" alt="${safeText(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}'">
        </div>
        <div class="product-info">
          <div class="product-category">${safeText(p.brand)} · ${safeText(p.category)}</div>
          <h3>${safeText(p.name)}</h3>
          <div class="rating" aria-label="${p.rating} out of 5 stars">★★★★★ <span>${p.rating} (${p.reviews})</span></div>
          <div class="price-row"><span class="price">${taka(p.price)}</span><span class="old-price">${taka(p.oldPrice)}</span></div>
          <button class="add-cart" data-add="${p.id}"><i class="bi bi-bag-plus"></i>Add to cart</button>
        </div>
      </article>
    </div>`).join("");
  emptyState.classList.toggle("d-none", list.length !== 0);
}

function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".category-card").forEach(btn => btn.classList.toggle("active", btn.dataset.category === category));
  document.querySelectorAll(".filter-pill").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === category || (category === "all" && btn.dataset.filter === "all")));
  renderProducts();
}
function showToast(message) {
  document.getElementById("toastMessage").textContent = message;
  bootstrap.Toast.getOrCreateInstance(document.getElementById("siteToast"), {delay:2200}).show();
}
function saveCart() {
  localStorage.setItem("gadgethub_cart", JSON.stringify(cart));
  renderCart();
}
function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) found.quantity++;
  else cart.push({id, quantity:1});
  saveCart();
  showToast(`${products.find(p => p.id === id).name} added to your cart`);
}
function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum,item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = count;
  document.getElementById("cartSubtotal").textContent = taka(subtotal);
  const container = document.getElementById("cartItems");
  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty"><i class="bi bi-bag"></i><h3>Your bag is waiting</h3><p>Looks like you haven’t added anything yet.</p></div>`;
    return;
  }
  container.innerHTML = cart.map(item => {
    const p = products.find(product => product.id === item.id);
    if (!p) return "";
    return `<div class="cart-line">
      <img src="${p.image}" alt="${safeText(p.name)}" onerror="this.onerror=null;this.src='${fallbackImage}'">
      <div><h4>${safeText(p.name)}</h4><div class="line-price">${taka(p.price * item.quantity)}</div>
      <div class="qty-control"><button data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-qty="${p.id}" data-change="1" aria-label="Increase quantity">+</button></div></div>
      <button class="remove-line" data-remove="${p.id}" aria-label="Remove product"><i class="bi bi-trash"></i></button>
    </div>`;
  }).join("");
}
productGrid.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const wish = event.target.closest("[data-wishlist]");
  if (add) addToCart(Number(add.dataset.add));
  if (wish) {
    const id = Number(wish.dataset.wishlist);
    wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
    renderProducts();
    showToast(wishlist.has(id) ? "Added to wishlist" : "Removed from wishlist");
  }
});
document.querySelectorAll(".category-card").forEach(btn => btn.addEventListener("click", () => {
  setCategory(btn.dataset.category);
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
}));
document.querySelectorAll(".filter-pill").forEach(btn => btn.addEventListener("click", () => setCategory(btn.dataset.filter)));
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = document.getElementById("searchInput").value.trim();
  const category = document.getElementById("searchCategory").value;
  setCategory(category === "all" ? "all" : category);
  renderProducts();
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
});
document.getElementById("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});
document.getElementById("searchCategory").addEventListener("change", event => {
  setCategory(event.target.value === "all" ? "all" : event.target.value);
});
document.getElementById("sortSelect").addEventListener("change", renderProducts);
document.getElementById("clearFilters").addEventListener("click", () => {
  searchTerm = "";
  document.getElementById("searchInput").value = "";
  document.getElementById("searchCategory").value = "all";
  setCategory("all");
});
document.querySelector(".cart-trigger").addEventListener("click", () => bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("cartDrawer")).show());
document.getElementById("cartItems").addEventListener("click", event => {
  const qty = event.target.closest("[data-qty]");
  const remove = event.target.closest("[data-remove]");
  if (qty) {
    const id = Number(qty.dataset.qty);
    const item = cart.find(row => row.id === id);
    if (item) {
      item.quantity += Number(qty.dataset.change);
      if (item.quantity <= 0) cart = cart.filter(row => row.id !== id);
      saveCart();
    }
  }
  if (remove) {
    cart = cart.filter(row => row.id !== Number(remove.dataset.remove));
    saveCart();
    showToast("Item removed from cart");
  }
});
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return showToast("Your cart is empty");
  showToast("Demo store: connect a backend to enable checkout");
});
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("newsletterEmail").value.trim();
  if (email) {
    showToast("Thanks for subscribing! (Demo)");
    event.target.reset();
  }
});
document.querySelectorAll(".hero-arrow").forEach(button => button.addEventListener("click", () => {
  const dots = [...document.querySelectorAll(".hero-dots span")];
  const current = dots.findIndex(dot => dot.classList.contains("active"));
  dots[current].classList.remove("active");
  dots[(current + (button.classList.contains("hero-next") ? 1 : dots.length - 1)) % dots.length].classList.add("active");
  showToast("Connect your campaign banners to make the slider dynamic");
}));
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
