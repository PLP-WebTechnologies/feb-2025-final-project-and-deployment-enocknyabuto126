// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Sample product data (in a real application, this would come from a backend)
const products = [
    {
        id: 1,
        name: 'Classic White T-Shirt',
        price: 4499, // KES 4,499
        image: 'images/products/tshirt.jpg',
        category: 'clothing'
    },
    {
        id: 2,
        name: 'Leather Wallet',
        price: 7499, // KES 7,499
        image: 'images/products/wallet.jpg',
        category: 'accessories'
    },
    {
        id: 3,
        name: 'Running Shoes',
        price: 13499, // KES 13,499
        image: 'images/products/shoes.jpg',
        category: 'footwear'
    },
    // Add more products as needed
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    showNotification('Product removed from cart!');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Featured products display
function displayFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;

    const featuredProducts = products.slice(0, 4); // Show first 4 products
    featuredProductsContainer.innerHTML = featuredProducts.map(product => `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${CURRENCY.format(product.price)}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                Add to Cart
            </button>
        </article>
    `).join('');
}

// Newsletter form handling
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        // In a real application, you would send this to your backend
        console.log('Newsletter subscription:', email);
        showNotification('Thank you for subscribing!');
        newsletterForm.reset();
    });
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: var(--shadow);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }

    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .product-card {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: var(--shadow);
        transition: var(--transition);
    }

    .product-card:hover {
        transform: translateY(-5px);
    }

    .product-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .product-card h3 {
        padding: 1rem;
        text-align: center;
    }

    .product-card .price {
        text-align: center;
        font-weight: bold;
        color: var(--secondary-color);
    }

    .add-to-cart-btn {
        display: block;
        width: 100%;
        padding: 1rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        transition: var(--transition);
    }

    .add-to-cart-btn:hover {
        background-color: var(--secondary-color);
    }
`;
document.head.appendChild(style);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayFeaturedProducts();
}); 