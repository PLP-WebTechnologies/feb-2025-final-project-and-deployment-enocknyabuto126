// Cart Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartContent = document.querySelector('.cart-content');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const promoCodeInput = document.getElementById('promo-code');
    const applyPromoBtn = document.getElementById('apply-promo');

    // Constants
    const SHIPPING_RATE = 899; // KES 899
    const TAX_RATE = 0.16; // 16% VAT
    const PROMO_CODES = {
        'WELCOME10': 0.10, // 10% off
        'SAVE20': 0.20,    // 20% off
        'FREESHIP': 'free' // Free shipping
    };

    // State
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let appliedPromo = null;

    // Initialize cart
    function initCart() {
        updateCartDisplay();
        updateCartSummary();
        setupEventListeners();
    }

    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartContent.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }

        cartContent.style.display = 'grid';
        emptyCartMessage.style.display = 'none';

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">${CURRENCY.format(item.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" aria-label="Decrease quantity">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" aria-label="Item quantity">
                        <button class="quantity-btn increase" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="remove-item" aria-label="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Update cart count in header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }

    // Update cart summary
    function updateCartSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        let shipping = SHIPPING_RATE;
        let discount = 0;

        // Apply promo code if exists
        if (appliedPromo) {
            if (appliedPromo === 'free') {
                shipping = 0;
            } else {
                discount = subtotal * appliedPromo;
            }
        }

        const tax = (subtotal - discount) * TAX_RATE;
        const total = subtotal + shipping + tax - discount;

        subtotalElement.textContent = CURRENCY.format(subtotal);
        shippingElement.textContent = shipping === 0 ? 'FREE' : CURRENCY.format(shipping);
        taxElement.textContent = CURRENCY.format(tax);
        totalElement.textContent = CURRENCY.format(total);

        // Update checkout button state
        checkoutBtn.disabled = cart.length === 0;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Quantity buttons
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                const input = cartItem.querySelector('.quantity-input');
                let quantity = parseInt(input.value);

                if (e.target.classList.contains('decrease')) {
                    quantity = Math.max(1, quantity - 1);
                } else if (e.target.classList.contains('increase')) {
                    quantity = Math.min(99, quantity + 1);
                }

                updateItemQuantity(itemId, quantity);
            }
        });

        // Quantity input
        cartItemsContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                const quantity = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
                updateItemQuantity(itemId, quantity);
            }
        });

        // Remove item
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.remove-item')) {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                removeItem(itemId);
            }
        });

        // Promo code
        applyPromoBtn.addEventListener('click', applyPromoCode);
        promoCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoCode();
            }
        });

        // Checkout
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Update item quantity
    function updateItemQuantity(itemId, quantity) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = quantity;
            saveCart();
            updateCartDisplay();
            updateCartSummary();
        }
    }

    // Remove item from cart
    function removeItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        updateCartDisplay();
        updateCartSummary();
        showNotification('Item removed from cart');
    }

    // Apply promo code
    function applyPromoCode() {
        const code = promoCodeInput.value.trim().toUpperCase();
        if (PROMO_CODES[code]) {
            appliedPromo = PROMO_CODES[code];
            updateCartSummary();
            showNotification('Promo code applied successfully!');
            promoCodeInput.value = '';
        } else {
            showNotification('Invalid promo code', 'error');
        }
    }

    // Handle checkout
    function handleCheckout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }

        // Here you would typically redirect to a checkout page
        // For now, we'll just show a notification
        showNotification('Proceeding to checkout...');
        // window.location.href = 'checkout.html';
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Add styles for notification
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: var(--border-radius);
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            }
            .notification.success {
                background-color: var(--success-color);
            }
            .notification.error {
                background-color: var(--danger-color);
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize the cart
    initCart();
}); 