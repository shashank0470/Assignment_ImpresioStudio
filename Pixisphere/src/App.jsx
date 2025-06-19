import React, { useEffect, useState } from 'react';
import { useAppContext } from './context/AppContext';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import PhotographerCard from './components/PhotographerCard';
import PhotographerProfile from './components/PhotographerProfile';
import InquiryModal from './components/InquiryModal';
import { Grid, List, Filter, X } from 'lucide-react';

const App = () => {
  const { state, dispatch } = useAppContext();
  const {
    filteredPhotographers,
    currentView,
    showInquiryModal,
    filters,
    currentPage,
    itemsPerPage
  } = state;

  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, showSidebar]);

  // Apply filters whenever filters change
  useEffect(() => {
    let filtered = state.photographers;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(photographer =>
        photographer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        photographer.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        photographer.tags.some(tag => 
          tag.toLowerCase().includes(filters.search.toLowerCase())
        ) ||
        photographer.styles.some(style => 
          style.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    // Price range filter
    filtered = filtered.filter(photographer =>
      photographer.price >= filters.priceRange[0] &&
      photographer.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(photographer =>
        photographer.rating >= filters.rating
      );
    }

    // Styles filter
    if (filters.styles.length > 0) {
      filtered = filtered.filter(photographer =>
        filters.styles.some(style => photographer.styles.includes(style))
      );
    }

    // City filter
    if (filters.city !== 'All Cities') {
      filtered = filtered.filter(photographer =>
        photographer.location.includes(filters.city)
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          return new Date(b.joinedDate) - new Date(a.joinedDate);
        default:
          return b.rating - a.rating;
      }
    });

    dispatch({ type: 'SET_FILTERED_PHOTOGRAPHERS', payload: filtered });
    // Reset to first page when filters change
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
  }, [filters, state.photographers, dispatch]);

  // Pagination
  const totalPages = Math.ceil(filteredPhotographers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPhotographers = filteredPhotographers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-base">
        <PhotographerProfile />
        {showInquiryModal && <InquiryModal />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <div className="flex items-center">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">PixiSphere</h1>
              <span className="hidden sm:inline ml-2 text-xs lg:text-sm text-gray-600">
                Find Your Perfect Photographer
              </span>
            </div>
            
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle filters"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <FilterSidebar 
              isOpen={showSidebar}
              onClose={closeSidebar}
              isMobile={isMobile}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6 mb-4 lg:mb-6">
              <SearchBar />
            </div>

            {/* Results header and controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6 mb-4 lg:mb-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Showing {filteredPhotographers.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredPhotographers.length)} of {filteredPhotographers.length} photographers
                </div>
                
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                  {/* Sort dropdown */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) => dispatch({ type: 'SET_SORT_BY', payload: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="rating">Sort by Rating</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="recent">Recently Joined</option>
                  </select>

                  {/* View mode toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            {currentPhotographers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📸</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No photographers found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Photographer Grid/List */}
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8'
                    : 'space-y-4 lg:space-y-6 mb-6 lg:mb-8'
                }>
                  {currentPhotographers.map(photographer => (
                    <PhotographerCard
                      key={photographer.id}
                      photographer={photographer}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 py-2 sm:px-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      {/* Show fewer page numbers on mobile */}
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const showPage = isMobile 
                          ? (pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 1)
                          : true;
                        
                        if (!showPage && isMobile) {
                          // Show ellipsis
                          if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                            return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                          }
                          return null;
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-2 py-2 sm:px-3 text-sm border rounded-md transition-colors ${
                              currentPage === pageNumber
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-2 sm:px-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && <InquiryModal />}
    </div>
  );
};

export default App; 