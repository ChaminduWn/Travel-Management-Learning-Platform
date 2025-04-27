import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { likePost } from '../../services/api.ts';
import CommentSection from './CommentSection';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      await likePost(post.id, !liked);
      setLiked(!liked);
      setLikesCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="card animate-fade-in">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Link to={`/profile/${post.author.id}`} className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
              {post.author.profilePicture ? (
                <img 
                  src={post.author.profilePicture} 
                  alt={post.author.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
                  {post.author.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">{post.author.name}</h3>
              <p className="text-xs text-gray-500">{formatDistanceToNow(post.createdAt)}</p>
            </div>
          </Link>
          <div className="ml-auto">
            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-800 mb-4">{post.content}</p>
          
          {post.category && (
            <Link 
              to={`/search?category=${post.category}`}
              className="inline-block text-xs font-medium bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full mb-4"
            >
              {post.category}
            </Link>
          )}
          
          {post.media && post.media.length > 0 && (
            <div className={`grid gap-1 mb-4 ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {post.media.map((media, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg overflow-hidden h-48 ${post.media.length === 3 && index === 0 ? 'col-span-2' : ''}`}
                >
                  {media.type === 'image' ? (
                    <img 
                      src={media.url} 
                      alt={`Post media ${index}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <video 
                      src={media.url} 
                      controls 
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${liked ? 'text-red-500 hover:bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </button>
            
            <button 
              onClick={toggleComments}
              className="flex items-center space-x-1 px-2 py-1 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post.commentsCount}</span>
            </button>
            
            <button className="flex items-center space-x-1 px-2 py-1 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
      
      {showComments && (
        <CommentSection postId={post.id} />
      )}
    </div>
  );
};

export default PostCard;
