// ==========================================
// PREETY CREATIONS - PRODUCTS
// ==========================================

let allProducts = [];

// ------------------------------------------
// LOAD PRODUCTS
// ------------------------------------------

async function loadProducts() {
  try {
    const response = await fetch(
      "designs.json",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to load designs.json: ${response.status}`
      );
    }

    allProducts = await response.json();

    renderAllProductSections();
  } catch (error) {
    console.error("Error loading products:", error);
    showProductLoadError();
  }
}

// ------------------------------------------
// RENDER ALL PRODUCT SECTIONS
// ------------------------------------------

function renderAllProductSections() {
  const newProducts = allProducts.filter(
    (product) => product.isNew === true
  );

  const studsProducts = allProducts.filter(
    (product) => product.category === "studs"
  );

  const jhumkaProducts = allProducts.filter(
    (product) => product.category === "jhumka"
  );

  const fancyProducts = allProducts.filter(
    (product) => product.category === "fancy"
  );

  const partyWearProducts = allProducts.filter(
    (product) => product.category === "party-wear"
  );

  renderProducts(
    newProducts,
    "newCollectionGrid"
  );

  renderProducts(
    studsProducts,
    "studsGrid"
  );

  renderProducts(
    jhumkaProducts,
    "jhumkaGrid"
  );

  renderProducts(
    fancyProducts,
    "fancyGrid"
  );

  renderProducts(
    partyWearProducts,
    "partyWearGrid"
  );

  // If cart.js has already loaded,
  // synchronize the product cards with cart.
  if (typeof syncProductCards === "function") {
    syncProductCards();
  }
}

// ------------------------------------------
// RENDER PRODUCTS
// ------------------------------------------

function renderProducts(products, containerId) {
  const container =
    document.getElementById(containerId);

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (products.length === 0) {
    const emptyMessage =
      document.createElement("p");

    emptyMessage.className =
      "empty-category-message";

    emptyMessage.textContent =
      "No products available in this collection yet.";

    container.appendChild(emptyMessage);

    return;
  }

  products.forEach((product) => {
    const card = createProductCard(product);

    container.appendChild(card);
  });
}

// ------------------------------------------
// CREATE PRODUCT CARD
// ------------------------------------------

function createProductCard(product) {
  const card =
    document.createElement("article");

  card.className = "product-card";

  // ----------------------------------------
  // IMAGE
  // ----------------------------------------

  const imageWrapper =
    document.createElement("div");

  imageWrapper.className =
    "product-image-wrapper";

  const image =
    document.createElement("img");

  image.className =
    "product-image";

  image.src =
    `Images/${encodeURIComponent(product.image)}`;

  image.alt =
    product.design || "Handmade jewellery";

  image.loading = "lazy";

  imageWrapper.appendChild(image);

  // ----------------------------------------
  // NEW BADGE
  // ----------------------------------------

  if (product.isNew === true) {
    const newBadge =
      document.createElement("span");

    newBadge.className = "new-badge";

    newBadge.textContent = "NEW";

    imageWrapper.appendChild(newBadge);
  }

  // ----------------------------------------
  // PRODUCT DETAILS
  // ----------------------------------------

  const details =
    document.createElement("div");

  details.className =
    "product-details";

  const title =
    document.createElement("h3");

  title.className =
    "product-title";

  title.textContent =
    product.design || "Design";

  details.appendChild(title);

  // ----------------------------------------
  // PRICE
  // ----------------------------------------

  const price =
    document.createElement("div");

  price.className =
    "product-price";

  price.textContent =
    formatPrice(product.price);

  details.appendChild(price);

  // ----------------------------------------
  // SELECTION ROW
  // ----------------------------------------

  const selectionRow =
    document.createElement("div");

  selectionRow.className =
    "product-selection-row";

  const checkboxLabel =
    document.createElement("label");

  checkboxLabel.className =
    "product-select-label";

  // Checkbox
  const checkbox =
    document.createElement("input");

  checkbox.type = "checkbox";

  checkbox.className =
    "product-checkbox";

  // IMPORTANT:
  // Stable ID used by cart.js
  checkbox.dataset.id =
    product.design;

  checkbox.dataset.quantity = "1";

  // Text
  const selectText =
    document.createElement("span");

  selectText.textContent =
    "Select";

  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(selectText);

  selectionRow.appendChild(
    checkboxLabel
  );

  // ----------------------------------------
  // QUANTITY CONTROLS
  // ----------------------------------------

  const quantityControls =
    document.createElement("div");

  quantityControls.className =
    "quantity-controls";

  const minusButton =
    document.createElement("button");

  minusButton.type = "button";

  minusButton.className =
    "quantity-button quantity-minus";

  minusButton.textContent = "−";

  minusButton.setAttribute(
    "aria-label",
    `Decrease quantity for ${product.design}`
  );

  const quantityValue =
    document.createElement("span");

  quantityValue.className =
    "quantity-value";

  quantityValue.textContent = "1";

  const plusButton =
    document.createElement("button");

  plusButton.type = "button";

  plusButton.className =
    "quantity-button quantity-plus";

  plusButton.textContent = "+";

  plusButton.setAttribute(
    "aria-label",
    `Increase quantity for ${product.design}`
  );

  quantityControls.appendChild(
    minusButton
  );

  quantityControls.appendChild(
    quantityValue
  );

  quantityControls.appendChild(
    plusButton
  );

  selectionRow.appendChild(
    quantityControls
  );

  details.appendChild(
    selectionRow
  );

  // ----------------------------------------
  // ADD TO CARD
  // ----------------------------------------

  card.appendChild(imageWrapper);
  card.appendChild(details);

  // ----------------------------------------
  // CHECKBOX CHANGE
  // ----------------------------------------

  checkbox.addEventListener(
    "change",
    () => {
      const quantity =
        Number(checkbox.dataset.quantity) || 1;

      if (checkbox.checked) {
        card.classList.add("selected");

        updateProductSelection(
          product,
          quantity,
          true
        );
      } else {
        card.classList.remove("selected");

        updateProductSelection(
          product,
          0,
          false
        );
      }
    }
  );

  // ----------------------------------------
  // PLUS BUTTON
  // ----------------------------------------

  plusButton.addEventListener(
    "click",
    () => {
      let quantity =
        Number(checkbox.dataset.quantity) || 1;

      quantity++;

      checkbox.dataset.quantity =
        quantity;

      quantityValue.textContent =
        quantity;

      // Selecting product automatically
      // when quantity is increased.
      if (!checkbox.checked) {
        checkbox.checked = true;
        card.classList.add("selected");
      }

      updateProductSelection(
        product,
        quantity,
        true
      );
    }
  );

  // ----------------------------------------
  // MINUS BUTTON
  // ----------------------------------------

  minusButton.addEventListener(
    "click",
    () => {
      let quantity =
        Number(checkbox.dataset.quantity) || 1;

      if (quantity > 1) {
        quantity--;

        checkbox.dataset.quantity =
          quantity;

        quantityValue.textContent =
          quantity;

        if (checkbox.checked) {
          updateProductSelection(
            product,
            quantity,
            true
          );
        }
      } else {
        // Quantity cannot go below 1.
        // If selected, unselect the product.
        checkbox.checked = false;

        checkbox.dataset.quantity = "1";

        quantityValue.textContent = "1";

        card.classList.remove("selected");

        updateProductSelection(
          product,
          0,
          false
        );
      }
    }
  );

  return card;
}

// ------------------------------------------
// UPDATE PRODUCT SELECTION
// ------------------------------------------

function updateProductSelection(
  product,
  quantity,
  selected
) {
  if (
    typeof updateCartFromProduct !==
    "function"
  ) {
    return;
  }

  updateCartFromProduct({
    id: product.design,
    design: product.design,
    image: product.image,
    price: product.price,
    quantity: selected
      ? quantity
      : 0
  });
}

// ------------------------------------------
// FORMAT PRICE
// ------------------------------------------

function formatPrice(price) {
  const numericPrice =
    Number(price);

  if (
    !Number.isFinite(numericPrice) ||
    numericPrice <= 0
  ) {
    return "Price on request";
  }

  return `₹${numericPrice.toLocaleString(
    "en-IN"
  )}`;
}

// ------------------------------------------
// LOAD ERROR
// ------------------------------------------

function showProductLoadError() {
  const containers = [
    "newCollectionGrid",
    "studsGrid",
    "jhumkaGrid",
    "fancyGrid",
    "partyWearGrid"
  ];

  containers.forEach((containerId) => {
    const container =
      document.getElementById(
        containerId
      );

    if (!container) {
      return;
    }

    container.innerHTML = `
      <p class="empty-category-message">
        Unable to load products right now.
        Please refresh the page and try again.
      </p>
    `;
  });
}

// ------------------------------------------
// START
// ------------------------------------------

document.addEventListener(
  "DOMContentLoaded",
  loadProducts
);