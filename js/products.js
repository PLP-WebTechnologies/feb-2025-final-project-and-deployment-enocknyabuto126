// Products page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize state
    let currentPage = 1;
    const productsPerPage = 12;
    let filteredProducts = [...products];
    let currentView = 'grid';

    // DOM Elements
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.getElementById('products-count');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const filterToggle = document.createElement('button');
    const filterOverlay = document.createElement('div');
    const sortSelect = document.getElementById('sort-select');
    const viewButtons = document.querySelectorAll('.view-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');

    // Add mobile filter toggle button
    filterToggle.className = 'filter-toggle';
    filterToggle.innerHTML = '<i class="fas fa-filter"></i> Filters';
    document.querySelector('.products-content').insertBefore(
        filterToggle,
        document.querySelector('.products-header')
    );

    // Add filter overlay
    filterOverlay.className = 'filter-overlay';
    document.body.appendChild(filterOverlay);

    // Event Listeners
    filterToggle.addEventListener('click', toggleFilters);
    filterOverlay.addEventListener('click', toggleFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    sortSelect.addEventListener('change', handleSort);
    viewButtons.forEach(btn => btn.addEventListener('click', handleViewChange));
    prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));

    // Filter event listeners
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilter);
    });

    document.getElementById('price-slider').addEventListener('input', handlePriceFilter);
    document.getElementById('min-price').addEventListener('change', handlePriceFilter);
    document.getElementById('max-price').addEventListener('change', handlePriceFilter);

    // Initialize the page
    updateProducts();
    updatePagination();

    // Functions
    function toggleFilters() {
        const sidebar = document.querySelector('.filters-sidebar');
        sidebar.classList.toggle('active');
        filterOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    function clearFilters() {
        // Reset category checkboxes
        document.querySelectorAll('input[name="category"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset price range
        const priceSlider = document.getElementById('price-slider');
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');
        priceSlider.value = priceSlider.max;
        minPrice.value = '';
        maxPrice.value = '';

        // Reset sort
        sortSelect.value = 'featured';

        // Reset filtered products
        filteredProducts = [...products];
        currentPage = 1;
        updateProducts();
        updatePagination();
    }

    function handleFilter() {
        const selectedCategories = Array.from(
            document.querySelectorAll('input[name="category"]:checked')
        ).map(checkbox => checkbox.value);

        filteredProducts = products.filter(product => {
            const matchesCategory = selectedCategories.length === 0 || 
                                  selectedCategories.includes(product.category);
            const matchesPrice = filterByPrice(product.price);
            return matchesCategory && matchesPrice;
        });

        currentPage = 1;
        updateProducts();
        updatePagination();
    }

    function handlePriceFilter() {
        const priceSlider = document.getElementById('price-slider');
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');

        // Update min/max inputs based on slider
        if (priceSlider.value < maxPrice.value || !maxPrice.value) {
            maxPrice.value = priceSlider.value;
        }
        if (priceSlider.value > minPrice.value || !minPrice.value) {
            minPrice.value = priceSlider.value;
        }

        handleFilter();
    }

    function filterByPrice(price) {
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;

        if (minPrice && price < parseFloat(minPrice)) return false;
        if (maxPrice && price > parseFloat(maxPrice)) return false;
        return true;
    }

    function handleSort() {
        const sortValue = sortSelect.value;
        
        filteredProducts.sort((a, b) => {
            switch (sortValue) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

        currentPage = 1;
        updateProducts();
        updatePagination();
    }

    function handleViewChange(e) {
        const view = e.currentTarget.dataset.view;
        if (view === currentView) return;

        currentView = view;
        viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        productsGrid.className = `products-grid ${view}-view`;
        updateProducts();
    }

    function updateProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        productsGrid.innerHTML = productsToShow.map(product => `
            <article class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">${CURRENCY.format(product.price)}</p>
                    <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                        Add to Cart
                    </button>
                </div>
            </article>
        `).join('');

        productsCount.textContent = filteredProducts.length;
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        // Update prev/next buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        // Generate page numbers
        let pageNumbersHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                pageNumbersHTML += `
                    <button class="page-number ${i === currentPage ? 'active' : ''}"
                            onclick="changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (
                i === currentPage - 2 || 
                i === currentPage + 2
            ) {
                pageNumbersHTML += '<span class="page-dots">...</span>';
            }
        }

        pageNumbers.innerHTML = pageNumbersHTML;
    }

    // Make changePage function globally available
    window.changePage = function(page) {
        if (page < 1 || page > Math.ceil(filteredProducts.length / productsPerPage)) return;
        currentPage = page;
        updateProducts();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}); 