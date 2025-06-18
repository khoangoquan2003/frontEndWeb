import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FaComment, FaSpinner, FaExclamationTriangle, FaEye,
    FaTrash, FaEdit, FaSearch, FaClock, FaUser, FaBook,
    FaCalendarAlt, FaHeart, FaReply
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

const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
};

const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Custom hooks
const useAuth = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName') || localStorage.getItem('nickname');

        if (!storedUserId) {
            toast.error('Vui lòng đăng nhập để xem bình luận');
            navigate('/login');
            return;
        }

        setUserId(storedUserId);
        setUserName(storedUserName || 'Người dùng');
    }, [navigate]);

    return { userId, userName };
};

// Sub-components
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Đang tải bình luận...</p>
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

const EmptyState = ({ userName }) => (
    <div className="text-center py-20">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa có bình luận nào
        </h3>
        <p className="text-gray-500 mb-6">
            {userName}, bạn chưa có bình luận nào. Hãy tham gia thảo luận trong các bài học!
        </p>
        <button
            onClick={() => window.location.href = '/courses'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
            <FaBook />
            Khám phá bài học
        </button>
    </div>
);

const SearchBar = ({ searchTerm, onSearchChange, totalComments, filteredCount }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm trong bình luận..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="text-sm text-gray-600">
                {searchTerm ? (
                    <span>Hiển thị {filteredCount} / {totalComments} bình luận</span>
                ) : (
                    <span>{totalComments} bình luận</span>
                )}
            </div>
        </div>
    </div>
);

const CommentStats = ({ comments }) => {
    const totalComments = comments.length;
    const coursesCommented = new Set(comments.map(c => c.courseId)).size;
    const thisMonth = comments.filter(c => {
        const commentDate = new Date(c.createDate);
        const now = new Date();
        return commentDate.getMonth() === now.getMonth() &&
            commentDate.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Tổng bình luận</p>
                        <p className="text-2xl font-bold text-blue-600">{totalComments}</p>
                    </div>
                    <FaComment className="text-2xl text-blue-500" />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Bài học đã bình luận</p>
                        <p className="text-2xl font-bold text-green-600">{coursesCommented}</p>
                    </div>
                    <FaBook className="text-2xl text-green-500" />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Tháng này</p>
                        <p className="text-2xl font-bold text-purple-600">{thisMonth}</p>
                    </div>
                    <FaCalendarAlt className="text-2xl text-purple-500" />
                </div>
            </div>
        </div>
    );
};

const CommentItem = ({ comment, userName, onDelete, onEdit, onViewCourse }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showFullContent, setShowFullContent] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
            setIsDeleting(true);
            try {
                await onDelete(comment.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleEdit = async () => {
        if (editContent.trim() === comment.content) {
            setIsEditing(false);
            return;
        }

        try {
            await onEdit(comment.id, editContent.trim());
            setIsEditing(false);
        } catch (error) {
            setEditContent(comment.content); // Reset on error
        }
    };

    const handleViewCourse = () => {
        onViewCourse(comment.courseId, comment.courseName);
    };

    const isLongContent = comment.content && comment.content.length > 200;
    const displayContent = showFullContent ? comment.content : truncateText(comment.content);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
                        {getInitials(userName)}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{userName}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-2">
                            <FaClock className="text-xs" />
                            <span>{formatDate(comment.createDate)}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                        title="Chỉnh sửa bình luận"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        title="Xóa bình luận"
                    >
                        {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="4"
                            placeholder="Nhập nội dung bình luận..."
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(comment.content);
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleEdit}
                                disabled={!editContent.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {displayContent}
                        </p>
                        {isLongContent && (
                            <button
                                onClick={() => setShowFullContent(!showFullContent)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 transition-colors"
                            >
                                {showFullContent ? 'Thu gọn' : 'Xem thêm'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Course Link */}
            {comment.courseId && comment.courseName && (
                <div className="pt-4 border-t border-gray-200">
                    <button
                        onClick={handleViewCourse}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors group"
                    >
                        <FaEye className="mr-2 group-hover:scale-110 transition-transform" />
                        <span className="truncate">
                            Xem bài học: {comment.courseName}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

const Comments = () => {
    const { userId, userName } = useAuth();
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchComments = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await http.get(`/api/show-comment-user?userId=${userId}`);

            if (response.data?.result) {
                const sortedComments = response.data.result.sort(
                    (a, b) => new Date(b.createDate) - new Date(a.createDate)
                );
                setComments(sortedComments);
            } else {
                throw new Error('Dữ liệu trả về không hợp lệ');
            }

        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Không thể tải bình luận. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Filter comments based on search
    useEffect(() => {
        if (!searchTerm) {
            setFilteredComments(comments);
        } else {
            const filtered = comments.filter(comment =>
                comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                comment.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredComments(filtered);
        }
    }, [comments, searchTerm]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleDeleteComment = async (commentId) => {
        try {
            // Mock API call - replace with actual endpoint
            // await http.delete(`/api/delete-comment/${commentId}`);

            setComments(prev => prev.filter(comment => comment.id !== commentId));
            toast.success('Đã xóa bình luận');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Không thể xóa bình luận');
        }
    };

    const handleEditComment = async (commentId, newContent) => {
        try {
            // Mock API call - replace with actual endpoint
            // await http.put(`/api/edit-comment/${commentId}`, { content: newContent });

            setComments(prev =>
                prev.map(comment =>
                    comment.id === commentId
                        ? { ...comment, content: newContent }
                        : comment
                )
            );

            toast.success('Đã cập nhật bình luận');
        } catch (error) {
            console.error('Error editing comment:', error);
            toast.error('Không thể cập nhật bình luận');
            throw error;
        }
    };

    const handleViewCourse = (courseId, courseName) => {
        navigate(`/dictation?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}`);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchComments} />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-8">
                    <FaComment className="text-3xl text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Bình luận của {userName}
                        </h1>
                        <p className="text-gray-600">
                            Quản lý và xem lại các bình luận của bạn
                        </p>
                    </div>
                </div>

                {comments.length === 0 ? (
                    <EmptyState userName={userName} />
                ) : (
                    <>
                        {/* Stats */}
                        <CommentStats comments={comments} />

                        {/* Search */}
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            totalComments={comments.length}
                            filteredCount={filteredComments.length}
                        />

                        {/* Comments List */}
                        {filteredComments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    Không tìm thấy bình luận nào
                                </h3>
                                <p className="text-gray-500">
                                    Thử tìm kiếm với từ khóa khác
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredComments.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        userName={userName}
                                        onDelete={handleDeleteComment}
                                        onEdit={handleEditComment}
                                        onViewCourse={handleViewCourse}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Comments;