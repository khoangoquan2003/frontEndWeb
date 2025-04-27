import React from 'react';
import { Link } from 'react-router-dom';

const topics = [
    {
        title: "Short Stories",
        level: "A1–C1",
        lessons: 289,
        icon: "https://img.icons8.com/color/96/stories.png", // bạn thay bằng ảnh gốc nếu có
        link: "/topic-details",
        type: "audio"
    },
    {
        title: "TOEIC Listening",
        level: "A2–C1",
        lessons: 600,
        icon: "https://img.icons8.com/color/96/toeic.png",
        link: "/topics/toeic",
        type: "audio"
    },
    {
        title: "Stories for Kids",
        level: "A2–B2",
        lessons: 13,
        icon: "https://img.icons8.com/color/96/fairy-tale.png",
        link: "/topics/kids",
        type: "video"
    },
    {
        title: "TED",
        level: "C1–C2",
        lessons: 71,
        icon: "https://img.icons8.com/color/96/ted.png",
        link: "/topics/ted",
        type: "video"
    },
    {
        title: "Numbers",
        level: "A1",
        lessons: 9,
        icon: "https://img.icons8.com/color/96/numbers.png",
        link: "/topics/numbers",
        type: "audio"
    },
    // Thêm các topic khác ở đây...
];

const TopicList = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">All Topics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic, index) => (
                    <div key={index} className="bg-white shadow-md p-4 rounded-lg flex items-center space-x-4">
                        <img src={topic.icon} alt={topic.title} className="w-16 h-16 rounded-md" />
                        <div>
                            <Link to={topic.link} className="text-lg font-bold text-blue-600 hover:underline">{topic.title}</Link>
                            <p className="text-sm text-gray-600">Levels: {topic.level}</p>
                            <div className="text-sm text-gray-500 flex items-center space-x-1">
                                {topic.type === 'audio' ? (
                                    <span>🎧</span>
                                ) : (
                                    <span>🎥</span>
                                )}
                                <span>{topic.lessons} lessons</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopicList;
