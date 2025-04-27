import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MapPin, Calendar, ListChecks } from 'lucide-react';
import { TripPlan } from '../../types';
import { formatDistanceToNow, formatDateRange } from '../../utils/dateUtils';
// import { likeTripPlan } from '../../services/api.ts';

const TripPlanCard = ({ tripPlan }) => {
  const [liked, setLiked] = useState(tripPlan.isLiked || false);
  const [likesCount, setLikesCount] = useState(tripPlan.likesCount);

  const handleLike = async () => {
    try {
      await likeTripPlan(tripPlan.id, !liked);
      setLiked(!liked);
      setLikesCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
    } catch (error) {
      console.error('Failed to like trip plan:', error);
    }
  };

  // For truncating long texts
  const truncate = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="card animate-fade-in">
      {/* Cover image */}
      <div className="h-40 overflow-hidden">
        <img 
          src={tripPlan.coverImage || 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
          alt={tripPlan.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        {/* Author info */}
        <div className="flex items-center mb-3">
          <Link to={`/profile/${tripPlan.author.id}`} className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
              {tripPlan.author.profilePicture ? (
                <img 
                  src={tripPlan.author.profilePicture} 
                  alt={tripPlan.author.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
                  {tripPlan.author.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="ml-2">
              <h3 className="text-xs font-medium text-gray-900">{tripPlan.author.name}</h3>
              <p className="text-xs text-gray-500">{formatDistanceToNow(tripPlan.createdAt)}</p>
            </div>
          </Link>
        </div>

        {/* Trip plan content */}
        <h2 className="text-lg font-semibold mb-2 text-gray-900">{tripPlan.title}</h2>
        
        {/* Destinations and dates */}
        <div className="flex items-center mb-2">
          <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600 ml-1 truncate">
            {tripPlan.destinations.join(', ')}
          </p>
        </div>
        
        {tripPlan.startDate && tripPlan.endDate && (
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <p className="text-sm text-gray-600 ml-1">
              {formatDateRange(tripPlan.startDate, tripPlan.endDate)}
            </p>
          </div>
        )}
        
        {/* Itinerary summary */}
        {tripPlan.itinerary && (
          <div className="flex items-start mb-3">
            <ListChecks className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-700 ml-1">
              {truncate(tripPlan.itinerary, 100)}
            </p>
          </div>
        )}
        
        {/* Tips preview */}
        {tripPlan.tips && (
          <div className="bg-amber-50 p-2 rounded-lg mb-3">
            <p className="text-xs text-amber-800">
              <span className="font-medium">Pro Tip:</span> {truncate(tripPlan.tips, 80)}
            </p>
          </div>
        )}
        
        {/* View details link */}
        <Link 
          to={`/trip-plans/${tripPlan.id}`} 
          className="inline-block text-primary-600 hover:text-primary-700 text-sm font-medium mb-3"
        >
          View full plan
        </Link>

        {/* Interaction buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
              liked ? 'text-red-500 hover:bg-red-50' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likesCount}</span>
          </button>
          
          <Link 
            to={`/trip-plans/${tripPlan.id}`}
            className="flex items-center space-x-1 px-2 py-1 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{tripPlan.commentsCount}</span>
          </Link>
          
          <button className="flex items-center space-x-1 px-2 py-1 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
            <Share2 className="h-5 w-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPlanCard;
