import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, User, BookOpen, Filter, X, Camera, Mountain, PawPrint } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SkillPostCard from '../components/posts/SkillPostCard';
import postsApi, { Post } from '../services/api/posts';
import LearningPlanCard, { LearningPlan } from '../components/learning/LearningPlanCard';

// Mock data
const mockUsers = [
  {
    id: 'user1',
    name: 'Sarah Johnson',
    username: 'sarah_j',
    bio: 'Wildlife Photographer | Conservationist | Nature Enthusiast',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 'user2',
    name: 'Mike Chen',
    username: 'mike_c',
    bio: 'Adventure Sports Instructor | Rock Climbing Expert | Mountain Guide',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

const mockPosts: Post[] = [
  {
    id: '1',
    description: 'Captured this amazing shot of a lion in the wild during my safari in Kenya. The golden hour lighting made it perfect!',
    userId: 'user1',
    date: new Date().toISOString(),
    comments: [],
    likes: [],
    media: [{
      id: 'media1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511739001486-6bfe516ce351?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }]
  },
  {
    id: '2',
    description: 'Just completed my first rock climbing course! Here\'s a shot from the summit. The view was absolutely breathtaking.',
    userId: 'user2',
    date: new Date().toISOString(),
    comments: [],
    likes: [],
    media: [{
      id: 'media2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511739001486-6bfe516ce351?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }]
  }
];

const mockLearningPlans: LearningPlan[] = [
  {
    id: '1',
    title: 'Wildlife Photography Mastery',
    description: 'Learn the art of capturing stunning wildlife photographs in their natural habitat.',
    subject: 'Photography',
    topics: [
      {
        id: 'topic1',
        title: 'Understanding Animal Behavior',
        completed: false
      },
      {
        id: 'topic2',
        title: 'Camera Settings for Wildlife',
        completed: false
      }
    ],
    resources: [
      {
        id: 'resource1',
        title: 'Wildlife Photography Basics',
        url: 'https://example.com/wildlife-basics',
        type: 'video'
      }
    ],
    completionPercentage: 0,
    estimatedDays: 30,
    followers: 0,
    createdAt: new Date().toISOString(),
    user: {
      id: 'user1',
      name: 'Sarah Johnson',
      username: 'sarah_j',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  },
  {
    id: '2',
    title: 'Rock Climbing Safety & Techniques',
    description: 'Master the essential skills and safety protocols for rock climbing.',
    subject: 'Adventure Sports',
    topics: [
      {
        id: 'topic3',
        title: 'Basic Climbing Techniques',
        completed: false
      },
      {
        id: 'topic4',
        title: 'Safety Equipment and Protocols',
        completed: false
      }
    ],
    resources: [
      {
        id: 'resource2',
        title: 'Rock Climbing Fundamentals',
        url: 'https://example.com/climbing-fundamentals',
        type: 'video'
      }
    ],
    completionPercentage: 0,
    estimatedDays: 30,
    followers: 0,
    createdAt: new Date().toISOString(),
    user: {
      id: 'user2',
      name: 'Mike Chen',
      username: 'mike_c',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  }
];

type SearchResultType = 'all' | 'users' | 'posts' | 'plans';
type SubjectFilterType = 'all' | 'Photography' | 'Adventure Sports' | 'Wildlife';

const SearchPage = () => {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [resultType, setResultType] = useState<SearchResultType>('all');
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilterType>('all');
  
  const [users, setUsers] = useState<typeof mockUsers>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };
  
  useEffect(() => {
    if (!query) {
      setUsers([]);
      setPosts([]);
      setPlans([]);
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      
      const filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(lowercaseQuery) || 
        user.username.toLowerCase().includes(lowercaseQuery) ||
        (user.bio && user.bio.toLowerCase().includes(lowercaseQuery))
      );
      
      const filteredPosts = mockPosts.filter(post => 
        post.description.toLowerCase().includes(lowercaseQuery) ||
        post.userId.toLowerCase().includes(lowercaseQuery)
      );
      
      const filteredPlans = mockLearningPlans.filter(plan => 
        plan.title.toLowerCase().includes(lowercaseQuery) ||
        plan.description.toLowerCase().includes(lowercaseQuery) ||
        plan.subject.toLowerCase().includes(lowercaseQuery)
      );
      
      setUsers(filteredUsers);
      setPosts(filteredPosts);
      setPlans(filteredPlans);
      setLoading(false);
    }, 700);
  }, [query]);
  
  const filteredUsers = resultType === 'all' || resultType === 'users' ? users : [];
  const filteredPosts = resultType === 'all' || resultType === 'posts' ? posts : [];
  const filteredPlans = resultType === 'all' || resultType === 'plans' 
    ? plans.filter(plan => subjectFilter === 'all' || plan.subject === subjectFilter) 
    : [];
  
  const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0 || filteredPlans.length > 0;
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Explore Adventures</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search adventurers, experiences, or learning plans..."
            className={`w-full py-3 pl-12 pr-12 rounded-xl ${
              theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-md`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setResultType('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              resultType === 'all'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setResultType('users')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center space-x-1 ${
              resultType === 'users'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Adventurers</span>
          </button>
          <button
            onClick={() => setResultType('posts')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center space-x-1 ${
              resultType === 'posts'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Experiences</span>
          </button>
          <button
            onClick={() => setResultType('plans')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center space-x-1 ${
              resultType === 'plans'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Learning Plans</span>
          </button>
        </div>
        
        {(resultType === 'plans' || resultType === 'all') && (
          <div className="flex items-center border-t border-gray-200 dark:border-slate-700 pt-4">
            <span className="text-sm font-medium mr-3 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Category:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSubjectFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  subjectFilter === 'all'
                    ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => setSubjectFilter('Photography')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center space-x-1 ${
                  subjectFilter === 'Photography'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
                }`}
              >
                <Camera className="h-3 w-3" />
                <span>Photography</span>
              </button>
              <button
                onClick={() => setSubjectFilter('Adventure Sports')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center space-x-1 ${
                  subjectFilter === 'Adventure Sports'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800'
                }`}
              >
                <Mountain className="h-3 w-3" />
                <span>Adventure Sports</span>
              </button>
              <button
                onClick={() => setSubjectFilter('Wildlife')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center space-x-1 ${
                  subjectFilter === 'Wildlife'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                }`}
              >
                <PawPrint className="h-3 w-3" />
                <span>Wildlife</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : query && !hasResults ? (
        <div className={`rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-md p-8 text-center`}>
          <p className="text-gray-500 dark:text-gray-400">No adventures found for "{query}"</p>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            Try using different keywords or filters
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredUsers.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Adventurers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-md flex items-center space-x-3 hover:shadow-lg transition`}
                  >
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture}
                        alt={user.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-300 text-xl font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                      {user.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 mt-1">
                          {user.bio}
                        </p>
                      )}
                    </div>
                    <button className="px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {filteredPosts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Experiences
              </h2>
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <SkillPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
          
          {filteredPlans.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Learning Plans
              </h2>
              <div className="space-y-6">
                {filteredPlans.map(plan => (
                  <LearningPlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;