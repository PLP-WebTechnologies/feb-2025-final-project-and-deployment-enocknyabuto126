// Categories Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const categoriesGrid = document.getElementById('categories-grid');
    const categoriesEmpty = document.getElementById('categories-empty');
    const categorySearch = document.getElementById('category-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Category Data
    const categories = [
        {
            id: 'clothing',
            name: 'Clothing',
            description: 'Discover our latest collection of trendy and comfortable clothing.',
            image: 'images/categories/placeholder.jpg',
            productCount: 156,
            tags: ['featured'],
            badge: null
        },
        {
            id: 'accessories',
            name: 'Accessories',
            description: 'Complete your look with our stylish accessories and jewelry.',
            image: 'images/categories/placeholder.jpg',
            productCount: 89,
            tags: ['featured', 'new'],
            badge: 'new'
        },
        {
            id: 'footwear',
            name: 'Footwear',
            description: 'Step into style with our collection of shoes and boots.',
            image: 'images/categories/placeholder.jpg',
            productCount: 72,
            tags: ['featured'],
            badge: null
        },
        {
            id: 'bags',
            name: 'Bags & Backpacks',
            description: 'Carry your essentials in style with our designer bags.',
            image: 'images/categories/placeholder.jpg',
            productCount: 45,
            tags: ['sale'],
            badge: 'sale'
        },
        {
            id: 'jewelry',
            name: 'Jewelry',
            description: 'Add sparkle to your style with our elegant jewelry collection.',
            image: 'images/categories/placeholder.jpg',
            productCount: 63,
            tags: ['featured'],
            badge: null
        },
        {
            id: 'watches',
            name: 'Watches',
            description: 'Keep time in style with our premium watch collection.',
            image: 'images/categories/placeholder.jpg',
            productCount: 38,
            tags: ['new'],
            badge: 'new'
        },
        {
            id: 'sportswear',
            name: 'Sportswear',
            description: 'Stay active and comfortable with our sportswear collection.',
            image: 'images/categories/placeholder.jpg',
            productCount: 94,
            tags: ['featured'],
            badge: null
        },
        {
            id: 'home',
            name: 'Home & Living',
            description: 'Transform your space with our home decor collection.',
            image: 'images/categories/placeholder.jpg',
            productCount: 127,
            tags: ['sale'],
            badge: 'sale'
        }
    ];

    // State
    let currentFilter = 'all';
    let searchQuery = '';
    let isInitialized = false;

    // Initialize categories
    function initCategories() {
        // Set initial visibility
        categoriesGrid.style.display = 'none';
        categoriesEmpty.style.display = 'none';
        
        // Display categories
        displayCategories();
        setupEventListeners();
        
        // Mark as initialized
        isInitialized = true;
    }

    // Display categories
    function displayCategories() {
        const filteredCategories = filterCategories();
        
        // Use requestAnimationFrame to prevent flickering
        requestAnimationFrame(() => {
            if (filteredCategories.length === 0) {
                if (isInitialized) {
                    categoriesGrid.classList.remove('visible');
                    categoriesEmpty.classList.add('visible');
                } else {
                    categoriesGrid.style.display = 'none';
                    categoriesEmpty.style.display = 'block';
                }
                return;
            }

            if (isInitialized) {
                categoriesGrid.classList.add('visible');
                categoriesEmpty.classList.remove('visible');
            } else {
                categoriesGrid.style.display = 'grid';
                categoriesEmpty.style.display = 'none';
            }

            // Update grid content
            categoriesGrid.innerHTML = filteredCategories.map(category => `
                <a href="products.html?category=${category.id}" class="category-card">
                    ${category.badge ? `<span class="category-badge ${category.badge}">${category.badge.toUpperCase()}</span>` : ''}
                    <img src="${category.image}" alt="${category.name}" class="category-image">
                    <div class="category-content">
                        <h2 class="category-name">${category.name}</h2>
                        <p class="category-description">${category.description}</p>
                        <div class="category-meta">
                            <div class="category-products">
                                <i class="fas fa-box"></i>
                                <span>${category.productCount} Products</span>
                            </div>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </a>
            `).join('');
        });
    }

    // Filter categories
    function filterCategories() {
        return categories.filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                category.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesFilter = currentFilter === 'all' || category.tags.includes(currentFilter);
            
            return matchesSearch && matchesFilter;
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search input
        categorySearch.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            displayCategories();
        });

        // Filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update filter
                currentFilter = button.dataset.filter;
                displayCategories();
            });
        });

        // Handle image loading errors
        categoriesGrid.addEventListener('error', (e) => {
            if (e.target.classList.contains('category-image')) {
                e.target.src = 'images/placeholder.jpg';
            }
        }, true);
    }

    // Initialize the categories
    initCategories();
}); 