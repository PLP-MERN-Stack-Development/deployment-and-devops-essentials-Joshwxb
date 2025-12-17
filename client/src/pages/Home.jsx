import React, { useState, useEffect } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import useApi from '../hooks/useApi.js';
import { FaXTwitter, FaInstagram, FaTiktok } from 'react-icons/fa6'; 
import { motion, AnimatePresence } from 'framer-motion'; 

const Home = () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const location = useLocation();
  const navigate = useNavigate();

  const [showMsg, setShowMsg] = useState(!!location.state?.message);
  const message = location.state?.message;

  const { data: posts, isLoading, error } = useApi('/api/posts', [location.key]); 

  // 🎯 UPDATED: Timer set to 0 to trigger immediate disappearance logic
  useEffect(() => {
    if (message) {
      setShowMsg(true);
      const timer = setTimeout(() => {
        setShowMsg(false);
        // Clean navigation state immediately
        navigate(location.pathname, { replace: true, state: {} });
      }, 0); // ⚡ 0 second delay

      return () => clearTimeout(timer);
    }
  }, [message, navigate, location.pathname]);
  
  if (isLoading) {
    return <div className="message-center"><h2>Loading posts...</h2></div>;
  }

  if (error) {
    return <div className="message-center"><h2 className="error-message">Error loading posts: {error}</h2></div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={containerStyle}>
        
        <AnimatePresence>
          {showMsg && message && (
            <motion.p 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
              style={successMessageStyle}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={titleStyle}
        >
          Latest Blog Posts
        </motion.h1>

        {posts && posts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={postListStyle}
          >
            {posts.map(post => (
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
                  Category: <span style={cardCategoryStyle}>{post.category.name}</span> | 
                  Published: {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p style={{padding: '0 25px'}}>{post.content.substring(0, 150)}...</p>
                <Link to={`/posts/${post._id}`} style={{...readMoreLinkStyle, padding: '0 25px 25px'}}>Read More &rarr;</Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="message-center">
              <p>No posts found. Be the first to <Link to="/create">create a post</Link>!</p>
          </div>
        )}
      </div>
      
      <footer style={footerStyle}>
          <p>&copy; {new Date().getFullYear()} All right reserved.</p>
          <div style={footerLinksStyle}>
              <Link to="https://chat.whatsapp.com/IK3Cy47ouwDIh8xwGDYJ5s" style={footerIconStyle} aria-label="X Twitter Link"><FaXTwitter size={24} /></Link>
              <Link to="https://chat.whatsapp.com/IK3Cy47ouwDIh8xwGDYJ5s" style={footerIconStyle} aria-label="Instagram Link"><FaInstagram size={24} /></Link>
              <Link to="https://chat.whatsapp.com/IK3Cy47ouwDIh8xwGDYJ5s" style={footerIconStyle} aria-label="Tiktok Link"><FaTiktok size={24} /></Link>
          </div>
      </footer>
    </div>
  );
};

// Styles
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
const successMessageStyle = { backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', textAlign: 'center', marginBottom: '20px', border: '1px solid #c3e6cb' };
const footerStyle = { marginTop: '50px', padding: '30px 20px', backgroundColor: '#f8f9fa', borderTop: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d', width: '100%' };
const footerLinksStyle = { marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '30px' };
const footerIconStyle = { color: '#007bff' };

export default Home;