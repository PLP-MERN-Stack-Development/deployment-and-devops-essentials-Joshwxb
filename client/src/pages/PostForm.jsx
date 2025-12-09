import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi.js'; 
// NOTE: You'll need to modify createPost and updatePost in apiService.js
import { createPost, updatePost } from '../apiService.js'; 

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // State for form inputs
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(''); 
  
  // 🌟 NEW: State to hold the selected image file
  const [image, setImage] = useState(null); 
  // 🌟 NEW: State to hold the URL of the existing image (for display in edit mode)
  const [existingImageUrl, setExistingImageUrl] = useState('');


  // State for UI feedback
  const [formLoading, setFormLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // 1. Fetch Categories for Dropdown
  const { data: categories, isLoading: isCategoriesLoading, error: categoryError } = useApi('/api/categories');

  // 2. Fetch Existing Post Data if in Edit Mode
  const { data: existingPost, isLoading: isPostLoading, error: postError } = useApi(
    isEditMode ? `/api/posts/${id}` : null,
    [id]
  );

  // 3. Populate form fields (Edit Mode) OR Set default category (Create Mode)
  useEffect(() => {
    if (isEditMode && existingPost) {
      // EDIT MODE: Populate fields from existing post
      setTitle(existingPost.title);
      setContent(existingPost.content);
      
      // Handle existing category
      if (existingPost.category) {
          setCategory(existingPost.category._id || existingPost.category); 
      } else {
          setCategory(''); 
      }
      
      // 🌟 NEW: Set existing image URL for display
      if (existingPost.imageUrl) {
          setExistingImageUrl(existingPost.imageUrl);
      }

    } else if (!isEditMode && categories && categories.length > 0) {
      // CREATE MODE: Set default category immediately upon loading categories
      if (!category) {
          setCategory(categories[0]._id);
      }
    }
  }, [isEditMode, existingPost, categories]);

  // Handle Form Submission 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setSubmitError(null);
    
    // 🌟 CRITICAL CHANGE: Use FormData for file uploads
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);

    // 🌟 Add the image file only if one was selected
    if (image) {
        formData.append('image', image);
    }

    
    try {
        let result;
        
        // Pass the FormData object instead of the regular postData object
        if (isEditMode) {
            // NOTE: Your backend must be configured to handle file uploads on PUT/PATCH
            result = await updatePost(id, formData);
        } else {
            result = await createPost(formData);
        }
        
        navigate(`/posts/${result._id}`);

    } catch (err) {
        setSubmitError(err.message);
    } finally {
        setFormLoading(false);
    }
  };

  // 🌟 NEW: Handler for file input change
  const handleImageChange = (e) => {
      // e.target.files[0] contains the selected file
      setImage(e.target.files[0]);
  };


  if (isCategoriesLoading || (isEditMode && isPostLoading)) {
    return <div className="message-center"><h2>Loading {isEditMode ? 'post and categories' : 'categories'}...</h2></div>;
  }

  if (categoryError || postError) {
    return (
        <div className="message-center">
            <h2 className="error-message">{categoryError || postError}</h2>
        </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <div className="message-center"><h2>No categories found. Please create one on the backend first.</h2></div>;
  }

  // Render Form
  return (
    <div className="form-container">
      <h1 style={{textAlign: 'center', marginBottom: '25px', color: '#333'}}>{isEditMode ? 'Edit Blog Post' : 'Create New Post'}</h1>
      
      <form onSubmit={handleSubmit} style={{display: 'grid', gap: '15px'}} encType="multipart/form-data">
        
        {submitError && <p className="error-message">{submitError}</p>}

        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* 🌟 NEW IMAGE INPUT FIELD */}
        <label htmlFor="image">Feature Image:</label>
        {isEditMode && existingImageUrl && (
            <div style={{ marginBottom: '10px' }}>
                <p>Current Image:</p>
                {/* You might need to adjust the URL depending on your server setup */}
                <img src={existingImageUrl} alt="Current Post" style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px', display: 'block' }} />
            </div>
        )}
        <input
          id="image"
          type="file"
          accept="image/*" // Restrict to image files
          onChange={handleImageChange}
          // Do not require file input in edit mode unless replacing
          required={!isEditMode} 
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
        />
        
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category || ""} 
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select a Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        
        <button type="submit" disabled={formLoading} className="success-button">
          {formLoading ? 'Submitting...' : isEditMode ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;