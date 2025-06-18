import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FaBell, FaSpinner, FaExclamationTriangle, FaEye,
    FaTrash, FaCheck, FaFilter, FaSearch, FaClock
} from 'react-icons/fa';
import { http } from '../api/Http';

// Utility functions
const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getNotificationIcon = (type) => {
    switch (type) {
        case 'course': return '📚';
        case 'achievement': return '🏆';
        case 'reminder': return '⏰';
        case 'system': return '⚙️';
        default: return '🔔';
    }
};

const getNotificationColor = (type, isRead) => {
    const baseColors = {
        course: 'blue',
        achievement: 'green',
        reminder: 'orange',
        system: 'purple',
        default: 'gray'
    };

    const color = baseColors[type] || baseColors.default;
    return isRead ? `bg-${color}-100 text-${color}-600` : `bg-${color}-500 text-white`;
};

// Custom hooks
const useAuth = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            toast.error('Vui lòng đăng nhập để xem thông báo');
            navigate('/login');
            return;
        }
        setUserId(storedUserId);
    }, [navigate]);

    return userId;
};

// Sub-components
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Đang tải thông báo...</p>
        </div>
    </div>
);

const ErrorMessage = ({ message, onRetry }) => (
    <div className="text-center py-20">
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
        </div>
        <h2 className="text-xl font-semibold text-red-600 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-red-500 mb-4">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
                Thử lại
            </button>
        )}
    </div>
);

const EmptyState = () => (
    <div className="text-center py-20">
        <div className="text-6xl mb-4">🔔</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa có thông báo nào
        </h3>
        <p className="text-gray-500">
            Các thông báo mới sẽ xuất hiện tại đây
        </p>
    </div>
);

const NotificationFilters = ({ filter, onFilterChange, searchTerm, onSearchChange }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm thông báo..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filter}
                    onChange={(e) => onFilterChange(e.target.value)}
                >
                    <option value="all">Tất cả</option>
                    <option value="unread">Chưa đọc</option>
                    <option value="read">Đã đọc</option>
                    <option value="course">Khóa học</option>
                    <option value="achievement">Thành tích</option>
                    <option value="system">Hệ thống</option>
                </select>
            </div>
        </div>
    </div>
);

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onViewCourse }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMarkingRead, setIsMarkingRead] = useState(false);

    const handleMarkAsRead = async () => {
        if (notification.isRead) return;

        setIsMarkingRead(true);
        try {
            await onMarkAsRead(notification.id);
        } finally {
            setIsMarkingRead(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
            setIsDeleting(true);
            try {
                await onDelete(notification.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleViewCourse = () => {
        if (notification.course && notification.courseName) {
            onViewCourse(notification.course, notification.courseName);
        }
    };

    return (
        <div className={`p-6 bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
            notification.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
        }`}>
            <div className="flex items-start space-x-4">
                {/* Avatar/Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    getNotificationColor(notification.type, notification.isRead)
                }`}>
                    {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className={`text-gray-800 leading-relaxed ${
                                notification.isRead ? '' : 'font-medium'
                            }`}>
                                {notification.message}
                            </p>

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                                    <FaClock className="text-xs" />
                                    <span>{formatDate(notification.createdAt)}</span>
                                    {!notification.isRead && (
                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                            Mới
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2">
                                    {!notification.isRead && (
                                        <button
                                            onClick={handleMarkAsRead}
                                            disabled={isMarkingRead}
                                            className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                                            title="Đánh dấu đã đọc"
                                        >
                                            {isMarkingRead ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaCheck />
                                            )}
                                        </button>
                                    )}

                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                        title="Xóa thông báo"
                                    >
                                        {isDeleting ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : (
                                            <FaTrash />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Link */}
                    {notification.course && notification.courseName && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                            <button
                                onClick={handleViewCourse}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                <FaEye className="mr-2" />
                                Xem bài học: {notification.courseName}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Notifications = () => {
    const userId = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await http.get(`/api/show-all-notification?userId=${userId}`);

            if (response.data?.result) {
                // Filter out self-triggered notifications
                const filtered = response.data.result.filter(
                    note => note.triggerUserId !== Number(userId)
                );

                // Add mock isRead property if not provided by API
                const processedNotifications = filtered.map(note => ({
                    ...note,
                    isRead: note.isRead ?? Math.random() > 0.5, // Mock data
                    type: note.type || 'course' // Default type
                }));

                const sorted = processedNotifications.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setNotifications(sorted);
            } else {
                throw new Error('Dữ liệu trả về không hợp lệ');
            }

        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Không thể tải thông báo. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Filter notifications based on search and filter
    useEffect(() => {
        let filtered = notifications;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(notification =>
                notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notification.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        switch (filter) {
            case 'unread':
                filtered = filtered.filter(n => !n.isRead);
                break;
            case 'read':
                filtered = filtered.filter(n => n.isRead);
                break;
            case 'course':
                filtered = filtered.filter(n => n.type === 'course');
                break;
            case 'achievement':
                filtered = filtered.filter(n => n.type === 'achievement');
                break;
            case 'system':
                filtered = filtered.filter(n => n.type === 'system');
                break;
            default:
                // 'all' - no additional filtering
                break;
        }

        setFilteredNotifications(filtered);
    }, [notifications, searchTerm, filter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            // Mock API call - replace with actual endpoint
            // await http.put(`/api/mark-notification-read/${notificationId}`);

            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            toast.success('Đã đánh dấu là đã đọc');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Không thể đánh dấu thông báo');
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            // Mock API call - replace with actual endpoint
            // await http.delete(`/api/delete-notification/${notificationId}`);

            setNotifications(prev =>
                prev.filter(notification => notification.id !== notificationId)
            );

            toast.success('Đã xóa thông báo');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Không thể xóa thông báo');
        }
    };

    const handleViewCourse = (courseId, courseName) => {
        navigate(`/dictation?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}`);
    };

    const handleMarkAllAsRead = async () => {
        try {
            const unreadNotifications = notifications.filter(n => !n.isRead);
            if (unreadNotifications.length === 0) {
                toast.info('Tất cả thông báo đã được đọc');
                return;
            }

            // Mock API call
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, isRead: true }))
            );

            toast.success(`Đã đánh dấu ${unreadNotifications.length} thông báo là đã đọc`);
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Không thể đánh dấu tất cả thông báo');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchNotifications} />;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <FaBell className="text-3xl text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Thông báo</h1>
                            <p className="text-gray-600">
                                {notifications.length} thông báo • {unreadCount} chưa đọc
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaCheck />
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>

                {/* Filters */}
                <NotificationFilters
                    filter={filter}
                    onFilterChange={setFilter}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                {/* Notifications List */}
                {filteredNotifications.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDeleteNotification}
                                onViewCourse={handleViewCourse}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;