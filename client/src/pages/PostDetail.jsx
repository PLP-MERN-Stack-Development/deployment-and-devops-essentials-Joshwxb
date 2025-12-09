import React, { useState, useEffect, useContext } from 'react'; // <-- ADDED useState and useEffect
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi.js'; 
import { deletePost, fetchComments } from '../apiService.js'; // <-- ADDED fetchComments
import { AuthContext } from '../context/AuthContext.jsx';
import CommentForm from '../components/CommentForm.jsx'; // <-- NEW: Import Comment Form

// --- Simple component for displaying a single comment ---
const CommentItem = ({ comment }) => (
    <div style={commentItemStyle}>
        <p style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#007bff', marginBottom: '3px' }}>
            {comment.user.username} says:
        </p>
        <p style={{ margin: '5px 0' }}>{comment.content}</p>
        <span style={{ fontSize: '0.75em', color: '#777' }}>
            {new Date(comment.createdAt).toLocaleDateString()}
        </span>
    </div>
);


const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    
    // 🎯 FIX: Define the Base URL for fallback/older posts.
    // Use the base URL for local testing. This is only prepended if post.imageUrl is NOT a full URL.
    const BACKEND_BASE_URL = 'http://localhost:5000'; 
    
    // Original Post fetching hook
    const { data: post, isLoading: isPostLoading, error: postError } = useApi(`/api/posts/${id}`);
    
    // NEW: State for comments
    const [comments, setComments] = useState([]);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState(null);

    // NEW: Effect to fetch comments when the post ID changes
    useEffect(() => {
        const loadComments = async () => {
            setIsCommentsLoading(true);
            setCommentsError(null);
            try {
                const commentsData = await fetchComments(id);
                setComments(commentsData);
            } catch (err) {
                setCommentsError(err.message);
            } finally {
                setIsCommentsLoading(false);
            }
        };

        if (post) { // Only fetch comments once the post data is available (optional optimization)
            loadComments();
        } else if (!isPostLoading && !postError) {
             // Fetch comments even if post is not loaded immediately, 
             // in case useApi is async but not blocking. We primarily rely on the dependency array.
             loadComments(); 
        }

    }, [id, post, isPostLoading, postError]); // Dependencies: Refetch if ID, post data, or loading state changes

    // NEW: Function to update comments list after a new comment is posted
    const handleCommentAdded = (newComment) => {
        // Add the new comment to the list.
        setComments((prevComments) => [...prevComments, newComment]);
    };
    
    // ... (rest of handleDelete function remains the same)
    const handleDelete = async () => {
      if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
          return;
      }

      try {
          await deletePost(id); 
          console.log(`Post ${id} deleted successfully.`);
          
          navigate('/', { state: { message: 'Post deleted successfully!' } });
      } catch (err) {
          const message = err.response?.status === 403 
              ? 'Error: You are not authorized to delete this post.' 
              : `Failed to delete post: ${err.message}`;
          alert(message);
          console.error("Delete error:", err);
      }
  };
  
  // Update loading/error checks to include new state variables
  if (isPostLoading) {
    return <div className="message-center"><h2>Loading post details...</h2></div>;
  }

  if (postError) {
    const displayMessage = postError.includes('not found') ? 'Post not found.' : `Error: ${postError}`;
    return <div className="message-center"><h2 className="error-message">{displayMessage}</h2></div>;
  }

  if (!post) {
      return <div className="message-center"><h2>Post data is missing.</h2></div>;
  }
  
  // FINAL, ROBUST OWNERSHIP CHECK FIX (Remains the same)
  const postOwnerId = post.user?._id || post.user; 
  const isOwner = user && postOwnerId && postOwnerId.toString() === user._id?.toString();

  // Render the post details
  return (
    // REFACTORED: Using inline style for max-width only, replacing containerStyle
    <div style={postDetailContainerStyle}> 
      <h1 style={titleStyle}>{post.title}</h1>
      <div style={metaStyle}>
        <span style={categoryBadgeStyle}>
          Category: {post.category ? post.category.name : 'Uncategorized'}
        </span>
        <span style={dateStyle}>
          Published: {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {/* 🌟 FIX: Image Display Logic */}
      {post.imageUrl && (
          <div style={imageWrapperStyle}>
              <img 
                  // FIX IMPLEMENTED HERE: Check if the URL is a full web URL (Cloudinary)
                  src={
                      post.imageUrl.startsWith('http') 
                      ? post.imageUrl 
                      : `${BACKEND_BASE_URL}${post.imageUrl}`
                  } 
                  alt={post.title} 
                  style={imageStyle}
              />
          </div>
      )}
      {/* 🌟 END FIX: Image Display Logic */}
      
      <div style={contentStyle}>
        <p>{post.content}</p>
      </div>

      {/* Conditionally render Edit/Delete buttons */}
      {isOwner && (
        <div style={actionsStyle}>
          <Link to={`/edit/${post._id}`} style={editLinkStyle}>Edit Post</Link>
          <button onClick={handleDelete} style={deleteButtonStyle}>
              Delete Post
          </button>
        </div>
      )}

      {/* RENDERED IF NOT OWNER OR NOT LOGGED IN */}
      {!isOwner && (
        <div style={{...actionsStyle, textAlign: 'left', fontStyle: 'italic', color: '#999'}}>
            {user ? 'You can only edit/delete your own posts.' : 'Log in to manage posts.'}
        </div>
      )}
      
      {/* -------------------------------------------------- */}
      {/* --- NEW: Comments Section --- */}
      {/* -------------------------------------------------- */}
      <hr style={{ margin: '40px 0', borderColor: '#eee' }} />
      
      <div style={commentsSectionStyle}>
          <h2>Comments ({comments.length})</h2>
          
          {/* Comment List */}
          {isCommentsLoading ? (
              <p>Loading comments...</p>
          ) : commentsError ? (
              <p className="error-message">Error fetching comments: {commentsError}</p>
          ) : comments.length > 0 ? (
              <div style={{ marginTop: '20px' }}>
                  {comments.map((comment) => (
                      // We assume the comments are already sorted by the server (oldest first)
                      <CommentItem key={comment._id} comment={comment} />
                  ))}
              </div>
          ) : (
              <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#666' }}>
                  No comments yet. Be the first!
              </p>
          )}

          {/* Comment Form */}
          <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
      </div>
      {/* -------------------------------------------------- */}

      <Link to="/" style={{display: 'block', marginTop: '30px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold'}}>
        &larr; Back to All Posts
      </Link>
    </div>
  );
};


