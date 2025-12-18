import React, { useState } from 'react'; 
import { Link, useLocation } from 'react-router-dom'; 
import useApi from '../hooks/useApi.js';
import { FaXTwitter, FaInstagram, FaTiktok } from 'react-icons/fa6'; 
import { motion } from 'framer-motion'; 

const Home = () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const location = useLocation();

  // Fetching data - location.key ensures we fetch fresh data when navigating
  const { data: posts, isLoading, error } = useApi('/api/posts', [location.key]); 
  const { data: categories } = useApi('/api/categories');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return <div className="message-center"><h2>Loading posts...</h2></div>;
  }

  if (error) {
    return <div className="message-center"><h2 className="error-message">Error loading posts: {error}</h2></div>;
  }

  // 🎯 DIRECT FILTERING: No memoization, just pure logic every render.
  // This is the most "immediate" way to handle the data.
  const displayPosts = (posts || []).filter(post => {
    if (selectedCategory === 'All') return true;
    return post.category?.name === selectedCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={containerStyle}>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={titleStyle}
        >
          Latest Blog Posts
        </motion.h1>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <label 
            htmlFor="categorySearch" 
            style={{ marginRight: '10px', fontWeight: 'bold', color: '#007bff' }}
          >
            Filter:
          </label>
          <select 
            id="categorySearch"
            value={selectedCategory}
            // 🎯 This onChange updates the state which forces an immediate re-render of displayPosts
            onChange={(e) => setSelectedCategory(e.target.value)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
              padding: '8px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              backgroundColor: '#fff',
              outline: 'none',
              color: '#007bff', 
              border: isHovered ? '2px solid #0056b3' : '1px solid #007bff',
              transition: 'border 0.2s ease',
              fontWeight: 'bold'
            }}
          >
            <option value="All">All Categories</option>
            {categories && categories.map(cat => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {displayPosts.length > 0 ? (
          <motion.div 
            key={selectedCategory} // 🎯 KEY FIX: This forces the animation to restart and posts to show immediately
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={postListStyle}
          >
            {displayPosts.map(post => (
              <motion.div 
                key={post._id} 
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: '0 12px 20px rgba(0,0,0,0.1)' }}
                style={cardStyle}
              >
                  {post.imageUrl && (
                      <Link to={`/posts/${post._id}`} style={{textDecoration: 'none'}}>
                          <img 
                            src={post.imageUrl.startsWith('http') ? post.imageUrl : `${API_BASE_URL}${post.imageUrl}`} 
                            alt={post.title} 
                            style={thumbnailStyle}
                          />
                      </Link>
                  )}
                  
                <h2 style={{...cardTitleStyle, padding: '0 25px'}}> 
                  <Link to={`/posts/${post._id}`} style={linkStyle}>
                    {post.title}
                  </Link>
                </h2>
                
                <p style={{...cardMetaStyle, padding: '0 25px'}}>
                  Category: <span style={cardCategoryStyle}>{post.category?.name || 'Uncategorized'}</span> | 
                  Published: {new Date(post.createdAt).toLocaleDateString()}
                </p>

                <p style={{padding: '0 25px'}}>{post.content?.substring(0, 150)}...</p>
                <Link to={`/posts/${post._id}`} style={{...readMoreLinkStyle, padding: '0 25px 25px'}}>Read More &rarr;</Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <p>No posts found for <strong>{selectedCategory}</strong>.</p>
              <button 
                onClick={() => setSelectedCategory('All')}
                style={{ color: '#007bff', background: 'none', border: '1px solid #007bff', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}
              >
                Reset to All Categories
              </button>
          </div>
        )}
      </div>
      
      <footer style={footerStyle}>
          <p>&copy; {new Date().getFullYear()} All right reserved.</p>
          <div style={footerLinksStyle}>
              <Link to="#" style={footerIconStyle} aria-label="X Twitter Link"><FaXTwitter size={24} /></Link>
              <Link to="#" style={footerIconStyle} aria-label="Instagram Link"><FaInstagram size={24} /></Link>
              <Link to="#" style={footerIconStyle} aria-label="Tiktok Link"><FaTiktok size={24} /></Link>
          </div>
      </footer>
    </div>
  );
};

// Styles (Restored to your original specs)
const containerStyle = { maxWidth: '900px', margin: '30px auto', padding: '0 20px', flexGrow: 1 };
const titleStyle = { textAlign: 'center', marginBottom: '30px', color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px' };
const postListStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', transition: 'box-shadow 0.3s ease', overflow: 'hidden', padding: 0 };
const thumbnailStyle = { width: '100%', height: '180px', objectFit: 'cover', display: 'block', borderBottom: '1px solid #eee', marginBottom: '15px' };
const cardTitleStyle = { fontSize: '1.5em', marginBottom: '10px', marginTop: 0 };
const linkStyle = { textDecoration: 'none', color: '#333' };
const cardMetaStyle = { fontSize: '0.9em', color: '#666', marginBottom: '15px' };
const cardCategoryStyle = { fontWeight: 'bold', color: '#007bff' };
const readMoreLinkStyle = { display: 'inline-block', marginTop: '15px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' };
const footerStyle = { marginTop: '50px', padding: '30px 20px', backgroundColor: '#f8f9fa', borderTop: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d', width: '100%' };
const footerLinksStyle = { marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '30px' };
const footerIconStyle = { color: '#007bff' };

export default Home;