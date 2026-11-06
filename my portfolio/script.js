// SELECT HTML ELEMENTS

const productContainer = document.getElementById("productContainer");

const cartButton = document.getElementById("cartButton");

const cartSidebar = document.getElementById("cartSidebar");

const cartOverlay = document.getElementById("cartOverlay");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const checkoutButton = document.getElementById("checkoutButton");


// CART ARRAY

let cart = JSON.parse(localStorage.getItem("shopzoneCart")) || [];

let products = [];


// FETCH PRODUCTS FROM JSON FILE

async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayProducts(products);

    }

    catch (error) {

        productContainer.innerHTML =
        "<p class='no-products'>Unable to load products. Please run the website using Live Server.</p>";

        console.error(error);

    }

}


// DISPLAY PRODUCTS DYNAMICALLY

function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML =
        "<p class='no-products'>No products found!</p>";

        return;

    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">

                <img src="${product.image}"
                alt="${product.name}"
                loading="lazy">

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <div class="rating">
                    <i class="fa-solid fa-star"></i>
                    ${product.rating} / 5
                </div>

                <p class="price">
                    ₹${product.price.toLocaleString("en-IN")}
                </p>

                <button class="add-cart"
                onclick="addToCart(${product.id})">

                    <i class="fa-solid fa-cart-plus"></i>
                    Add to Cart

                </button>

            </div>

        `;

        productContainer.appendChild(card);

    });

}


// ADD TO CART FUNCTION

function addToCart(id) {

    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {

        existingProduct.quantity++;

    }

    else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    alert(product.name + " added to cart!");

}


// INCREASE QUANTITY

function increaseQuantity(id) {

    const product = cart.find(item => item.id === id);

    if (product) {

        product.quantity++;

        saveCart();

    }

}


// DECREASE QUANTITY

function decreaseQuantity(id) {

    const product = cart.find(item => item.id === id);

    if (product) {

        product.quantity--;

        if (product.quantity <= 0) {

            removeFromCart(id);

        }

        else {

            saveCart();

        }

    }

}


// REMOVE PRODUCT FROM CART

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();

}


// SAVE CART IN LOCAL STORAGE

function saveCart() {

    localStorage.setItem("shopzoneCart", JSON.stringify(cart));

    displayCart();

}


// DISPLAY CART ITEMS

function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;

    let count = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
        "<p class='empty-cart'>Your cart is empty!</p>";

    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        count += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>₹${item.price.toLocaleString("en-IN")}</p>

                <div class="quantity-controls">

                    <button onclick="decreaseQuantity(${item.id})">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQuantity(${item.id})">
                        +
                    </button>

                </div>

            </div>

            <button class="remove-item"
            onclick="removeFromCart(${item.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        `;

        cartItems.appendChild(cartItem);

    });


    cartCount.textContent = count;

    cartTotal.textContent =
    "₹" + total.toLocaleString("en-IN");

}


// OPEN CART

cartButton.addEventListener("click", () => {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

});


// CLOSE CART

function closeCartPanel() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

}

closeCart.addEventListener("click", closeCartPanel);

cartOverlay.addEventListener("click", closeCartPanel);


// SEARCH PRODUCTS

function searchProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        return (

            product.name.toLowerCase().includes(searchValue) ||

            product.category.toLowerCase().includes(searchValue)

        );

    });

    displayProducts(filteredProducts);

}


// SEARCH BUTTON

searchButton.addEventListener("click", searchProducts);


// LIVE SEARCH

searchInput.addEventListener("input", searchProducts);


// CHECKOUT BUTTON

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty!");

    }

    else {

        alert("Thank you for shopping with ShopZone! This is a demo checkout.");

    }

});


// INITIALIZE WEBSITE

loadProducts();

displayCart();