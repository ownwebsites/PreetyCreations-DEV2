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
  const newProducts = allProducts.filter((product) => product.isNew === true);
  const featuredProducts = allProducts.filter((product) => product.isFeatured === true);
  const studsProducts = allProducts.filter((product) => product.category === "studs");
  const jhumkaProducts = allProducts.filter((product) => product.category === "jhumka");
  const fancyProducts = allProducts.filter((product) => product.category === "fancy");
  const partyWearProducts = allProducts.filter((product) => product.category === "party-wear");

  renderProducts(newProducts, "newCollectionGrid");
  renderProducts(featuredProducts, "featuredGrid");
  renderProducts(studsProducts, "studsGrid");
  renderProducts(jhumkaProducts, "jhumkaGrid");
  renderProducts(fancyProducts, "fancyGrid");
  renderProducts(partyWearProducts, "partyWearGrid");

  if (typeof syncProductCards === "function") syncProductCards();
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

    newBadge.className =
      "new-badge";

    newBadge.textContent =
      "NEW";

    imageWrapper.appendChild(
      newBadge
    );
  }

  // ----------------------------------------
  // PRODUCT DETAILS
  // ----------------------------------------

  const details =
    document.createElement("div");

  details.className =
    "product-info";

  // ----------------------------------------
  // SELECTION ROW
  // ----------------------------------------

  const selectionRow =
    document.createElement("div");

  selectionRow.className =
    "product-selection";

  // ----------------------------------------
  // CHECKBOX / SELECT
  // ----------------------------------------

  const checkboxLabel =
    document.createElement("label");

  checkboxLabel.className =
    "select-product";

  const checkbox =
    document.createElement("input");

  checkbox.type = "checkbox";

  checkbox.className =
    "product-checkbox";

  // Stable ID used by cart.js
  checkbox.dataset.id =
    product.design;

  // DEFAULT QUANTITY = 0
  checkbox.dataset.quantity =
    "0";

  checkboxLabel.appendChild(
    checkbox
  );

  const designText =
    document.createElement("span");

  designText.textContent =
    product.design;

  checkboxLabel.appendChild(
    designText
  );

  selectionRow.appendChild(
    checkboxLabel
  );

  // ----------------------------------------
  // PRICE
  // ----------------------------------------

  const price =
    document.createElement("div");

  price.className =
    "product-price";

  price.textContent =
    formatPrice(product.price);

  selectionRow.appendChild(
    price
  );

  // ----------------------------------------
  // QUANTITY CONTROLS
  // ----------------------------------------

  const quantityControl =
    document.createElement("div");

  quantityControl.className =
    "quantity-control";

  const minusButton =
    document.createElement("button");

  minusButton.type = "button";

  minusButton.className =
    "quantity-button quantity-minus";

  minusButton.textContent =
    "−";

  minusButton.setAttribute(
    "aria-label",
    `Decrease quantity for ${product.design}`
  );

  const quantityValue =
    document.createElement("span");

  quantityValue.className =
    "quantity-value";

  // DEFAULT DISPLAY = 0
  quantityValue.textContent =
    "0";

  const plusButton =
    document.createElement("button");

  plusButton.type = "button";

  plusButton.className =
    "quantity-button quantity-plus";

  plusButton.textContent =
    "+";

  plusButton.setAttribute(
    "aria-label",
    `Increase quantity for ${product.design}`
  );

  quantityControl.appendChild(
    minusButton
  );

  quantityControl.appendChild(
    quantityValue
  );

  quantityControl.appendChild(
    plusButton
  );

  selectionRow.appendChild(
    quantityControl
  );

  // Add selection row to product details
  details.appendChild(
    selectionRow
  );

  // ----------------------------------------
  // ADD TO CARD
  // ----------------------------------------

  card.appendChild(
    imageWrapper
  );

  card.appendChild(
    details
  );

  // ----------------------------------------
  // CHECKBOX CHANGE
  // ----------------------------------------

  checkbox.addEventListener(
    "change",
    () => {
      let quantity =
        Number(
          checkbox.dataset.quantity
        ) || 0;

      if (checkbox.checked) {

        // If user checks manually while
        // quantity is 0, set quantity to 1.
        if (quantity === 0) {
          quantity = 1;

          checkbox.dataset.quantity =
            "1";

          quantityValue.textContent =
            "1";
        }

        card.classList.add(
          "selected"
        );

        updateProductSelection(
          product,
          quantity,
          true
        );

      } else {

        // Unchecking always means
        // quantity becomes 0.
        checkbox.dataset.quantity =
          "0";

        quantityValue.textContent =
          "0";

        card.classList.remove(
          "selected"
        );

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
        Number(
          checkbox.dataset.quantity
        ) || 0;

      // Increase quantity by 1
      quantity++;

      checkbox.dataset.quantity =
        String(quantity);

      quantityValue.textContent =
        String(quantity);

      // Clicking + automatically selects
      // the product.
      if (!checkbox.checked) {
        checkbox.checked = true;

        card.classList.add(
          "selected"
        );
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
        Number(
          checkbox.dataset.quantity
        ) || 0;

      // Do nothing when already at 0
      if (quantity <= 0) {
        checkbox.dataset.quantity =
          "0";

        quantityValue.textContent =
          "0";

        return;
      }

      quantity--;

      checkbox.dataset.quantity =
        String(quantity);

      quantityValue.textContent =
        String(quantity);

      if (quantity === 0) {

        // Quantity 0 means product is
        // no longer selected.
        checkbox.checked = false;

        card.classList.remove(
          "selected"
        );

        updateProductSelection(
          product,
          0,
          false
        );

      } else {

        // Still selected with quantity 1+
        if (!checkbox.checked) {
          checkbox.checked = true;

          card.classList.add(
            "selected"
          );
        }

        updateProductSelection(
          product,
          quantity,
          true
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

  containers.forEach(
    (containerId) => {
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
    }
  );
}

// ------------------------------------------
// START
// ------------------------------------------

document.addEventListener(
  "DOMContentLoaded",
  loadProducts
);