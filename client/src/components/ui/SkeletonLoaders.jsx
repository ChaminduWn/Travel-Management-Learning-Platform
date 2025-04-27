import React from 'react';

export const SkeletonPostCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="ml-3">
            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        <div className="mt-4 h-48 bg-gray-200 rounded-lg"></div>
        
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonProfileHeader = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="h-24 w-24 md:h-32 md:w-32 bg-gray-300 rounded-full mb-4 md:mb-0"></div>
        
        <div className="md:ml-6 flex-grow">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 rounded w-40"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="h-5 bg-gray-300 rounded w-24"></div>
            <div className="h-5 bg-gray-300 rounded w-24"></div>
            <div className="h-5 bg-gray-300 rounded w-24"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full max-w-2xl"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 max-w-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
