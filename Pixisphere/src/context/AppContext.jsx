import React, { createContext, useContext, useReducer } from 'react';
import { mockPhotographers } from '../data/mockData';

const AppContext = createContext();

const initialState = {
  photographers: mockPhotographers,
  filteredPhotographers: mockPhotographers,
  selectedPhotographer: null,
  currentView: 'listing', // 'listing' or 'profile'
  filters: {
    search: '',
    priceRange: [0, 20000],
    rating: 0,
    styles: [],
    city: 'All Cities',
    sortBy: 'rating' // 'price-low', 'price-high', 'rating', 'recent'
  },
  showInquiryModal: false,
  currentPage: 1,
  itemsPerPage: 6
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
        currentPage: 1
      };
    
    case 'SET_PRICE_RANGE':
      return {
        ...state,
        filters: { ...state.filters, priceRange: action.payload },
        currentPage: 1
      };
    
    case 'SET_RATING':
      return {
        ...state,
        filters: { ...state.filters, rating: action.payload },
        currentPage: 1
      };
    
    case 'SET_STYLES':
      return {
        ...state,
        filters: { ...state.filters, styles: action.payload },
        currentPage: 1
      };
    
    case 'SET_CITY':
      return {
        ...state,
        filters: { ...state.filters, city: action.payload },
        currentPage: 1
      };
    
    case 'SET_SORT_BY':
      return {
        ...state,
        filters: { ...state.filters, sortBy: action.payload },
        currentPage: 1
      };
    
    case 'SET_FILTERED_PHOTOGRAPHERS':
      return {
        ...state,
        filteredPhotographers: action.payload
      };
    
    case 'SET_SELECTED_PHOTOGRAPHER':
      return {
        ...state,
        selectedPhotographer: action.payload
      };
    
    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        currentView: action.payload
      };
    
    case 'TOGGLE_INQUIRY_MODAL':
      return {
        ...state,
        showInquiryModal: !state.showInquiryModal
      };
    
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };
    
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          ...initialState.filters,
          search: state.filters.search // Keep search term
        },
        currentPage: 1
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};