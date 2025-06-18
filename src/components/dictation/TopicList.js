import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const TopicList = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm fetch dữ liệu được tách riêng để dễ quản lý
    const fetchTopics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("http://localhost:8080/api/show-all-topic");

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - Lỗi khi gọi API`);
            }

            const data = await response.json();

            if (!data || !Array.isArray(data.result)) {
                throw new Error("Dữ liệu không đúng định dạng hoặc không tồn tại");
            }

            setTopics(data.result);
        } catch (err) {
            console.error('Error fetching topics:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    // Component Loading
    const LoadingComponent = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-xl font-medium">Đang tải dữ liệu...</p>
                <p className="text-gray-500 text-sm mt-2">Vui lòng chờ trong giây lát</p>
            </div>
        </div>
    );

    // Component Error
    const ErrorComponent = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl">⚠️</span>
                </div>
                <h2 className="text-xl font-semibold text-red-600 mb-2">Đã xảy ra lỗi</h2>
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchTopics}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );

    // Component Topic Card
    const TopicCard = ({ topic, index }) => {
        const [imageError, setImageError] = useState(false);

        const handleImageError = () => {
            setImageError(true);
        };

        return (
            <Link
                key={topic.id || index}
                to={`/topic-details?topicId=${topic.id}&type=${encodeURIComponent(topic.type)}`}
                className="group bg-white shadow-lg hover:shadow-2xl p-6 rounded-2xl flex items-center space-x-6 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
                <div className="flex-shrink-0">
                    {!imageError ? (
                        <img
                            src={topic.img || "/placeholder.svg"}
                            alt={topic.type}
                            className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-2xl">🎧</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors duration-200 truncate">
                        {topic.type}
                    </h3>
                    <div className="mt-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            Levels: {topic.level}
                        </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center space-x-2 mt-3">
                        <span className="text-lg">🎧</span>
                        <span className="font-medium">{topic.countTopic} bài học</span>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors duration-200">
                        <span className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </div>
                </div>
            </Link>
        );
    };

    // Render loading state
    if (loading) {
        return <LoadingComponent />;
    }

    // Render error state
    if (error) {
        return <ErrorComponent />;
    }

    // Main render
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Tất cả chủ đề
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Khám phá các chủ đề học tập đa dạng và phong phú để nâng cao kiến thức của bạn
                    </p>
                    <div className="mt-6 flex justify-center">
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                            {topics.length} chủ đề có sẵn
                        </div>
                    </div>
                </div>

                {/* Topics Grid */}
                {topics.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {topics.map((topic, index) => (
                            <TopicCard key={topic.id || index} topic={topic} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Chưa có chủ đề nào
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Hiện tại chưa có chủ đề học tập nào được tải lên hệ thống
                        </p>
                        <button
                            onClick={fetchTopics}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            Tải lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicList;