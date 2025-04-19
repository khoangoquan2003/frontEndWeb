// TopicList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const topics = [
    {
        id: 1,
        title: 'Short Stories',
        levels: 'A1–C1',
        lessons: 289,
        icon: '📘'
    },
    {
        id: 2,
        title: 'Conversations',
        levels: 'A1–B1',
        lessons: 100,
        icon: '🗣️'
    },
    {
        id: 3,
        title: 'Stories for Kids',
        levels: 'A2–B2',
        lessons: 13,
        icon: '👶'
    },
    // Add more topics as needed...
];

export default function TopicList() {
    const navigate = useNavigate();

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">All topics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map(topic => (
                    <div
                        key={topic.id}
                        className="border p-4 rounded-xl shadow hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/topics/${topic.id}`)}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="text-4xl">{topic.icon}</div>
                            <div>
                                <h2 className="text-xl font-semibold text-blue-600 hover:underline">{topic.title}</h2>
                                <p className="text-sm text-gray-500">Levels: {topic.levels}</p>
                                <p className="text-sm">📘 {topic.lessons} lessons</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


