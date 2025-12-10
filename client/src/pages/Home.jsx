import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useApi from '../hooks/useApi.js';
// 🌟 NEW: Import social media icons from react-icons
import { FaXTwitter, FaInstagram, FaTiktok } from 'react-icons/fa6'; 

const Home = () => {
  // 🛑 FIX: Define the API_BASE_URL for image loading in a deployed environment
  // This ensures images load from the correct Render URL when deployed on Vercel.
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={containerStyle}>
        {/* Show Success Message if present in navigation state */}
        {message && <p style={successMessageStyle}>{message}</p>}

        <h1 style={titleStyle}>Latest Blog Posts</h1>

        {posts && posts.length > 0 ? (
          <div style={postListStyle}>
            {posts.map(post => (
              <div key={post._id} style={cardStyle}>
                  
                  {/* 🌟 NEW: Image Thumbnail Display Logic */}
                  {post.imageUrl && (
                      // Wrap the image in a link to the post detail page
                      <Link to={`/posts/${post._id}`} style={{textDecoration: 'none'}}>
                          <img 
                              // 🎯 CRITICAL FIX APPLIED: Check if it's already a full URL
                              src={
                                    post.imageUrl.startsWith('http') 
                                        ? post.imageUrl 
                                        : `${API_BASE_URL}${post.imageUrl}`
                                } 
                              alt={post.title} 
                              style={thumbnailStyle}
                          />
                      </Link>
                  )}
                  {/* 🌟 END NEW: Image Thumbnail Display Logic */}
                  
              <h2 style={{...cardTitleStyle, padding: '0 25px'}}> 
                <Link to={`/posts/${post._id}`} style={linkStyle}>
                  {post.title}
                </Link>
              </h2>
              <p style={{...cardMetaStyle, padding: '0 25px'}}>
                Category: <span style={cardCategoryStyle}>{post.category.name}</span> | 
                Published: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p style={{padding: '0 25px'}}>{post.content.substring(0, 150)}...</p>
              <Link to={`/posts/${post._id}`} style={{...readMoreLinkStyle, padding: '0 25px 25px'}}>Read More &rarr;</Link>
            </div>
            ))}
          </div>
        ) : (
          <div className="message-center">
              <p>No posts found. Be the first to <Link to="/create">create a post</Link>!</p>
          </div>
        )}
      </div>
      
      {/* 🌟 UPDATED: Footer Element with Icons */}
      <footer style={footerStyle}>
          <p>&copy; {new Date().getFullYear()} All right reserved.</p>
          <div style={footerLinksStyle}>
              {/* Note: I'm keeping the original Link targets but using Icons */}
              <Link to="https://chat.whatsapp.com/IK3Cy47ouwDIh8xwGDYJ5s" style={footerIconStyle} aria-label="X Twitter Link">
                  <FaXTwitter size={24} /> 
              </Link>
              <Link to="https://chat.whatsapp.com/IK3Cy47ouwDIh8xwGDYJ5s" style={footerIconStyle} aria-label="Instagram Link">
                  <FaInstagram size={24} />
              </Link>
              <Link to="https://chat.whatsapp.com/IK3Cy47ouwDIh8xwGDYJ5s" style={footerIconStyle} aria-label="Tiktok Link">
                  <FaTiktok size={24} />
              </Link>
          </div>
      </footer>
      {/* 🌟 END UPDATED: Footer Element */}

    </div>
  );
};

// --- Unique Styles for Post Card Layout ---
const containerStyle = {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '0 20px',
    flexGrow: 1, // Allows content to push the footer down
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
    // ⚠️ CHANGED: Removed padding here, added to children
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
    overflow: 'hidden', // Keep image corners sharp
    padding: 0, // Reset padding
};

// 🌟 NEW STYLES for Thumbnail
const thumbnailStyle = {
    width: '100%', 
    height: '180px', 
    objectFit: 'cover', 
    display: 'block',
    borderBottom: '1px solid #eee',
    marginBottom: '15px',
};
// 🌟 END NEW STYLES

const cardTitleStyle = {
    fontSize: '1.5em',
    marginBottom: '10px',
    marginTop: 0, // Reset margin
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
    color: '#007bff',
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

// 🌟 NEW FOOTER STYLES
const footerStyle = {
    marginTop: '50px',
    padding: '30px 20px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e9ecef',
    textAlign: 'center',
    color: '#6c757d',
    width: '100%',
};

const footerLinksStyle = {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px', // Increased gap for icons
};

// 🌟 NEW Icon Style (replaces footerLinkItemStyle)
const footerIconStyle = {
    color: '#007bff',
    // We don't need textDecoration or fontWeight for icons, but we might add hover effects later
};
// 🌟 END NEW FOOTER STYLES

export default Home;
