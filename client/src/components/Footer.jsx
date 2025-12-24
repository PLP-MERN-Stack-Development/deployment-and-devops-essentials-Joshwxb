import React from 'react';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaInstagram, FaTiktok } from 'react-icons/fa6';

const Footer = () => {
  return (
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
          {/* 🎯 Privacy Policy Link for AdSense/Meta approval */}
          <Link to="/privacy-policy" style={privacyLinkStyle}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

// --- Footer Styles ---
const footerStyle = { 
  backgroundColor: '#f8fafc', 
  borderTop: '1px solid #edf2f7', 
  padding: '60px 20px 30px 20px', 
  marginTop: 'auto' 
};
const footerMainContent = { 
  maxWidth: '1100px', 
  margin: '0 auto', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-start', 
  flexWrap: 'wrap', 
  gap: '20px' 
};
const footerBrandSection = { textAlign: 'left', maxWidth: '300px' };
const footerLogo = { fontSize: '1.5rem', fontWeight: '900', color: '#1a202c', margin: '0 0 10px 0', letterSpacing: '-0.5px' };
const footerTagline = { fontSize: '0.95rem', color: '#718096', lineHeight: '1.5', margin: 0 };
const footerSocialSection = { display: 'flex', gap: '20px', alignItems: 'center' };
const footerIcon = { color: '#1a202c', transition: 'opacity 0.2s', cursor: 'pointer' };
const footerBottom = { maxWidth: '1100px', margin: '40px auto 0 auto', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem' };
const privacyLinkStyle = { color: '#007bff', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' };

export default Footer;