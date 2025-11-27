import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useApi from '../hooks/useApi.js';

const Home = () => {
  // Use useLocation to check for navigation state messages (e.g., after deletion)
  const location = useLocation();
  const message = location.state?.message;

  // Key is set to Date.now() to force a re-fetch of the post list 
  // whenever a deletion/creation event happens (via navigate state).
  const { data: posts, isLoading, error } = useApi('/api/posts', [location.key]); 
  
  if (isLoading) {
    // REFACTORED: Use className="message-center"
    return <div className="message-center"><h2>Loading posts...</h2></div>;
  }

  if (error) {
    // REFACTORED: Use className="message-center" and className="error-message"
    return <div className="message-center"><h2 className="error-message">Error loading posts: {error}</h2></div>;
  }

  return (
    <div style={containerStyle}>
      {/* Show Success Message if present in navigation state */}
      {message && <p style={successMessageStyle}>{message}</p>}

      <h1 style={titleStyle}>Latest Blog Posts</h1>

      {posts && posts.length > 0 ? (
        <div style={postListStyle}>
          {posts.map(post => (
            <div key={post._id} style={cardStyle}>
              <h2 style={cardTitleStyle}>
                <Link to={`/posts/${post._id}`} style={linkStyle}>
                  {post.title}
                </Link>
              </h2>
              <p style={cardMetaStyle}>
                Category: <span style={cardCategoryStyle}>{post.category.name}</span> | 
                Published: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p>{post.content.substring(0, 150)}...</p>
              <Link to={`/posts/${post._id}`} style={readMoreLinkStyle}>Read More &rarr;</Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="message-center">
            <p>No posts found. Be the first to <Link to="/create">create a post</Link>!</p>
        </div>
      )}
    </div>
  );
};

// --- Unique Styles for Post Card Layout ---
const containerStyle = {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '0 20px',
};
const titleStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#007bff',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
};
const postListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
};
const cardStyle = {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
};
const cardTitleStyle = {
    fontSize: '1.5em',
    marginBottom: '10px',
};
const linkStyle = {
    textDecoration: 'none',
    color: '#333',
};
const cardMetaStyle = {
    fontSize: '0.9em',
    color: '#666',
    marginBottom: '15px',
};
const cardCategoryStyle = {
    fontWeight: 'bold',
    color: '#007bff',
};
const readMoreLinkStyle = {
    display: 'inline-block',
    marginTop: '15px',
    color: '#28a745',
    textDecoration: 'none',
    fontWeight: 'bold',
};
const successMessageStyle = {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    marginBottom: '20px',
    border: '1px solid #c3e6cb',
};

export default Home;