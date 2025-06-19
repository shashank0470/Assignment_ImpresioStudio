
import React from 'react';
import { Star, MapPin, Camera, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatPrice, generateStarRating } from '../utils/helpers';

const PhotographerCard = ({ photographer }) => {
  const { dispatch } = useAppContext();
  const { fullStars, hasHalfStar, emptyStars } = generateStarRating(photographer.rating);

  const handleViewProfile = () => {
    dispatch({ type: 'SET_SELECTED_PHOTOGRAPHER', payload: photographer });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'profile' });
  };

  const StarRating = () => (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      ))}
      {hasHalfStar && (
        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 opacity-50" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="ml-1 text-sm text-gray-500">({photographer.rating})</span>
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden shadow-md bg-[#fdfaf6] group hover:scale-[1.02] transition-transform duration-300 font-[Open_Sans]">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={photographer.profilePic}
          alt={photographer.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>

        {/* Quick Stats Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Camera className="h-4 w-4 mr-1" />
              <span>{photographer.portfolio.length} Photos</span>
            </div>
            <div className="flex items-center">
              <span>{photographer.reviews.length} Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-[Playfair_Display] text-xl text-gray-800 mb-1">{photographer.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{photographer.location}</span>
          </div>
          <StarRating />
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Starting from</span>
            <span className="font-semibold text-lg text-yellow-700">
              {formatPrice(photographer.price)}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {photographer.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#f3efe9] text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {photographer.tags.length > 3 && (
              <span className="px-3 py-1 bg-[#f3efe9] text-gray-700 text-xs rounded-full">
                +{photographer.tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Styles */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {photographer.styles.map(style => (
              <span
                key={style}
                className="px-3 py-1 border border-yellow-300 bg-yellow-50 text-yellow-800 text-xs rounded-full"
              >
                {style}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewProfile}
          className="w-full py-2.5 bg-yellow-600 text-white rounded-md font-medium hover:bg-yellow-700 transition duration-200"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default PhotographerCard;
