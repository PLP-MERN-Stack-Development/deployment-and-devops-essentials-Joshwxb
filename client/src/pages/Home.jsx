import React, { useState } from 'react'; 
import { Link, useLocation } from 'react-router-dom'; 
import useApi from '../hooks/useApi.js';
import { FaXTwitter, FaInstagram, FaTiktok } from 'react-icons/fa6'; 
import { motion, AnimatePresence } from 'framer-motion'; 

const Home = () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const location = useLocation();

  const { data: posts, isLoading, error } = useApi('/api/posts', [location.key]); 
  const { data: categories } = useApi('/api/categories');

  const [selectedCategory, setSelectedCategory] = useState('All');

  const displayPosts = (posts || []).filter(post => {
    if (selectedCategory === 'All') return true;
    return post.category?.name === selectedCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
  };

  if (isLoading) return <div className="message-center"><h2>Loading posts...</h2></div>;
  if (error) return <div className="message-center"><h2>Error: {error}</h2></div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fcfcfc' }}>
      <style>
        {`
          .responsive-grid {
            display: grid;
            gap: 30px;
            grid-template-columns: 1fr;
          }
          @media (min-width: 768px) {
            .responsive-grid { grid-template-columns: 1fr 1fr; }
          }
          .category-select {
            padding: 12px 20px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            color: #4a5568;
            font-weight: 600;
            outline: none;
            cursor: pointer;
            transition: all 0.2s;
            background-color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
          }
          .category-select:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
          }
          .empty-state-container {
            text-align: center;
            padding: 60px 40px;
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #edf2f7;
            box-shadow: 0 10px 25px rgba(0,0,0,0.03);
            margin: 40px auto;
            max-width: 600px;
          }
          .back-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 700;
            font-size: 1rem;
            margin-top: 25px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 14px 0 rgba(0, 123, 255, 0.39);
          }
          .back-btn:hover {
            background: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.23);
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={filterSectionStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Browse by Category
            </label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="All">All Categories</option>
              {categories?.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={titleStyle}>
          {selectedCategory === 'All' ? 'Latest Posts' : `${selectedCategory} Posts`}
        </motion.h1>

        {displayPosts.length > 0 ? (
          <motion.div className="responsive-grid" variants={containerVariants} initial="hidden" animate="visible">
            <AnimatePresence mode='popLayout'>
              {displayPosts.map(post => (
                <motion.div 
                  key={post._id} 
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  whileHover={{ y: -8, boxShadow: '0 12px 20px rgba(0,0,0,0.06)' }}
                  style={cardStyle}
                >
                  {post.imageUrl && (
                    <Link to={`/posts/${post._id}`} style={{ overflow: 'hidden' }}>
                      <img 
                        src={post.imageUrl.startsWith('http') ? post.imageUrl : `${API_BASE_URL}${post.imageUrl}`} 
                        alt={post.title} 
                        style={thumbnailStyle} 
                      />
                    </Link>
                  )}
                  
                  <div style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <p style={cardCategoryStyle}>{post.category?.name || 'Uncategorized'}</p>
                        <Link 
                            to={`/profile/${post.author?._id}`} 
                            style={{ fontSize: '0.8rem', color: '#718096', textDecoration: 'none', fontWeight: '600' }}
                        >
                            by {post.author?.username || 'User'}
                        </Link>
                    </div>

                    <h2 style={cardTitleStyle}> 
                      <Link to={`/posts/${post._id}`} style={linkStyle}>{post.title}</Link>
                    </h2>
                    <p style={{ color: '#4a5568', fontSize: '0.95em', lineHeight: '1.6', marginBottom: '20px' }}>
                      {post.content?.substring(0, 110)}...
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <Link to={`/posts/${post._id}`} style={readMoreLinkStyle}>
                        Read More &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="empty-state-container"
          >
            <h3 style={{ color: '#2d3748', fontSize: '1.5rem', fontWeight: '700', margin: '0 0 10px 0' }}>
              No posts found
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', marginBottom: '10px' }}>
              We couldn't find any articles in <strong>{selectedCategory}</strong>.
            </p>
            <button className="back-btn" onClick={() => setSelectedCategory('All')}>
              Refresh Feed
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer is now back inside Home.jsx only */}
      <footer style={footerStyle}>
        <div style={footerMainContent}>
          <div style={footerBrandSection}>
            <h2 style={footerLogo}>DIGITAL CONTENT</h2>
            <p style={footerTagline}>A modern platform for creating, sharing, and discovering valuable content.</p>
          </div>
          <div style={footerSocialSection}>
            <a href="https://chat.whatsapp.com/IK3Cy47ouwDIh8xwGDYJ5s" target="_blank" rel="noreferrer" style={footerIcon}><FaXTwitter size={22} /></a>
            <a href="https://chat.whatsapp.com/IK3Cy47ouwDIh8xwGDYJ5s" target="_blank" rel="noreferrer" style={footerIcon}><FaInstagram size={22} /></a>
            <a href="https://chat.whatsapp.com/IK3Cy47ouwDIh8xwGDYJ5s" target="_blank" rel="noreferrer" style={footerIcon}><FaTiktok size={22} /></a>
          </div>
        </div>
        <div style={footerBottom}>
          <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
          <div style={{ marginTop: '10px' }}>
            <Link to="/privacy-policy" style={privacyLinkStyle}>Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Styles
const containerStyle = { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', flexGrow: 1 };
const filterSectionStyle = { display: 'flex', justifyContent: 'center', marginBottom: '50px' };
const titleStyle = { textAlign: 'left', fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px', color: '#1a202c', borderLeft: '5px solid #007bff', paddingLeft: '15px' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #f1f5f9' };
const thumbnailStyle = { width: '100%', height: '240px', objectFit: 'cover', display: 'block' };
const cardTitleStyle = { fontSize: '1.35rem', marginBottom: '12px', fontWeight: '800', lineHeight: '1.3' };
const linkStyle = { textDecoration: 'none', color: '#1a202c' };
const cardCategoryStyle = { fontSize: '0.75rem', fontWeight: '800', color: '#007bff', textTransform: 'uppercase', letterSpacing: '1px' };
const readMoreLinkStyle = { color: '#007bff', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' };

const footerStyle = { backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7', padding: '60px 20px 30px 20px', marginTop: '80px' };
const footerMainContent = { maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' };
const footerBrandSection = { textAlign: 'left', maxWidth: '300px' };
const footerLogo = { fontSize: '1.5rem', fontWeight: '900', color: '#1a202c', margin: '0 0 10px 0', letterSpacing: '-0.5px' };
const footerTagline = { fontSize: '0.95rem', color: '#718096', lineHeight: '1.5', margin: 0 };
const footerSocialSection = { display: 'flex', gap: '20px', alignItems: 'center' };
const footerIcon = { color: '#1a202c', transition: 'opacity 0.2s', cursor: 'pointer', textDecoration: 'none' };
const footerBottom = { maxWidth: '1100px', margin: '40px auto 0 auto', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem' };
const privacyLinkStyle = { color: '#007bff', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' };

export default Home;