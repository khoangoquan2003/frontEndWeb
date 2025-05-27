import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TopicList = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/show-all-topic")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Lỗi khi gọi API");
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data.result)) {
                    setTopics(data.result);
                } else {
                    throw new Error("Dữ liệu không đúng định dạng");
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="py-12 bg-gray-100 min-h-screen flex justify-center items-center">
                <p className="text-gray-600 text-xl">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 bg-gray-100 min-h-screen flex justify-center items-center">
                <p className="text-red-600 text-xl">Lỗi: {error}</p>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gray-100 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">All Topics</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topics.map((topic, index) => (
                        <Link
                            key={index}
                            to={`/topic-details?topicId=${topic.id}&type=${topic.type}`}
                            className="bg-white shadow-lg p-6 rounded-xl flex items-center space-x-6 transition hover:shadow-xl"
                        >
                            <img
                                src={topic.img}
                                alt={topic.type}
                                className="w-20 h-20 rounded-md object-cover"
                            />
                            <div>
                                <h3 className="text-xl font-semibold text-blue-700">{topic.type}</h3>
                                <p className="text-sm text-gray-600 mt-1">Levels: {topic.level}</p>
                                <div className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                                    <span>{topic.type === 'audio' ? '🎧' : '🎧'}</span>
                                    <span>{topic.countTopic} lessons</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopicList;
