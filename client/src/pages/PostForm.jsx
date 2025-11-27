import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi.js'; 
import { createPost, updatePost } from '../apiService.js';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // State for form inputs
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(''); 
  
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
      setCategory(existingPost.category._id); 
    } else if (!isEditMode && categories && categories.length > 0) {
      // CREATE MODE: Set default category immediately upon loading categories
      if (!category) {
          setCategory(categories[0]._id);
      }
    }
  }, [isEditMode, existingPost, categories]); // Added categories to dependencies

  // Handle Form Submission 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setSubmitError(null);
    
    const postData = {
        title,
        content,
        category,
    };
    
    try {
        let result;
        if (isEditMode) {
            result = await updatePost(id, postData);
        } else {
            result = await createPost(postData);
        }
        
        // Navigate to the newly created or updated post's detail page
        navigate(`/posts/${result._id}`);

    } catch (err) {
        setSubmitError(err.message);
    } finally {
        setFormLoading(false);
    }
  };

  if (isCategoriesLoading || (isEditMode && isPostLoading)) {
    // REFACTORED: Use className="message-center"
    return <div className="message-center"><h2>Loading {isEditMode ? 'post and categories' : 'categories'}...</h2></div>;
  }

  if (categoryError || postError) {
    // REFACTORED: Use className="message-center" and className="error-message"
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
    // REFACTORED: Use className="form-container"
    <div className="form-container">
      {/* Keeping h1 inline style minimal for centering/spacing */}
      <h1 style={{textAlign: 'center', marginBottom: '25px', color: '#333'}}>{isEditMode ? 'Edit Blog Post' : 'Create New Post'}</h1>
      
      {/* Keeping form inline style minimal for grid layout */}
      <form onSubmit={handleSubmit} style={{display: 'grid', gap: '15px'}}>
        
        {/* REFACTORED: Use className="error-message" */}
        {submitError && <p className="error-message">{submitError}</p>}

        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
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
        
        {/* REFACTORED: Use className="success-button" */}
        <button type="submit" disabled={formLoading} className="success-button">
          {formLoading ? 'Submitting...' : isEditMode ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

// --- REMOVED ALL INLINE STYLE CONSTANTS (centerStyle, containerStyle, etc.) ---

export default PostForm;