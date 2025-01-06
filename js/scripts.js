// Cache for filtered product lists by category
const categoryCache = {};

// Fetch products from the API and display them on the page
document.addEventListener("DOMContentLoaded", () => {
    fetchAllProducts();
});

// Fetch products from the API
async function fetchAllProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");

        if (!response.ok) {
            throw new Error(`Failed to fetch products. HTTP Status code: ${response.status}. Message: ${response.statusText}`);
        }

        const data = await response.json();
        displayProducts(data);
        displayCategories(data, getAllCategories(data));
        searchProducts(data);
    } catch (error) {
        console.log(error);
        alert("An error occurred while fetching products. Please try again later.");
    }
}

// Get unique product categories from data returned by FetchAllProducts
function getAllCategories(products) {
    return [...new Set(products.map(product => product.category))];
}

// Create button element for each category
function createButtonElement(category) {
    const button = document.createElement("button");
    button.dataset.category = category;
    button.textContent = category;
    return button;
}

// Append button for each category to the page
function displayCategories(data, categories) {
    const categoryContainer = document.querySelector(".categories-container");

    ["all", ...categories].forEach(category => {
        categoryContainer.appendChild(createButtonElement(category));
    });

    // Setup click event listeners once buttons have been added
    handleClicks(data);
}

// Handle category button clicks, updating product grid
function handleClicks(data) {
    const buttons = document.querySelectorAll("button[data-category]");

    buttons.forEach(button =>
        button.addEventListener("click", (e) => {
            // Get category from target element data attribute
            const selectedCategory = e.target.dataset.category;

            // Add matching products to cache if not present
            if (!categoryCache[selectedCategory] && selectedCategory !== "all") {
                categoryCache[selectedCategory] = data.filter(product => product.category === selectedCategory);
            }

            // Display products matching the selected category
            const products = selectedCategory === "all" ? data : categoryCache[selectedCategory];
            displayProducts(products);
        })
    );
}

// Add Search functionality
function searchProducts(data) {
    const input = document.querySelector('#search');

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();

        if (!query) {
            displayProducts(data);
        } else {
            const filtered = data.filter(product => product.title.toLowerCase().includes(query));
            displayProducts(filtered);
        }
    });
}

// Display all products on the page based on the given data
function displayProducts(products) {
    const productGrid = document.querySelector(".product-grid");
    productGrid.innerHTML = "";
    products.forEach(product => {
        const productElement = createProductElement(product);
        productGrid.appendChild(productElement);
    });
}

// Function to build each product card element
function createProductElement(product) {
    const productElement = document.createElement("article");
    productElement.classList.add("product");
    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <h2 class="title">${product.title}</h2>
        <p class="price">$${product.price}</p>
        <div></div>
    `;
    return productElement;
}