// --- NOTE: Styles Section (Modified to remove redundant container and add comment styles) ---
const postDetailContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};
const titleStyle = {
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
    marginBottom: '15px',
};
const metaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9em',
    color: '#666',
    marginBottom: '25px',
};
const categoryBadgeStyle = {
    backgroundColor: '#e9ecef',
    padding: '4px 8px',
    borderRadius: '4px',
};
const dateStyle = {
    fontStyle: 'italic',
};
const contentStyle = {
    fontSize: '1.1em',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    border: '1px solid #eee',
    padding: '20px',
    borderRadius: '6px',
    backgroundColor: '#f9f9f9',
};
const actionsStyle = {
    marginTop: '30px',
    textAlign: 'right',
};
const editLinkStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginRight: '10px',
    transition: 'background-color 0.3s',
};
const deleteButtonStyle = { 
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
};

// 🌟 NEW IMAGE STYLES
const imageWrapperStyle = {
    margin: '0 0 30px 0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
};

const imageStyle = {
    width: '100%', 
    maxHeight: '400px', // Restrict height to prevent overly long images
    objectFit: 'cover', // Ensures the image covers the area nicely
    display: 'block',
};
// 🌟 END NEW IMAGE STYLES


// NEW COMMENT STYLES
const commentsSectionStyle = {
    marginTop: '40px',
    borderTop: '2px dashed #ccc',
    paddingTop: '30px',
};

const commentItemStyle = { 
    padding: '12px', 
    border: '1px solid #ddd', 
    borderRadius: '6px', 
    marginBottom: '15px', 
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

export default PostDetail;