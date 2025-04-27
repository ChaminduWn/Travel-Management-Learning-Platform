import React, { useState, useEffect } from 'react';
import { Send, User } from 'lucide-react';
// import { fetchComments, createComment } from '../../services/api.ts';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { useAuth } from "../../context/authContext";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const commentsData = await fetchComments(postId);
        setComments(commentsData);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const newComment = await createComment(postId, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 rounded-b-xl">
      {user ? (
        <form onSubmit={handleSubmitComment} className="flex items-center mb-4">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="ml-2 flex-grow px-3 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className={`ml-2 p-2 rounded-full ${
              !commentText.trim() || isSubmitting 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-primary-500 text-white hover:bg-primary-600'
            } transition-colors`}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
          Please <a href="/login" className="text-primary-600 font-medium">log in</a> to post a comment.
        </div>
      )}

      <h4 className="font-medium text-sm text-gray-700 mb-3">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h4>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="ml-2 flex-grow">
                <div className="h-2.5 bg-gray-200 rounded-full w-24 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-full w-full max-w-md"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {comment.author.profilePicture ? (
                  <img 
                    src={comment.author.profilePicture} 
                    alt={comment.author.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
                    {comment.author.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="ml-2 flex-grow">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {comment.author.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{comment.content}</p>
                </div>
                <div className="mt-1 px-2 flex text-xs">
                  <button className="text-gray-500 hover:text-gray-700 mr-3">
                    Reply
                  </button>
                  {user && user.id === comment.author.id && (
                    <>
                      <button className="text-gray-500 hover:text-gray-700 mr-3">
                        Edit
                      </button>
                      <button className="text-gray-500 hover:text-red-600">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
