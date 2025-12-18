import React, { useState, useEffect, useRef } from 'react'; // 🎯 Added useRef
import { fetchNotifications, markNotificationRead, deleteNotification } from '../apiService';
import { Link } from 'react-router-dom';
import { Bell, Trash2, BellOff } from 'lucide-react'; 

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    // 🎯 Ref to track the notification container
    const bellRef = useRef(null);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };
        getNotifications();

        // 🎯 Logic to handle clicking outside
        const handleClickOutside = (event) => {
            if (bellRef.current && !bellRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); 
        try {
            await deleteNotification(id);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to delete notification", err);
        }
    };

    return (
        /* 🎯 Attached the Ref here */
        <div className="notification-wrapper" ref={bellRef} style={{ position: 'relative', display: 'inline-block' }}>
            
            {/* 🔔 Modern Bell Icon Trigger */}
            <div 
                onClick={() => setIsOpen(!isOpen)} 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '8px',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    backgroundColor: isHovered ? 'rgba(97, 218, 251, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
            >
                <Bell 
                    size={24} 
                    color="#61dafb" 
                    fill={unreadCount > 0 ? "#61dafb" : "none"} 
                    style={{
                        filter: isHovered ? 'drop-shadow(0 0 8px rgba(97, 218, 251, 0.6))' : 'none',
                        transition: 'filter 0.3s ease'
                    }}
                />

                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', 
                        top: '4px', 
                        right: '4px',
                        background: '#ff4757', 
                        color: 'white', 
                        borderRadius: '50%',
                        minWidth: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '800',
                        border: '2px solid #20232a',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}>
                        {unreadCount}
                    </span>
                )}
            </div>

            {/* 📬 Modern Dropdown Menu */}
            {isOpen && (
                <div className="dropdown-modern" style={{
                    position: 'absolute', 
                    right: '-10px', 
                    top: '55px', 
                    background: '#ffffff',
                    width: '320px', 
                    zIndex: 1000, 
                    color: '#2f3542',
                    maxHeight: '400px', 
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ 
                        padding: '16px', 
                        borderBottom: '1px solid #f1f2f6', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f8f9fa'
                    }}>
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>Notifications</span>
                        <span style={{ fontSize: '12px', color: '#61dafb', fontWeight: '600' }}>
                            {unreadCount} New
                        </span>
                    </div>

                    <div style={{ overflowY: 'auto', maxHeight: '320px' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#a4b0be' }}>
                                <BellOff size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                <p style={{ fontSize: '14px', margin: 0 }}>All caught up!</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div key={n._id} 
                                     onClick={() => handleMarkAsRead(n._id)}
                                     style={{
                                        padding: '14px 16px',
                                        backgroundColor: n.isRead ? 'transparent' : '#f0faff',
                                        borderBottom: '1px solid #f1f2f6',
                                        display: 'flex',
                                        transition: 'background 0.2s ease',
                                        gap: '12px',
                                        alignItems: 'start'
                                     }}>
                                    
                                    <div style={{ flex: 1 }}>
                                        <Link 
                                            to={`/post/${n.post?._id}`} 
                                            onClick={() => setIsOpen(false)} 
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', lineHeight: '1.4' }}>
                                                <strong style={{ color: '#2f3542' }}>{n.sender?.username}</strong>
                                                <span style={{ color: '#57606f' }}> commented on </span>
                                                <span style={{ fontWeight: '600', color: '#61dafb' }}>{n.post?.title}</span>
                                            </p>
                                        </Link>
                                    </div>

                                    <button 
                                        onClick={(e) => handleDelete(e, n._id)}
                                        style={{
                                            border: 'none',
                                            background: 'none',
                                            padding: '4px',
                                            cursor: 'pointer',
                                            color: '#ced4da',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#ff4757'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#ced4da'}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;