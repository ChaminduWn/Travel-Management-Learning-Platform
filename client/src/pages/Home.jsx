import React, { useState, useEffect } from 'react';
// import PostCard from '../components/posts/PostCard';
// import TripPlanCard from '../components/tripPlans/TripPlanCard';
// import CreatePostButton from '../components/posts/CreatePostButton';
import { useAuth } from '../context/authContext';
// import { fetchPosts, fetchTripPlans } from '../services/api';
// import { SkeletonPostCard } from '../components/ui/SkeletonLoaders';
// import CategoryFilter from '../components/ui/CategoryFilter';

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
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const [postsData, tripPlansData] = await Promise.all([
          fetchPosts(),
          fetchTripPlans(),
        ]);
        setPosts(postsData);
        setTripPlans(tripPlansData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const getFilteredContent = () => {
    if (activeCategory === 'all') {
      return [...posts, ...tripPlans].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    if (activeCategory === 'trip-plans') {
      return tripPlans;
    }

    return posts.filter((post) => post.category === activeCategory);
  };

  const filteredContent = getFilteredContent();

  return (
    <div className="px-4 md:px-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Mountains landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-primary-800/50 flex flex-col justify-center px-6 md:px-12">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-3">
              Discover, Share, Explore
            </h1>
            <p className="text-white text-lg md:text-2xl opacity-90">
              Connect with travelers, share adventures, and discover new destinations
            </p>
          </div>
        </div>
      </section>

      {/* Feed Header */}
      <section className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Explore Feed</h2>
        {user && <CreatePostButton />}
      </section>

      {/* Category Filter */}
      <section className="mb-8">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </section>

      {/* Feed Content */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <SkeletonPostCard key={index} />
            ))}
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map((item) =>
              item.title ? (
                <TripPlanCard key={item.id} tripPlan={item} />
              ) : (
                <PostCard key={item.id} post={item} />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-700">No content found</h3>
            <p className="text-gray-500 mt-3">Try a different category or create your own post!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
