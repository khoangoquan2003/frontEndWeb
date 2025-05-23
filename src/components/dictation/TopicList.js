import React from 'react';
import { Link } from 'react-router-dom';

const topics = [
    { title: "Short Stories", level: "A1–C1", lessons: 289, icon: "/imgs/1.1.jpg", link: "/topic-details", type: "audio" },
    { title: "Conversations", level: "A1–B1", lessons: 100, icon: "/imgs/1.2.jpg", link: "/topic-details", type: "audio" },
    { title: "Stories for Kids", level: "A2–B2", lessons: 13, icon: "/imgs/1.3.jpeg", link: "/topic-details", type: "video" },
    { title: "TOEIC Listening", level: "A2–C1", lessons: 600, icon: "/imgs/1.4.jpg", link: "/topic-details", type: "audio" },
    { title: "IELTS Listening", level: "B1–C2", lessons: 328, icon: "/imgs/1.5.jpg", link: "/topic-details", type: "audio" },
    { title: "YouTube", level: "B1–C2", lessons: 164, icon: "/imgs/1.6.jpg", link: "/topic-details", type: "video" },
    { title: "News", level: "B1–C1", lessons: 144, icon: "/imgs/1.1.jpg", link: "/topic-details", type: "audio" },
    { title: "TED", level: "C1–C2", lessons: 76, icon: "/imgs/1.2.jpg", link: "/topic-details", type: "video" },
    { title: "TOEFL Listening", level: "B1–C2", lessons: 54, icon: "/imgs/1.3.jpeg", link: "/topic-details", type: "audio" },
    { title: "IPA", level: "A1", lessons: 42, icon: "/imgs/1.4.jpg", link: "/topic-details", type: "audio" },
    { title: "Numbers", level: "A1", lessons: 9, icon: "/imgs/1.5.jpg", link: "/topic-details", type: "audio" },
    { title: "Spelling Names", level: "A1", lessons: 6, icon: "/imgs/1.6.jpg", link: "/topic-details", type: "audio" },
];


const TopicList = () => {
    return (
        <div className="py-12 bg-gray-100 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">All Topics</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topics.map((topic, index) => (
                        <Link
                            key={index}
                            to={topic.link}
                            className="bg-white shadow-lg p-6 rounded-xl flex items-center space-x-6 transition hover:shadow-xl hover:bg-gray-50"
                        >
                            <img src={topic.icon} alt={topic.title} className="w-20 h-20 rounded-md object-cover" />
                            <div>
                                <div className="text-xl font-semibold text-blue-700 hover:underline">
                                    {topic.title}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Levels: {topic.level}</p>
                                <div className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                                    <span>{topic.type === 'audio' ? '🎧' : '🎥'}</span>
                                    <span>{topic.lessons} lessons</span>
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
