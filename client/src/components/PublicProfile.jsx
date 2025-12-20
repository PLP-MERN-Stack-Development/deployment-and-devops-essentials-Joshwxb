import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useApi from '../hooks/useApi.js';
import { motion } from 'framer-motion';
import { FaXTwitter, FaInstagram, FaTiktok } from 'react-icons/fa6';

const PublicProfile = () => {
  const { userId } = useParams();
  const THEME_COLOR = "#007bff";
  
  // 🎯 Fetching the public data for the specific user in the URL
  const { data: user, isLoading, error } = useApi(`/api/users/public-profile/${userId}`);

  if (isLoading) return <div style={msgCenterStyle}>Loading Profile...</div>;
  if (error || !user) return <div style={msgCenterStyle}>User not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={containerStyle}
    >
      <div style={cardStyle}>
        {/* Header Background */}
        <div style={{...headerBgStyle, background: `linear-gradient(135deg, #667eea 0%, ${THEME_COLOR} 100%)`}}>
           <div style={avatarWrapperStyle}>
              <img 
                src={user.profilePicture || 'https://via.placeholder.com/150'} 
                alt={user.username} 
                style={avatarStyle} 
              />
           </div>
        </div>

        <div style={contentPaddingStyle}>
            <h2 style={usernameStyle}>{user.username}</h2>
            
            <div style={bioBoxStyle}>
                <p style={bioTextStyle}>
                    {user.bio || "This user hasn't written a bio yet. They are busy creating awesome content!"}
                </p>
            </div>

            {user.socials && (
                <div style={socialSectionStyle}>
                    <h3 style={socialTitleStyle}>Connect with {user.username}</h3>
                    <div style={socialGridStyle}>
                        {user.socials.twitter && (
                            <a href={user.socials.twitter} target="_blank" rel="noreferrer" style={socialLinkStyle}>
                                <FaXTwitter /> Twitter
                            </a>
                        )}
                        {user.socials.instagram && (
                            <a href={user.socials.instagram} target="_blank" rel="noreferrer" style={socialLinkStyle}>
                                <FaInstagram /> Instagram
                            </a>
                        )}
                        {user.socials.tiktok && (
                            <a href={user.socials.tiktok} target="_blank" rel="noreferrer" style={socialLinkStyle}>
                                <FaTiktok /> TikTok
                            </a>
                        )}
                    </div>
                </div>
            )}

            <Link to="/" style={backButtonStyle}>
                Back to Feed
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

// --- Styles (Matches your Profile.jsx for consistency) ---
const containerStyle = { maxWidth: '600px', margin: '40px auto', padding: '0 20px' };
const cardStyle = { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' };
const headerBgStyle = { height: '120px', position: 'relative', marginBottom: '60px' };
const avatarWrapperStyle = { position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)' };
const avatarStyle = { width: '120px', height: '120px', borderRadius: '50%', border: '5px solid #fff', objectFit: 'cover', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' };
const contentPaddingStyle = { padding: '20px 30px 40px 30px', textAlign: 'center' };
const usernameStyle = { fontSize: '28px', fontWeight: '800', color: '#1a202c', margin: '0 0 10px 0' };
const bioBoxStyle = { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', margin: '20px 0' };
const bioTextStyle = { color: '#4a5568', lineHeight: '1.6', fontSize: '16px', fontStyle: 'italic' };
const socialSectionStyle = { marginTop: '30px' };
const socialTitleStyle = { fontSize: '14px', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' };

// 🎯 Responsive Grid for Socials
const socialGridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
    gap: '10px' 
};

const socialLinkStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px', 
    padding: '10px', 
    borderRadius: '8px', 
    backgroundColor: '#fff', 
    border: '1px solid #e2e8f0', 
    color: '#2d3748', 
    textDecoration: 'none', 
    fontWeight: '600',
    transition: 'all 0.2s ease'
};

const backButtonStyle = { display: 'inline-block', marginTop: '30px', color: '#007bff', textDecoration: 'none', fontWeight: '700' };
const msgCenterStyle = { textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#718096' };

export default PublicProfile;