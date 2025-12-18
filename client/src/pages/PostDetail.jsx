import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi.js'; 
import { deletePost, fetchComments, deleteComment } from '../apiService.js'; 
import { AuthContext } from '../context/AuthContext.jsx';
import CommentForm from '../components/CommentForm.jsx';
import { Trash2 } from 'lucide-react'; 

// --- 🎯 Simplified CommentItem (Delete Only) ---
const CommentItem = ({ comment, currentUser, onCommentDeleted }) => {
    // Check if the logged-in user is the author of this comment
    const isCommentOwner = currentUser && (comment.user?._id === currentUser._id || comment.user === currentUser._id);

    const handleDeleteClick = async () => {
        if (window.confirm("Delete this comment?")) {
            try {
                await deleteComment(comment._id);
                onCommentDeleted(comment._id);
            } catch (err) {
                alert("Failed to delete comment: " + err.message);
            }
        }
    };

    return (
        <div style={commentItemStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#007bff', marginBottom: '3px' }}>
                        {comment.user?.username || 'User'} says:
                    </p>
                    <p style={{ margin: '5px 0', color: '#333' }}>{comment.content}</p>
                </div>

                {/* Only show Delete icon if user is the owner */}
                {isCommentOwner && (
                    <button onClick={handleDeleteClick} style={iconButtonStyle} title="Delete Comment">
                        <Trash2 size={16} color="#dc3545" />
                    </button>
                )}
            </div>
            <span style={{ fontSize: '0.75em', color: '#777' }}>
                {new Date(comment.createdAt).toLocaleDateString()}
            </span>
        </div>
    );
};

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    const BACKEND_BASE_URL = 'http://localhost:5000'; 
    
    const { data: post, isLoading: isPostLoading, error: postError } = useApi(`/api/posts/${id}`);
    
    const [comments, setComments] = useState([]);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);

    useEffect(() => {
        const loadComments = async () => {
            setIsCommentsLoading(true);
            try {
                const commentsData = await fetchComments(id);
                setComments(commentsData);
            } catch (err) {
                console.error("Error loading comments:", err.message);
            } finally {
                setIsCommentsLoading(false);
            }
        };
        if (id) loadComments();
    }, [id]);

    const handleCommentAdded = (newComment) => {
        setComments((prev) => [...prev, newComment]);
    };

    const handleCommentDeleted = (commentId) => {
        setComments((prev) => prev.filter(c => c._id !== commentId));
    };
    
    const handleDeletePost = async () => {
      if (!window.confirm('Are you sure you want to delete this post?')) return;
      try {
          await deletePost(id); 
          navigate('/', { state: { message: 'Post deleted successfully!' } });
      } catch (err) {
          alert(err.message);
      }
    };
  
    if (isPostLoading) return <div className="message-center"><h2>Loading post details...</h2></div>;
    if (postError || !post) return <div className="message-center"><h2>Error loading post.</h2></div>;
  
    const postOwnerId = post.user?._id || post.user; 
    const isPostOwner = user && postOwnerId && postOwnerId.toString() === user._id?.toString();

    return (
        <div style={postDetailContainerStyle}> 
            <h1 style={titleStyle}>{post.title}</h1>
            <div style={metaStyle}>
                <span style={categoryBadgeStyle}>Category: {post.category?.name || 'Uncategorized'}</span>
                <span style={dateStyle}>Published: {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            
            {post.imageUrl && (
                <div style={imageWrapperStyle}>
                    <img 
                        src={post.imageUrl.startsWith('http') ? post.imageUrl : `${BACKEND_BASE_URL}${post.imageUrl}`} 
                        alt={post.title} 
                        style={imageStyle}
                    />
                </div>
            )}
            
            <div style={contentStyle}><p>{post.content}</p></div>

            {isPostOwner && (
                <div style={actionsStyle}>
                    <Link to={`/edit/${post._id}`} style={editLinkStyle}>Edit Post</Link>
                    <button onClick={handleDeletePost} style={deleteButtonStyle}>Delete Post</button>
                </div>
            )}

            <hr style={{ margin: '40px 0', borderColor: '#eee' }} />
            
            <div style={commentsSectionStyle}>
                <h2>Comments ({comments.length})</h2>
                {isCommentsLoading ? <p>Loading comments...</p> : (
                    <div style={{ marginTop: '20px' }}>
                        {comments.map((comment) => (
                            <CommentItem 
                                key={comment._id} 
                                comment={comment} 
                                currentUser={user}
                                onCommentDeleted={handleCommentDeleted}
                            />
                        ))}
                    </div>
                )}
                <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
            </div>

            <Link to="/" style={{display: 'block', marginTop: '30px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold'}}>
                &larr; Back to All Posts
            </Link>
        </div>
    );
};

// --- Styles ---
const postDetailContainerStyle = { maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' };
const titleStyle = { color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '15px' };
const metaStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', color: '#666', marginBottom: '25px' };
const categoryBadgeStyle = { backgroundColor: '#e9ecef', padding: '4px 8px', borderRadius: '4px' };
const dateStyle = { fontStyle: 'italic' };
const contentStyle = { fontSize: '1.1em', lineHeight: '1.8', whiteSpace: 'pre-wrap', wordWrap: 'break-word', border: '1px solid #eee', padding: '20px', borderRadius: '6px', backgroundColor: '#f9f9f9' };
const actionsStyle = { marginTop: '30px', textAlign: 'right' };
const editLinkStyle = { backgroundColor: '#007bff', color: 'white', padding: '10px 15px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', marginRight: '10px' };
const deleteButtonStyle = { backgroundColor: '#dc3545', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const imageWrapperStyle = { margin: '0 0 30px 0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' };
const imageStyle = { width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' };
const commentsSectionStyle = { marginTop: '40px', borderTop: '2px dashed #ccc', paddingTop: '30px' };
const commentItemStyle = { padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const iconButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', transition: 'opacity 0.2s' };

export default PostDetail;