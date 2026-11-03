// ==========================================
// AVENOR — SHOPPING BAG
// ==========================================

// Load saved cart or create an empty one
let cart = JSON.parse(localStorage.getItem("avenorCart")) || [];


// ==========================================
// ELEMENTS
// ==========================================

const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {
    localStorage.setItem("avenorCart", JSON.stringify(cart));
}


// ==========================================
// UPDATE CART DISPLAY
// ==========================================

function updateCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your shopping bag is currently empty.
            </p>
        `;

    } else {

        cart.forEach((item, index) => {

            total += item.price * item.quantity;
            itemCount += item.quantity;

            const cartItem = document.createElement("div");

            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>$${item.price} × ${item.quantity}</p>
                </div>

                <div class="cart-item-controls">

                    <button class="quantity-btn"
                        data-action="decrease"
                        data-index="${index}">−</button>

                    <span>${item.quantity}</span>

                    <button class="quantity-btn"
                        data-action="increase"
                        data-index="${index}">+</button>

                    <button class="remove-item"
                        data-action="remove"
                        data-index="${index}">Remove</button>

                </div>
            `;

            cartItems.appendChild(cartItem);

        });

    }

    if (cartCount) {
        cartCount.textContent = itemCount;
    }

    if (cartTotal) {
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    saveCart();
}


// ==========================================
// ADD PRODUCTS TO BAG
// ==========================================

document.querySelectorAll(".add-to-bag").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }

        updateCart();

        // Open shopping bag
        if (cartOverlay) {
            cartOverlay.classList.add("active");
        }

    });

});


// ==========================================
// OPEN SHOPPING BAG
// ==========================================

if (cartButton && cartOverlay) {

    cartButton.addEventListener("click", () => {
        cartOverlay.classList.add("active");
    });

}


// ==========================================
// CLOSE SHOPPING BAG
// ==========================================

if (closeCart && cartOverlay) {

    closeCart.addEventListener("click", () => {
        cartOverlay.classList.remove("active");
    });

}


// Close when clicking outside the panel
if (cartOverlay) {

    cartOverlay.addEventListener("click", event => {

        if (event.target === cartOverlay) {
            cartOverlay.classList.remove("active");
        }

    });

}


// ==========================================
// QUANTITY AND REMOVE CONTROLS
// ==========================================

if (cartItems) {

    cartItems.addEventListener("click", event => {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.action;

        if (!cart[index]) return;

        if (action === "increase") {

            cart[index].quantity++;

        }

        else if (action === "decrease") {

            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }

        }

        else if (action === "remove") {

            cart.splice(index, 1);

        }

        updateCart();

    });

}


// ==========================================
// AVENOR — DEMO ENQUIRY MODE
// ==========================================


// SEND ENQUIRY
if (checkoutButton) {

    checkoutButton.textContent = "View Demo Enquiry";

    checkoutButton.addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Your shopping bag is empty.");
            return;
        }

        let message = "AVENOR — DEMO ENQUIRY\n\n";

        let total = 0;

        cart.forEach((item, index) => {

            const subtotal = item.price * item.quantity;

            total += subtotal;

            message += `${index + 1}. ${item.name}\n`;
            message += `Quantity: ${item.quantity}\n`;
            message += `Price: $${item.price}\n`;
            message += `Subtotal: $${subtotal}\n\n`;

        });

        message += `Total: $${total.toFixed(2)}\n\n`;

        message += "This is a portfolio demonstration.\n";
        message += "No actual order or enquiry has been submitted.";

        alert(message);

        const clearBag = confirm(
            "This is a demonstration only. No enquiry was sent.\n\nWould you like to clear your shopping bag?"
        );

        if (clearBag) {

            cart = [];

            saveCart();
            updateCart();

            if (cartOverlay) {
                cartOverlay.classList.remove("active");
            }

            alert("Your shopping bag has been cleared.");

        }

    });

}


// ==========================================
// INITIALISE
// ==========================================

updateCart();


// ==========================================
// CONFIRM ENQUIRY AFTER RETURNING
// ==========================================

function confirmEnquiryOnReturn() {

    if (!pendingEnquiryConfirmation) return;

    // Prevent duplicate confirmation prompts
    pendingEnquiryConfirmation = false;

    const enquirySent = confirm(
        "Did you successfully send your enquiry through WhatsApp?"
    );

    if (enquirySent) {

        // Clear shopping bag
        cart = [];

        saveCart();
        updateCart();

        if (cartOverlay) {
            cartOverlay.classList.remove("active");
        }

        alert(
            "Thank you! Your enquiry has been confirmed. Your shopping bag is now empty."
        );

    } else {

        alert(
            "No problem! Your shopping bag has been saved."
        );

    }

}


// Detect when customer returns to AVENOR
window.addEventListener("focus", confirmEnquiryOnReturn);

document.addEventListener("visibilitychange", () => {

    if (!document.hidden) {
        confirmEnquiryOnReturn();
    }

});


// ==========================================
// INITIALISE
// ==========================================

updateCart();


// ==========================================
// AVENOR — NEWSLETTER FUNCTIONALITY
// ==========================================

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMessage = document.getElementById("newsletterMessage");

if (newsletterForm && newsletterEmail && newsletterMessage) {

    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = newsletterEmail.value.trim();

        // Check empty email
        if (email === "") {

            newsletterMessage.textContent = "Please enter your email address.";
            return;

        }

        // Check email validity
        if (!newsletterEmail.checkValidity()) {

            newsletterMessage.textContent = "Please enter a valid email address.";
            return;

        }

        // Display success message
        newsletterMessage.textContent = "Thank you for joining the AVENOR community.";

        // Clear input
        newsletterForm.reset();

    });

}


// ==========================================
// AVENOR — PRODUCT SEARCH & SORTING
// ==========================================

const productSearch = document.getElementById("productSearch");
const sortProducts = document.getElementById("sortProducts");

const productSections = document.querySelectorAll(".products-section");


// SEARCH PRODUCTS
function filterProducts() {

    const searchValue = productSearch.value.toLowerCase().trim();

    productSections.forEach(section => {

        const products = section.querySelectorAll(".product-card");

        products.forEach(product => {

            const productName = product.querySelector("h3")
                .textContent.toLowerCase();

            const productDescription = product.querySelector(".product-info p")
                .textContent.toLowerCase();

            const matches =
                productName.includes(searchValue) ||
                productDescription.includes(searchValue);

            product.style.display = matches ? "" : "none";

        });

    });

}


// SORT PRODUCTS
function sortProductCards() {

    const sortValue = sortProducts.value;

    productSections.forEach(section => {

        const grid = section.querySelector(".product-grid");

        const products = Array.from(
            grid.querySelectorAll(".product-card")
        );

        products.sort((a, b) => {

            const nameA = a.querySelector("h3").textContent.trim();
            const nameB = b.querySelector("h3").textContent.trim();

            const priceA = Number(
                a.querySelector(".product-info span").textContent.replace("$", "")
            );

            const priceB = Number(
                b.querySelector(".product-info span").textContent.replace("$", "")
            );

            if (sortValue === "price-low") {
                return priceA - priceB;
            }

            if (sortValue === "price-high") {
                return priceB - priceA;
            }

            if (sortValue === "name") {
                return nameA.localeCompare(nameB);
            }

            return 0;

        });

        products.forEach(product => grid.appendChild(product));

    });

}


// EVENT LISTENERS

if (productSearch) {
    productSearch.addEventListener("input", filterProducts);
}

if (sortProducts) {
    sortProducts.addEventListener("change", sortProductCards);
}