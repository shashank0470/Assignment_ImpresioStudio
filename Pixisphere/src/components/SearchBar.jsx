
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';

const SearchBar = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState(state.filters.search);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch({ type: 'SET_SEARCH', payload: debouncedSearchTerm });
  }, [debouncedSearchTerm, dispatch]);

  const handleClear = () => {
    setSearchTerm('');
    dispatch({ type: 'SET_SEARCH', payload: '' });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mb-8 font-sans">
      <div className="relative shadow-md rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500 bg-white">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="      Search by name, location, or tags"
          className="w-full pl-10 pr-10 py-3 text-base text-gray-800 placeholder:text-gray-400 outline-none focus:ring-0"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search feedback dropdown */}
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="px-4 py-3 text-sm text-gray-700">
            Searching for: <span className="text-primary-600 font-semibold">"{searchTerm}"</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
