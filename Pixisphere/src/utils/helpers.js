    // Helper function for fuzzy search
    export const fuzzySearch = (text, searchTerm) => {
    if (!searchTerm) return true;
    
    const searchWords = searchTerm.toLowerCase().split(' ');
    const textLower = text.toLowerCase();
    
    return searchWords.every(word => textLower.includes(word));
    };

    // Format price to Indian currency
    export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
    };

    // Format date
    export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    };

    // Generate star rating
    export const generateStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return {
        fullStars,
        hasHalfStar,
        emptyStars
    };
    };