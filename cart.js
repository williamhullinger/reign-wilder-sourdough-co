/* =========================
   REIGN & WILDER CART
========================= */

const CART_STORAGE_KEY = "reignWilderCart";
const TAX_RATE = 0.0825;

const cartItemsContainer = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");

const cartSubtotal = document.getElementById("cart-subtotal");
const cartTax = document.getElementById("cart-tax");
const cartTotal = document.getElementById("cart-total");

const checkoutButton = document.getElementById("cart-checkout-button");
const cartOrderData = document.getElementById("cart-order-data");

let cart = loadCart();

function loadCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!savedCart) return [];

  try {
    return JSON.parse(savedCart);
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
}

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function calculateSubtotal() {
  return cart.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const floatingCartCount = document.getElementById("floating-cart-count");

  const totalItems = cart.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);

  [cartCount, floatingCartCount].forEach((count) => {
    if (!count) return;

    count.textContent = totalItems;
    count.style.display = totalItems > 0 ? "inline-block" : "none";
  });
}

function updateTotals() {
  const subtotal = calculateSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (cartSubtotal) cartSubtotal.textContent = formatMoney(subtotal);
  if (cartTax) cartTax.textContent = formatMoney(tax);
  if (cartTotal) cartTotal.textContent = formatMoney(total);

  if (cartOrderData) {
    cartOrderData.value = JSON.stringify({
      items: cart,
      subtotal,
      tax,
      total,
    });
  }

  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
  }
}

function renderCart() {
  if (!cartItemsContainer || !cartEmpty) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartItemsContainer.style.display = "none";
    updateTotals();
    return;
  }

  cartEmpty.style.display = "none";
  cartItemsContainer.style.display = "grid";

  cart.forEach((item) => {
    const cartItem = document.createElement("article");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      
      <div class="cart-item__info">
        <h4>${item.name}</h4>
        <p>${formatMoney(Number(item.price))} each</p>
        ${item.details ? `<p class="cart-item__details">${item.details}</p>` : ""}
        ${
          item.builderData
            ? `<button class="cart-item__edit" type="button" data-edit-cake-order="${item.id}">Edit Order</button>`
            : ""
        }
      </div>

      <div class="cart-item__controls">
        <input
          class="cart-item__qty"
          type="number"
          min="1"
          value="${item.quantity}"
          aria-label="Quantity for ${item.name}"
          data-cart-qty="${item.id}"
        >

        <button
          class="cart-item__remove"
          type="button"
          data-cart-remove="${item.id}"
        >
          Remove
        </button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  updateTotals();
}

function updateQuantity(id, quantity) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  item.quantity = Math.max(1, Number(quantity) || 1);
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: product.quantity || 1,
      details: product.details || "",
      builderData: product.builderData || null,
    });
  }

  saveCart();
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");
  const removeButton = event.target.closest("[data-cart-remove]");
  const editButton = event.target.closest("[data-edit-cake-order]");

  if (editButton) {
    const item = cart.find(
      (cartItem) => cartItem.id === editButton.dataset.editCakeOrder
    );

    if (!item) return;

    localStorage.setItem("editCakeOrder", JSON.stringify(item));
    window.location.href = "cake-pop-builder.html";
  }

  if (addButton) {
    const product = {
      id: addButton.dataset.id,
      name: addButton.dataset.name,
      price: addButton.dataset.price,
      image: addButton.dataset.image,
      quantity: Number(addButton.dataset.quantity) || 1,
      details: addButton.dataset.details || "",
    };

    addToCart(product);

    addButton.textContent = "Added";

    setTimeout(() => {
      addButton.textContent = "Add to Cart";
    }, 1200);
  }

  if (removeButton) {
    removeItem(removeButton.dataset.cartRemove);
  }
});

document.addEventListener("input", (event) => {
  const qtyInput = event.target.closest("[data-cart-qty]");

  if (!qtyInput) return;

  updateQuantity(qtyInput.dataset.cartQty, Number(qtyInput.value));
});

if (checkoutButton) {
  checkoutButton.addEventListener("click", async () => {
    if (cart.length === 0) return;

    checkoutButton.disabled = true;
    checkoutButton.textContent = "Opening Checkout...";

    const customer = {
      name: document.getElementById("cart-name")?.value || "",
      email: document.getElementById("cart-email")?.value || "",
      phone: document.getElementById("cart-phone")?.value || "",
    };

    const fulfillment = {
      type: document.getElementById("cart-fulfillment")?.value || "",
      date: document.getElementById("cart-date")?.value || "",
      time: document.getElementById("cart-time")?.value || "",
      standardPickupDate:
        document.getElementById("cart-standard-pickup-date")?.value || "",
    };

    const notes = document.getElementById("cart-notes")?.value || "";

    try {
      const response = await fetch("/.netlify/functions/create-square-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          customer,
          fulfillment,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Checkout failed.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      alert(
        "Checkout could not be started. Please try again or contact Reign & Wilder."
      );

      checkoutButton.disabled = false;
      checkoutButton.textContent = "Continue to Checkout";

      console.error(error);
    }
  });
}

/* =========================
   PICKUP DATE CALCULATOR
========================= */

function getNextPickupSaturday() {
  const now = new Date();

  const day = now.getDay(); // 0=Sun, 1=Mon, 2=Tue, etc.
  const hour = now.getHours();

  const deadlinePassed =
    day > 2 || (day === 2 && hour >= 18);

  let pickupDate = new Date(now);

  if (deadlinePassed) {
    const daysUntilSaturday = ((6 - day + 7) % 7) + 7;
    pickupDate.setDate(now.getDate() + daysUntilSaturday);
  } else {
    const daysUntilSaturday = (6 - day + 7) % 7;
    pickupDate.setDate(now.getDate() + daysUntilSaturday);
  }

  return pickupDate;
}

function formatPickupDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();

  const pickupDisplay = document.getElementById("cart-pickup-date");
  const pickupInput = document.getElementById("cart-standard-pickup-date");

  if (pickupDisplay || pickupInput) {
    const pickupDate = getNextPickupSaturday();
    const formatted = formatPickupDate(pickupDate);

    if (pickupDisplay) {
      pickupDisplay.textContent = formatted;
    }

    if (pickupInput) {
      pickupInput.value = formatted;
    }
  }
});