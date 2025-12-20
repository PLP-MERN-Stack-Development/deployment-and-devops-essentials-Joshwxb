import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi.js'; 
import { deletePost, fetchComments, deleteComment } from '../apiService.js'; 
import { AuthContext } from '../context/AuthContext.jsx';
import CommentForm from '../components/CommentForm.jsx';
import { Trash2 } from 'lucide-react'; 

// --- 🎯 Cleaned CommentItem (No Avatars, No Profile Links) ---
const CommentItem = ({ comment, currentUser, onCommentDeleted }) => {
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={commentAuthorStyle}>{comment.user?.username || 'User'}</span>
                
                {isCommentOwner && (
                    <button onClick={handleDeleteClick} style={iconButtonStyle} title="Delete Comment">
                        <Trash2 size={14} color="#dc3545" />
                    </button>
                )}
            </div>
            <p style={{ margin: '6px 0', color: '#333', fontSize: '0.95em', lineHeight: '1.5' }}>
                {comment.content}
            </p>
            <span style={{ fontSize: '0.75em', color: '#999' }}>
                {new Date(comment.createdAt).toLocaleDateString()}
            </span>
        </div>
    );
};

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'; 
    
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
            
            <div style={metaSectionStyle}>
                <span style={categoryBadgeStyle}>{post.category?.name || 'Uncategorized'}</span>
                <span style={dateStyle}>Published on {new Date(post.createdAt).toLocaleDateString()}</span>
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
                <h2 style={{ fontSize: '1.4em', marginBottom: '20px' }}>Comments ({comments.length})</h2>
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

            <Link to="/" style={backLinkStyle}>
                &larr; Back to Home
            </Link>
        </div>
    );
};

// --- Styles ---
const postDetailContainerStyle = { maxWidth: '800px', margin: '20px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
const titleStyle = { fontSize: '2.4em', fontWeight: '800', color: '#1a202c', marginBottom: '10px', lineHeight: '1.2' };
const metaSectionStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' };
const categoryBadgeStyle = { backgroundColor: '#eef6ff', color: '#007bff', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '0.85em', textTransform: 'uppercase' };
const dateStyle = { fontSize: '0.9em', color: '#718096' };
const contentStyle = { fontSize: '1.15em', lineHeight: '1.8', color: '#4a5568', whiteSpace: 'pre-wrap', marginBottom: '40px' };
const actionsStyle = { marginTop: '30px', display: 'flex', gap: '10px' };
const editLinkStyle = { backgroundColor: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' };
const deleteButtonStyle = { backgroundColor: '#fff', color: '#dc3545', padding: '10px 20px', border: '1px solid #dc3545', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const imageWrapperStyle = { marginBottom: '30px', borderRadius: '12px', overflow: 'hidden' };
const imageStyle = { width: '100%', maxHeight: '500px', objectFit: 'cover' };
const commentsSectionStyle = { marginTop: '40px' };
const commentItemStyle = { padding: '15px 0', borderBottom: '1px solid #f0f0f0', marginBottom: '10px' };
// 🎯 Removed commentAvatarStyle as it's no longer used
const commentAuthorStyle = { fontWeight: '700', color: '#2d3748', fontSize: '0.95em' };
const iconButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' };
const backLinkStyle = { display: 'block', marginTop: '40px', textDecoration: 'none', color: '#718096', fontWeight: '600', textAlign: 'center' };

export default PostDetail;