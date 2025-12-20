import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; 

const Profile = () => {
  const THEME_COLOR = "#007bff";
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const { user: authUser } = useAuth(); 
  const { data: user, isLoading } = useApi('/api/users/profile');
  
  const [formData, setFormData] = useState({ bio: '', twitter: '', instagram: '', tiktok: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        twitter: user.socials?.twitter || '',
        instagram: user.socials?.instagram || '',
        tiktok: user.socials?.tiktok || '',
      });
      if (user.profilePicture) setPreview(user.profilePicture);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('bio', formData.bio);
    data.append('twitter', formData.twitter);
    data.append('instagram', formData.instagram);
    data.append('tiktok', formData.tiktok);
    if (file) data.append('profilePicture', file);

    try {
      const res = await axios.put(`${API_BASE_URL}/api/users/profile`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      if (res.data.profilePicture) setPreview(res.data.profilePicture);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={containerStyle}
    >
      <div style={cardStyle}>
        <div style={{...headerBgStyle, background: `linear-gradient(135deg, #667eea 0%, ${THEME_COLOR} 100%)`}}>
           <div style={avatarWrapperStyle}>
              <img 
                src={preview || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                style={avatarStyle} 
              />
              <label htmlFor="file-upload" style={uploadIconStyle}>📷</label>
              <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
           </div>
        </div>

        <div style={contentPaddingStyle}>
            <h2 style={usernameStyle}>{user?.username || authUser?.username}</h2>
            <p style={emailStyle}>{user?.email || authUser?.email}</p>

            {message.text && (
                <div style={{ ...msgStyle, backgroundColor: message.type === 'success' ? '#e7f3ff' : '#fff5f5', color: message.type === 'success' ? THEME_COLOR : '#c53030' }}>
                {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={formStyle}>
                <label style={labelStyle}>About Me</label>
                <textarea
                    style={textAreaStyle}
                    rows="3"
                    placeholder="Write a short bio..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />

                <h3 style={sectionTitleStyle}>Social Presence</h3>
                <div style={socialGridStyle}>
                    <div style={inputGroupStyle}>
                        <span style={iconLabelStyle}>Twitter</span>
                        <input style={inputStyle} type="text" placeholder="@username" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} />
                    </div>
                    <div style={inputGroupStyle}>
                        <span style={iconLabelStyle}>Instagram</span>
                        <input style={inputStyle} type="text" placeholder="@username" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} />
                    </div>
                    <div style={inputGroupStyle}>
                        <span style={iconLabelStyle}>TikTok</span>
                        <input style={inputStyle} type="text" placeholder="@username" value={formData.tiktok} onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })} />
                    </div>
                </div>

                <button type="submit" disabled={isUpdating} style={{...btnStyle, backgroundColor: THEME_COLOR}}>
                    {isUpdating ? 'Saving Changes...' : 'Save Profile'}
                </button>
            </form>
        </div>
      </div>
    </motion.div>
  );
};

// --- Updated Styles for Mobile Optimization ---
const containerStyle = { maxWidth: '600px', margin: '20px auto', padding: '0 15px' };
const cardStyle = { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' };
const headerBgStyle = { height: '100px', position: 'relative', marginBottom: '50px' };
const avatarWrapperStyle = { position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)' };
const avatarStyle = { width: '110px', height: '110px', borderRadius: '50%', border: '4px solid #fff', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const uploadIconStyle = { position: 'absolute', bottom: '2px', right: '2px', background: '#fff', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', fontSize: '14px' };
const contentPaddingStyle = { padding: '10px 20px 30px 20px', textAlign: 'center' };
const usernameStyle = { fontSize: '22px', fontWeight: '700', color: '#2d3748', margin: '0' };
const emailStyle = { color: '#718096', fontSize: '13px', marginBottom: '15px' };
const formStyle = { textAlign: 'left', marginTop: '10px' };
const labelStyle = { display: 'block', fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '13px' };
const textAreaStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', resize: 'none' };

// 🎯 THE MOBILE FIX: Uses 'auto-fit' to stack items when they get too small
const socialGridStyle = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
  gap: '12px' 
};

const sectionTitleStyle = { fontSize: '15px', fontWeight: '700', color: '#2d3748', margin: '20px 0 10px 0', borderBottom: '1px solid #edf2f7', paddingBottom: '8px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column' };
const iconLabelStyle = { fontSize: '10px', fontWeight: '600', color: '#a0aec0', marginBottom: '3px', textTransform: 'uppercase' };
const inputStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' };
const btnStyle = { width: '100%', padding: '12px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '25px', fontWeight: '700', fontSize: '15px' };
const msgStyle = { padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', fontWeight: '600', textAlign: 'center' };

export default Profile;