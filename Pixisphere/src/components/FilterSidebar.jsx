
    import React, { useState } from 'react';
    import { Filter, X, Star, ChevronDown, ChevronUp } from 'lucide-react';
    import { useAppContext } from '../context/AppContext';
    import { cities, styles } from '../data/mockData';
    import { formatPrice } from '../utils/helpers';

    const FilterSidebar = ({ isOpen, onClose, isMobile }) => {
    const { state, dispatch } = useAppContext();
    const { filters } = state;
    const [expandedSections, setExpandedSections] = useState({
        price: true, rating: true, styles: true, city: true, sort: true
    });

    const toggleSection = section =>
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

    const handlePriceChange = e =>
        dispatch({ type: 'SET_PRICE_RANGE', payload: [0, +e.target.value] });
    const handleRatingChange = rating =>
        dispatch({ type: 'SET_RATING', payload: rating });
    const handleStyleToggle = style =>
        dispatch({
        type: 'SET_STYLES',
        payload: filters.styles.includes(style)
            ? filters.styles.filter(s => s !== style)
            : [...filters.styles, style]
        });
    const handleCityChange = city => {
        dispatch({ type: 'SET_CITY', payload: city });
        if (isMobile) onClose();
    };
    const handleSortChange = sortBy => {
        dispatch({ type: 'SET_SORT_BY', payload: sortBy });
        if (isMobile) onClose();
    };
    const clearAllFilters = () => {
        dispatch({ type: 'CLEAR_FILTERS' });
        if (isMobile) onClose();
    };

    const SectionHeader = ({ title, section, children }) => (
        <div className="mb-5">
        <button
            onClick={() => toggleSection(section)}
            className="w-full flex items-center justify-between mb-2"
        >
            <h3 className="font-playfair text-gray-800 text-base">{title}</h3>
            {expandedSections[section] ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
        </button>
        {expandedSections[section] && children}
        </div>
    );

    return (
        <>
        {isMobile && isOpen && (
            <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={onClose}
            />
        )}
        <aside
            className={`${
            isMobile
                ? `fixed top-0 left-0 h-full w-80 bg-[#fdfaf6] shadow-xl transition-transform z-50 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`
                : 'bg-[#fdfaf6] rounded-lg shadow border'
            }`}
        >
            <div className={`${isMobile ? 'p-5 h-full overflow-y-auto' : 'p-6'}`}>
            {/* Header */}
            <div className={`${isMobile ? 'mb-6 pb-4 border-b' : 'mb-6'}`}>
                <h2 className="font-playfair flex items-center text-2xl text-gray-800">
                <Filter className="w-6 h-6 mr-2 text-gray-800" />
                Filters
                </h2>
                {isMobile && (
                <button onClick={onClose} className="absolute top-5 right-5 p-1">
                    <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                </button>
                )}
            </div>

            {/* Clear All */}
            <button
                onClick={clearAllFilters}
                className="w-full mb-6 px-4 py-2 text-sm font-semibold text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition"
            >
                Clear All Filters
            </button>

            {/* Sections */}
            <SectionHeader title="Price Range" section="price">
                <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>₹0</span>
                    <span className="font-semibold">{formatPrice(filters.priceRange[1])}</span>
                    <span>₹20,000+</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="20000"
                    step="1000"
                    value={filters.priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full h-2 rounded-lg bg-gray-300 cursor-pointer slider"
                />
                <div className="text-center text-sm text-gray-600">
                    Up to {formatPrice(filters.priceRange[1])}
                </div>
                </div>
            </SectionHeader>

            <SectionHeader title="Minimum Rating" section="rating">
                <div className="space-y-2">
                {[4, 3, 2, 1, 0].map(rating => (
                    <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`w-full flex items-center p-2 rounded-lg transition-colors text-sm ${
                        filters.rating === rating
                        ? 'bg-yellow-50 border border-yellow-300'
                        : 'hover:bg-gray-100'
                    }`}
                    >
                    <div className="flex items-center">
                        {rating > 0 ? (
                        <>
                            {[...Array(rating)].map((_, i) => (
                            <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-500 text-yellow-500"
                            />
                            ))}
                            <span className="ml-2">{rating}+ Stars</span>
                        </>
                        ) : (
                        <span>All Ratings</span>
                        )}
                    </div>
                    </button>
                ))}
                </div>
            </SectionHeader>

            <SectionHeader title="Photography Styles" section="styles">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                {styles.map(style => (
                    <label
                    key={style}
                    className="flex items-center p-2 rounded hover:bg-gray-100"
                    >
                    <input
                        type="checkbox"
                        checked={filters.styles.includes(style)}
                        onChange={() => handleStyleToggle(style)}
                        className="h-4 w-4 text-yellow-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-800">{style}</span>
                    </label>
                ))}
                </div>
            </SectionHeader>

            <SectionHeader title="Location" section="city">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                {cities.map(city => (
                    <button
                    key={city}
                    onClick={() => handleCityChange(city)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        filters.city === city
                        ? 'bg-yellow-50 text-yellow-800'
                        : 'hover:bg-gray-100'
                    }`}
                    >
                    {city}
                    </button>
                ))}
                </div>
            </SectionHeader>

            {isMobile && (
                <SectionHeader title="Sort By" section="sort">
                <div className="space-y-2">
                    {[
                    { value: 'rating', label: 'Rating: High to Low' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'recent', label: 'Recently Added' }
                    ].map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => handleSortChange(opt.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        filters.sortBy === opt.value
                            ? 'bg-yellow-50 text-yellow-800'
                            : 'hover:bg-gray-100'
                        }`}
                    >
                        {opt.label}
                    </button>
                    ))}
                </div>
                </SectionHeader>
            )}

            {isMobile && (
                <div className="mt-6 pt-4 border-t">
                <button
                    onClick={onClose}
                    className="w-full px-4 py-3 bg-yellow-700 text-white rounded-lg text-medium hover:bg-yellow-800 transition"
                >
                    Apply Filters
                </button>
                </div>
            )}
            </div>
        </aside>
        </>
    );
    };

    export default FilterSidebar;
