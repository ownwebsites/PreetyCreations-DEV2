// ==========================================
// PREETY CREATIONS - CART
// ==========================================

const WHATSAPP_NUMBER = "919049249567";

const WHATSAPP_GREETING =
  "Hi @PreetyCreations 👋";

let cart = {};

// ------------------------------------------
// INITIALIZE CART
// ------------------------------------------

function initializeCart() {
  loadCartFromStorage();

  updateCartUI();

  setupCartEvents();

  setupContactWhatsApp();
}

// ------------------------------------------
// LOCAL STORAGE
// ------------------------------------------

function saveCartToStorage() {
  localStorage.setItem(
    "preetyCreationsCart",
    JSON.stringify(cart)
  );
}

function loadCartFromStorage() {
  try {
    const savedCart =
      localStorage.getItem(
        "preetyCreationsCart"
      );

    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (error) {
    console.error(
      "Could not load cart:",
      error
    );

    cart = {};
  }
}

// ------------------------------------------
// UPDATE CART FROM PRODUCT
// ------------------------------------------

function updateCartFromProduct(product) {
  if (!product || !product.id) {
    return;
  }

  const quantity =
    Number(product.quantity) || 0;

  if (quantity <= 0) {
    delete cart[product.id];
  } else {
    cart[product.id] = {
      id: product.id,
      design: product.design,
      image: product.image,
      price: Number(product.price) || 0,
      quantity: quantity
    };
  }

  saveCartToStorage();

  updateCartUI();
}

// ------------------------------------------
// GET CART ITEMS
// ------------------------------------------

function getCartItems() {
  return Object.values(cart);
}

// ------------------------------------------
// GET CART COUNT
// ------------------------------------------

function getCartCount() {
  return getCartItems().reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}

// ------------------------------------------
// GET CART TOTAL
// ------------------------------------------

function getCartTotal() {
  return getCartItems().reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );
}

// ------------------------------------------
// UPDATE CART UI
// ------------------------------------------

function updateCartUI() {
  const items =
    getCartItems();

  const count =
    getCartCount();

  const total =
    getCartTotal();

  // ----------------------------------------
  // NAVBAR CART COUNT
  // ----------------------------------------
  // Kept for compatibility in case an old
  // navbar cart element still exists.
  // It does nothing when the element is removed.

  const navbarCartCount =
    document.getElementById(
      "navbarCartCount"
    );

  if (navbarCartCount) {
    navbarCartCount.textContent =
      count;
  }

  // ----------------------------------------
  // BOTTOM CART
  // ----------------------------------------

  const cartCount =
    document.getElementById(
      "cartCount"
    );

  const cartText =
    document.getElementById(
      "cartText"
    );

  if (cartCount) {
    cartCount.textContent =
      count;
  }

  if (cartText) {
    if (count === 0) {
      cartText.textContent = "   ";
    } else {
      cartText.textContent =
        `${count} item${count === 1
          ? ""
          : "s"
        } • ${formatCartPrice(total)}`;
    }
  }

  // ----------------------------------------
  // CART MODAL
  // ----------------------------------------

  renderCartModal(items);

  // ----------------------------------------
  // PRODUCT CARDS
  // ----------------------------------------

  syncProductCards();
}

// ------------------------------------------
// RENDER CART MODAL
// ------------------------------------------

