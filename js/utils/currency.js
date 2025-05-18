// Currency formatting utilities
const CURRENCY = {
    code: 'KES',
    symbol: 'KSh',
    locale: 'en-KE',
    exchangeRate: 1, // Base rate (1 USD = 150 KES approximately)
    format: (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },
    // Convert USD to KES (if needed)
    convertFromUSD: (usdAmount) => {
        return usdAmount * 150; // Approximate exchange rate
    }
};

// Make currency utilities globally available
window.CURRENCY = CURRENCY; 