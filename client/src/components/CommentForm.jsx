import React, { useState } from 'react';
// FIX: Changed '../../' to '../' to correctly point from 'components' to 'context' 
import { useAuth } from '../context/AuthContext'; 
import { createComment } from '../apiService';

const CommentForm = ({ postId, onCommentAdded }) => {
    // Check if the user is authenticated from the context
    const { user, isAuthenticated } = useAuth(); 
    
    // State for the comment content
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // If the user isn't logged in, display a message instead of the form
    if (!isAuthenticated) {
        return (
            <p style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                You must be logged in to post a comment.
            </p>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic input validation
        if (!content.trim()) {
            setError('Comment content cannot be empty.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Call the API function to create the comment
            // postId is passed from PostDetail, content is from component state
            const newComment = await createComment(postId, content);
            
            // 1. Clear the input field
            setContent(''); 
            
            // 2. Notify the parent (PostDetail) to update its comment list
            // The API returns the new comment object, which we pass up.
            onCommentAdded(newComment); 

        } catch (err) {
            // Error handling from apiService
            setError(err.message || 'Failed to submit comment.');
            console.error('Comment submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#eef8ff' }}>
            <h3 style={{ borderBottom: '1px dashed #007bff', paddingBottom: '10px', marginBottom: '15px', color: '#007bff' }}>
                Comment as {user.username}
            </h3>
            
            {error && <p className="error-message" style={{ color: '#dc3545', marginBottom: '10px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts here (max 500 characters)..."
                    required
                    rows="4"
                    maxLength="500"
                    style={textareaStyle}
                />
                <button type="submit" disabled={loading} className="success-button" style={buttonStyle}>
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
};

// Simple internal styles for the form
const textareaStyle = {
    padding: '12px', 
    border: '1px solid #ccc', 
    borderRadius: '4px', 
    resize: 'vertical', 
    fontSize: '1em'
};

const buttonStyle = { 
    width: '180px', 
    padding: '10px',
    backgroundColor: '#007bff', // Using blue for the main action
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

export default CommentForm;