function renderCartModal(items) {
  const cartItemsContainer =
    document.getElementById(
      "cartItems"
    );

  const cartEmptyState =
    document.getElementById(
      "cartEmptyState"
    );

  const cartTotal =
    document.getElementById(
      "cartTotal"
    );

  if (!cartItemsContainer) {
    return;
  }

  cartItemsContainer.innerHTML =
    "";

  // Empty cart
  if (items.length === 0) {
    if (cartEmptyState) {
      cartEmptyState.style.display =
        "block";
    }

    if (cartTotal) {
      cartTotal.textContent =
        "₹0";
    }

    return;
  }

  if (cartEmptyState) {
    cartEmptyState.style.display =
      "none";
  }

  // ----------------------------------------
  // CART ITEMS
  // ----------------------------------------

  items.forEach((item) => {
    const cartItem =
      document.createElement(
        "div"
      );

    cartItem.className =
      "cart-item";

    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img
          src="Images/${encodeURIComponent(
      item.image
    )}"
          alt="${escapeHtml(
      item.design
    )}"
        >
      </div>

      <div class="cart-item-details">

        <div class="cart-item-title">
          ${escapeHtml(
      item.design
    )}
        </div>

        <div class="cart-item-price">
          ${formatCartPrice(
      item.price
    )}
        </div>

        <div class="cart-item-controls">

          <button
            type="button"
            class="cart-quantity-button"
            data-action="decrease"
            data-id="${escapeHtml(
      item.id
    )}"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span class="cart-quantity">
            ${item.quantity}
          </span>

          <button
            type="button"
            class="cart-quantity-button"
            data-action="increase"
            data-id="${escapeHtml(
      item.id
    )}"
            aria-label="Increase quantity"
          >
            +
          </button>

          <button
            type="button"
            class="cart-remove-button"
            data-action="remove"
            data-id="${escapeHtml(
      item.id
    )}"
          >
            Remove
          </button>

        </div>

      </div>

      <div class="cart-item-subtotal">
        ${item.price > 0
        ? formatCartPrice(
          item.price *
          item.quantity
        )
        : "On request"
      }
      </div>
    `;

    cartItemsContainer.appendChild(
      cartItem
    );
  });

  // ----------------------------------------
  // TOTAL
  // ----------------------------------------

  if (cartTotal) {
    cartTotal.textContent =
      formatCartPrice(
        getCartTotal()
      );
  }
}

// ------------------------------------------
// CHANGE CART QUANTITY
// ------------------------------------------

function changeCartQuantity(
  id,
  change
) {
  if (!cart[id]) {
    return;
  }

  cart[id].quantity += change;

  if (cart[id].quantity <= 0) {
    delete cart[id];
  }

  saveCartToStorage();

  updateCartUI();
}

// ------------------------------------------
// REMOVE CART ITEM
// ------------------------------------------

function removeCartItem(id) {
  if (!cart[id]) {
    return;
  }

  delete cart[id];

  saveCartToStorage();

  updateCartUI();
}

// ------------------------------------------
// SYNC PRODUCT CARDS
// ------------------------------------------

function syncProductCards() {
  document
    .querySelectorAll(
      ".product-card"
    )
    .forEach((card) => {
      const checkbox =
        card.querySelector(
          ".product-checkbox"
        );

      const quantityElement =
        card.querySelector(
          ".quantity-value"
        );

      if (!checkbox) {
        return;
      }

      const productId =
        checkbox.dataset.id;

      const cartItem =
        cart[productId];

      if (cartItem) {
        checkbox.checked =
          true;

        card.classList.add(
          "selected"
        );

        if (quantityElement) {
          quantityElement.textContent =
            cartItem.quantity;
        }

        checkbox.dataset.quantity =
          cartItem.quantity;
      } else {
        checkbox.checked =
          false;

        card.classList.remove(
          "selected"
        );

        // DEFAULT QUANTITY = 0
        if (quantityElement) {
          quantityElement.textContent =
            "0";
        }

        checkbox.dataset.quantity =
          "0";
      }
    });
}

// ------------------------------------------
// OPEN CART
// ------------------------------------------

function openCart() {
  const overlay =
    document.getElementById(
      "cartModalOverlay"
    );

  if (!overlay) {
    return;
  }

  overlay.classList.add(
    "open"
  );

  document.body.classList.add(
    "modal-open"
  );
}

// ------------------------------------------
// CLOSE CART
// ------------------------------------------

function closeCart() {
  const overlay =
    document.getElementById(
      "cartModalOverlay"
    );

  if (!overlay) {
    return;
  }

  overlay.classList.remove(
    "open"
  );

  document.body.classList.remove(
    "modal-open"
  );
}

// ------------------------------------------
// CART EVENTS
// ------------------------------------------

function setupCartEvents() {
  // Top navbar cart has been removed.
  // Only the bottom cart button is used.

  const cartSummaryButton =
    document.getElementById(
      "cartSummaryButton"
    );

  const closeCartButton =
    document.getElementById(
      "closeCartButton"
    );

  const cartModalOverlay =
    document.getElementById(
      "cartModalOverlay"
    );

  const emptyCartExplore =
    document.getElementById(
      "emptyCartExplore"
    );

  const placeOrderButton =
    document.getElementById(
      "placeOrderButton"
    );

  const modalOrderButton =
    document.getElementById(
      "modalOrderButton"
    );

  // ----------------------------------------
  // BOTTOM CART
  // ----------------------------------------

  if (cartSummaryButton) {
    cartSummaryButton.addEventListener(
      "click",
      openCart
    );
  }

  // ----------------------------------------
  // CLOSE BUTTON
  // ----------------------------------------

  if (closeCartButton) {
    closeCartButton.addEventListener(
      "click",
      closeCart
    );
  }

  // ----------------------------------------
  // CLICK OUTSIDE MODAL
  // ----------------------------------------

  if (cartModalOverlay) {
    cartModalOverlay.addEventListener(
      "click",
      (event) => {
        if (
          event.target ===
          cartModalOverlay
        ) {
          closeCart();
        }
      }
    );
  }

  // ----------------------------------------
  // EXPLORE PRODUCTS
  // ----------------------------------------

  if (emptyCartExplore) {
    emptyCartExplore.addEventListener(
      "click",
      () => {
        closeCart();

        const newCollection =
          document.getElementById(
            "new-collection"
          );

        if (newCollection) {
          newCollection.scrollIntoView(
            {
              behavior: "smooth"
            }
          );
        }
      }
    );
  }

  // ----------------------------------------
  // BOTTOM PLACE ORDER
  // ----------------------------------------

  if (placeOrderButton) {
    placeOrderButton.addEventListener(
      "click",
      handleWhatsAppOrder
    );
  }

  // ----------------------------------------
  // MODAL PLACE ORDER
  // ----------------------------------------

  if (modalOrderButton) {
    modalOrderButton.addEventListener(
      "click",
      handleWhatsAppOrder
    );
  }

  // ----------------------------------------
  // CART ITEM BUTTONS
  // ----------------------------------------

  document.addEventListener(
    "click",
    (event) => {
      const button =
        event.target.closest(
          ".cart-quantity-button, .cart-remove-button"
        );

      if (!button) {
        return;
      }

      const id =
        button.dataset.id;

      const action =
        button.dataset.action;

      if (!id || !action) {
        return;
      }

      if (
        action ===
        "increase"
      ) {
        changeCartQuantity(
          id,
          1
        );
      }

      if (
        action ===
        "decrease"
      ) {
        changeCartQuantity(
          id,
          -1
        );
      }

      if (
        action ===
        "remove"
      ) {
        removeCartItem(id);
      }
    }
  );

  // ----------------------------------------
  // ESC KEY
  // ----------------------------------------

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key ===
        "Escape"
      ) {
        closeCart();
      }
    }
  );
}

// ------------------------------------------
// CONTACT WHATSAPP
// ------------------------------------------

function setupContactWhatsApp() {
  const contactButton =
    document.getElementById(
      "contactWhatsAppButton"
    );

  if (!contactButton) {
    return;
  }

  contactButton.addEventListener(
    "click",
    () => {
      openWhatsApp(
        WHATSAPP_GREETING
      );
    }
  );
}

// ------------------------------------------
// WHATSAPP ORDER
// ------------------------------------------

function handleWhatsAppOrder() {
  const items =
    getCartItems();

  if (items.length === 0) {
    openCart();
    return;
  }

  const message =
    createOrderMessage();

  openWhatsApp(
    message
  );
}

// ------------------------------------------
// CREATE ORDER MESSAGE
// ------------------------------------------

function createOrderMessage() {
  const items =
    getCartItems();

  let message =
    `${WHATSAPP_GREETING}\n\n`;

  message +=
    "I would like to place an order for these handmade jewellery designs:\n\n";

  items.forEach(
    (item) => {
      const quantity =
        Number(item.quantity) || 0;

      const price =
        Number(item.price) || 0;

      const subtotal =
        price * quantity;

      message +=
        `${item.design}\n`;

      message +=
        `Quantity: ${quantity}\n`;

      if (price > 0) {
        message +=
          `Price: ${formatCartPrice(
            price
          )} each\n`;

        message +=
          `Subtotal: ${formatCartPrice(
            subtotal
          )}\n\n`;
      } else {
        message +=
          "Price: Price on request\n";

        message +=
          "Subtotal: Price on request\n\n";
      }
    }
  );

  message +=
    `Total Order Value: ${formatCartPrice(
      getCartTotal()
    )}\n\n`;

  message += "I understand that the above prices exclude delivery charges and that delivery charges depend on my location.\n\n";
  message += "Please confirm availability and my order. Thank you! ✨";
    
  return message;
}

// ------------------------------------------
// OPEN WHATSAPP
// ------------------------------------------

function openWhatsApp(message) {
  const encodedMessage =
    encodeURIComponent(
      message
    );

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  window.open(
    whatsappUrl,
    "_blank",
    "noopener,noreferrer"
  );
}

// ------------------------------------------
// FORMAT PRICE
// ------------------------------------------

function formatCartPrice(price) {
  const numericPrice =
    Number(price);

  if (
    !Number.isFinite(
      numericPrice
    ) ||
    numericPrice <= 0
  ) {
    return "Price on request";
  }

  return `₹${numericPrice.toLocaleString(
    "en-IN"
  )}`;
}

// ------------------------------------------
// ESCAPE HTML
// ------------------------------------------

function escapeHtml(value) {
  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}

// ------------------------------------------
// START
// ------------------------------------------

document.addEventListener(
  "DOMContentLoaded",
  initializeCart
);