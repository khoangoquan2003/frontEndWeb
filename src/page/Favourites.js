import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FaHeart, FaSpinner, FaExclamationTriangle, FaPlay,
    FaTrash, FaBook, FaSearch
} from 'react-icons/fa';
import { http } from '../api/Http';

// Utility functions
const getCourseIcon = (courseName) => {
    if (!courseName) return '📚';
    const name = courseName.toLowerCase();
    if (name.includes('grammar')) return '📝';
    if (name.includes('vocabulary')) return '📖';
    if (name.includes('listening')) return '🎧';
    if (name.includes('speaking')) return '🗣️';
    if (name.includes('reading')) return '📰';
    if (name.includes('writing')) return '✍️';
    return '📚';
};

// Custom hook for authentication
const useAuth = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            toast.error('Vui lòng đăng nhập để xem danh sách yêu thích');
            navigate('/login');
            return;
        }
        setUserId(storedUserId);
    }, [navigate]);

    return userId;
};

// Sub-components
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-16">
        <div className="text-center">
            <FaSpinner className="animate-spin text-3xl text-pink-600 mx-auto mb-3" />
            <p className="text-gray-600">Đang tải danh sách yêu thích...</p>
        </div>
    </div>
);

const ErrorMessage = ({ message, onRetry }) => (
    <div className="text-center py-16">
        <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <FaExclamationTriangle className="text-red-600 text-xl" />
        </div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Đã xảy ra lỗi</h3>
        <p className="text-red-500 mb-4">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
                Thử lại
            </button>
        )}
    </div>
);

const EmptyState = () => (
    <div className="text-center py-16">
        <div className="text-5xl mb-4">💝</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có khóa học yêu thích
        </h3>
        <p className="text-gray-500 mb-6">
            Hãy khám phá và thêm các khóa học bạn yêu thích vào danh sách này
        </p>
        <button
            onClick={() => window.location.href = '/topics'}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors inline-flex items-center gap-2"
        >
            <FaBook />
            Khám phá khóa học
        </button>
    </div>
);

const SearchBar = ({ searchTerm, onSearchChange, totalCount, filteredCount }) => (
    <div className="mb-6">
        <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Tìm kiếm khóa học yêu thích..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
        {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
                Hiển thị {filteredCount} / {totalCount} khóa học
            </p>
        )}
    </div>
);

const CourseItem = ({ course, onRemove, onView }) => {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này khỏi danh sách yêu thích?')) {
            setIsRemoving(true);
            try {
                await onRemove(course.courseId);
            } finally {
                setIsRemoving(false);
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center space-x-3 flex-1 cursor-pointer group"
                    onClick={() => onView(course.courseId, course.courseName)}
                >
                    <div className="text-2xl">
                        {getCourseIcon(course.courseName)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 group-hover:text-pink-600 transition-colors truncate">
                            {course.courseName}
                        </h3>
                        <p className="text-sm text-gray-500">Nhấn để học ngay</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                    <button
                        onClick={() => onView(course.courseId, course.courseName)}
                        className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2 text-sm font-medium"
                        title="Học ngay"
                    >
                        <FaPlay />
                        Học
                    </button>
                    <button
                        onClick={handleRemove}
                        disabled={isRemoving}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Xóa khỏi yêu thích"
                    >
                        {isRemoving ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Favourites = () => {
    const userId = useAuth();
    const navigate = useNavigate();

    const [favourites, setFavourites] = useState([]);
    const [filteredFavourites, setFilteredFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFavourites = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await http.get('/api/show-all-favorite-course', {
                params: { userId }
            });

            if (response.data?.result) {
                setFavourites(response.data.result);
            } else {
                setFavourites([]);
            }

        } catch (error) {
            console.error('Error fetching favourites:', error);
            setError('Không thể tải danh sách yêu thích. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Filter favourites based on search
    useEffect(() => {
        if (!searchTerm) {
            setFilteredFavourites(favourites);
        } else {
            const filtered = favourites.filter(course =>
                course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFavourites(filtered);
        }
    }, [favourites, searchTerm]);

    useEffect(() => {
        fetchFavourites();
    }, [fetchFavourites]);

    const handleRemoveFavourite = async (courseId) => {
        try {
            await http.delete('/api/delete-favorite-course', {
                params: { userId, courseId }
            });

            setFavourites(prev => prev.filter(item => item.courseId !== courseId));
            toast.success('Đã xóa khỏi danh sách yêu thích');
        } catch (error) {
            console.error('Error removing favourite:', error);
            toast.error('Không thể xóa khóa học khỏi yêu thích');
        }
    };

    const handleViewCourse = (courseId, courseName) => {
        navigate(`/dictation?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}`);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchFavourites} />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-8">
                    <FaHeart className="text-3xl text-pink-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Yêu thích của bạn
                        </h1>
                        <p className="text-gray-600">
                            {favourites.length} khóa học đã lưu
                        </p>
                    </div>
                </div>

                {favourites.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Search */}
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            totalCount={favourites.length}
                            filteredCount={filteredFavourites.length}
                        />

                        {/* Courses List */}
                        {filteredFavourites.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    Không tìm thấy khóa học nào
                                </h3>
                                <p className="text-gray-500">
                                    Thử tìm kiếm với từ khóa khác
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredFavourites.map((course, index) => (
                                    <CourseItem
                                        key={course.courseId || index}
                                        course={course}
                                        onRemove={handleRemoveFavourite}
                                        onView={handleViewCourse}
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

export default Favourites;