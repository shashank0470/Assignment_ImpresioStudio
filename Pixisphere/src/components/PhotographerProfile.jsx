


import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Send,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import {
  formatPrice,
  formatDate,
  generateStarRating,
} from '../utils/helpers';
import InquiryModal from './InquiryModal';

const PhotographerProfile = () => {
  const { state, dispatch } = useAppContext();
  const { selectedPhotographer } = state;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  if (!selectedPhotographer) return null;

  const { fullStars, hasHalfStar, emptyStars } =
    generateStarRating(selectedPhotographer.rating);

  const handleBackToListing = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'listing' });
    dispatch({ type: 'SET_SELECTED_PHOTOGRAPHER', payload: null });
  };

  const handleSendInquiry = () => {
    dispatch({ type: 'TOGGLE_INQUIRY_MODAL' });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedPhotographer.portfolio.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0
        ? selectedPhotographer.portfolio.length - 1
        : prev - 1
    );
  };

  const StarRating = ({ rating, showNumber = true }) => (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-gray-300" />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white text-gray-900">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={handleBackToListing}
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm md:text-base"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Photographers</span>
            </button>

            <button
              onClick={handleSendInquiry}
              className="btn-primary flex items-center text-sm md:text-base"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Inquiry
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/30 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-6 sticky top-24">
              {/* Photographer Image */}
              <div className="text-center mb-6">
                <img
                  src={selectedPhotographer.profilePic}
                  alt={selectedPhotographer.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100"
                />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedPhotographer.name}
                </h1>
                <div className="flex items-center justify-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedPhotographer.location}</span>
                </div>
                <StarRating rating={selectedPhotographer.rating} />
              </div>

              {/* Price */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Starting from</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {formatPrice(selectedPhotographer.price)}
                  </div>
                </div>
              </div>

              {/* Styles */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Photography Styles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPhotographer.styles.map((style) => (
                    <span
                      key={style}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPhotographer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-800">
                    {selectedPhotographer.portfolio.length}
                  </div>
                  <div className="text-sm text-gray-600">Photos</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-800">
                    {selectedPhotographer.reviews.length}
                  </div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Portfolio & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-white/30 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {selectedPhotographer.bio}
              </p>
            </div>

            {/* Portfolio Gallery */}
            <div className="bg-white/30 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Portfolio</h2>

              <div className="relative mb-4">
                <div className="aspect-w-16 aspect-h-10 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={selectedPhotographer.portfolio[currentImageIndex]}
                    alt={`Portfolio ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  />
                </div>

                {selectedPhotographer.portfolio.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedPhotographer.portfolio.length}
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {selectedPhotographer.portfolio.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary-500 scale-105'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white/30 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Reviews</h2>

              <div className="space-y-6">
                {selectedPhotographer.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{review.name}</h4>
                        <StarRating rating={review.rating} showNumber={false} />
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedPhotographer.portfolio[currentImageIndex]}
              alt={`Portfolio ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {state.showInquiryModal && <InquiryModal />}
    </div>
  );
};

export default PhotographerProfile;
