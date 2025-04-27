import React, { useState, useEffect } from 'react';
import CreatePostButton from '../components/posts/CreatePostButton';
import { useAuth } from '../context/authContext';
import CategoryFilter from '../components/ui/CategoryFilter';
import bannerImage from '../assets/bannerImage.png'

const Home = () => {
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
    { id: 'culture', name: 'Culture' }
  ];

  return (
    <div>
    <section className="mb-8">
      <div className="relative h-64 overflow-hidden md:h-96 rounded-xl">
  <img 
    src={bannerImage}
    alt="Travel Banner" 
    className="object-cover object-center"
    style={{ width: "1000px", height: "300px" }}
  />


        <div className="absolute inset-0 flex flex-col justify-center px-6 bg-gradient-to-r from-primary-900/60 to-primary-800/40 md:px-12">
          <h1 className="max-w-xl mb-2 text-3xl font-bold text-white md:text-4xl">
            Discover, Share, and Explore
          </h1>
          <p className="max-w-lg text-lg text-white md:text-xl opacity-90">
            Connect with fellow travelers, share your adventures, and discover new destinations
          </p>
        </div>
        
      </div>
    </section>

      {/* Explore Feed Section */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-primary-800">Explore Feed</h2>
          {user && <CreatePostButton />}
        </div>

        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
      </section>
    </div>
  );
};

export default Home;
