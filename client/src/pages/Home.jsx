import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext'; 

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [tripPlans, setTripPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { user } = useAuth();

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'travel-tips', name: 'Travel Tips' },
    { id: 'survival', name: 'Survival' },
    { id: 'trip-plans', name: 'Trip Plans' },
    { id: 'culture', name: 'Culture' },
  ];

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true);
    setTimeout(() => {
      setPosts([
        { id: 1, title: 'Best Places to Visit in 2025', description: 'Explore new travel destinations for 2025.', category: 'travel-tips' },
        { id: 2, title: 'How to Survive a Long Flight', description: 'Tips for long-haul flights.', category: 'survival' },
      ]);
      setTripPlans([
        { id: 1, title: '3-Day Trip to Paris', description: 'A detailed trip plan for 3 days in Paris.' },
        { id: 2, title: 'Backpacking Through South America', description: 'A comprehensive guide to backpacking in South America.' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getFilteredContent = () => {
    if (activeCategory === 'all') {
      return [...posts, ...tripPlans].sort(
        (a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
      );
    }

    if (activeCategory === 'trip-plans') {
      return tripPlans;
    }

    return posts.filter((post) => post.category === activeCategory);
  };

  const filteredContent = getFilteredContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-teal-600 mr-2" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span className="text-xl font-bold text-teal-600">TravelShare</span>
          </div>
          
          <div className="flex-1 mx-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users, posts, or trip plans..."
                className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <a href="#" className="text-gray-700 font-medium hover:text-teal-600">Home</a>
            <a href="#" className="text-gray-700 font-medium hover:text-teal-600">Trip Plans</a>
            <a href="#" className="text-gray-700 font-medium hover:text-teal-600">Quizzes</a>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md">
              Login
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="my-8">
          <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-teal-700 bg-opacity-70 z-10"></div>
            <img
              src="/api/placeholder/1280/400"
              alt="World travel"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-12">
              <h1 className="text-white text-4xl font-bold mb-3">
                Discover, Share, and Explore
              </h1>
              <p className="text-white text-xl">
                Connect with fellow travelers, share your adventures, and discover new destinations
              </p>
            </div>
          </div>
        </section>

        {/* Feed Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Feed</h2>
          
          {/* Category Filter */}
          <div className="flex gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`py-2 px-6 rounded-full font-medium ${
                  activeCategory === category.id 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Feed Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => (
                <div key={item.id} className="bg-white shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700">No content found</h3>
              <p className="text-gray-500 mt-2">Try a different category or create your own post!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;