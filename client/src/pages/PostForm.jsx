import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi.js'; 
import { createPost, updatePost } from '../apiService.js'; 
import { ImagePlus, Send, X } from 'lucide-react';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(''); 
  const [image, setImage] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState('');

  const [formLoading, setFormLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { data: categories, isLoading: isCategoriesLoading } = useApi('/api/categories');
  const { data: existingPost, isLoading: isPostLoading } = useApi(
    isEditMode ? `/api/posts/${id}` : null,
    [id]
  );

  useEffect(() => {
    if (isEditMode && existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      if (existingPost.category) setCategory(existingPost.category._id || existingPost.category); 
      if (existingPost.imageUrl) {
        setPreviewUrl(existingPost.imageUrl.startsWith('http') ? existingPost.imageUrl : `${BACKEND_URL}${existingPost.imageUrl}`);
      }
    } else if (!isEditMode && categories?.length > 0) {
      if (!category) setCategory(categories[0]._id);
    }
  }, [isEditMode, existingPost, categories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      let result = isEditMode ? await updatePost(id, formData) : await createPost(formData);
      navigate(`/posts/${result._id}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (isCategoriesLoading || (isEditMode && isPostLoading)) return <div className="message-center"><h2>Loading Editor...</h2></div>;

  return (
    <div style={pageWrapper}>
      <div style={modernCard}>
        <h1 style={modernTitle}>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
        
        <form onSubmit={handleSubmit} style={modernForm}>
          <div style={inputStack}>
            <label style={modernLabel}>Title</label>
            <input
              style={modernInput}
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={rowLayout}>
            <div style={{...inputStack, flex: 1}}>
              <label style={modernLabel}>Category</label>
              <select style={modernSelect} value={category} onChange={(e) => setCategory(e.target.value)} required>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{...inputStack, flex: 1}}>
              <label style={modernLabel}>Cover Image</label>
              <label htmlFor="file-upload" style={customFileBtn}>
                <ImagePlus size={18} /> {image ? "Image Selected" : "Upload Photo"}
              </label>
              <input id="file-upload" type="file" style={{display: 'none'}} onChange={handleImageChange} />
            </div>
          </div>

          {previewUrl && (
            <div style={imagePreviewWrapper}>
              <img src={previewUrl} alt="Preview" style={previewImg} />
              <button type="button" onClick={() => setPreviewUrl('')} style={removeImgBtn}><X size={14}/></button>
            </div>
          )}

          <div style={inputStack}>
            <label style={modernLabel}>Content</label>
            <textarea
              style={modernTextarea}
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={formLoading} style={modernSubmitBtn}>
            {formLoading ? 'Processing...' : isEditMode ? 'Update Post' : 'Publish Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES (Inline to bypass external CSS conflicts) ---
const pageWrapper = { padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh' };
const modernCard = { maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const modernTitle = { fontSize: '2rem', fontWeight: '800', marginBottom: '30px', color: '#1e293b', textAlign: 'center' };
const modernForm = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputStack = { display: 'flex', flexDirection: 'column', gap: '8px' };
const modernLabel = { fontSize: '0.85rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' };
const modernInput = { padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' };
const modernSelect = { ...modernInput, cursor: 'pointer' };
const modernTextarea = { ...modernInput, minHeight: '250px', lineHeight: '1.6' };
const rowLayout = { display: 'flex', gap: '15px' };
const customFileBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1', cursor: 'pointer', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '600' };
const imagePreviewWrapper = { position: 'relative', width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' };
const previewImg = { width: '100%', height: '100%', objectFit: 'cover' };
const removeImgBtn = { position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer', display: 'flex' };
const modernSubmitBtn = { backgroundColor: '#007bff', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' };

export default PostForm;