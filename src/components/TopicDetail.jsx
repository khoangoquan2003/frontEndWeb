// TopicDetail.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

const sections = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Section ${i + 1}`,
    lessons: 20
}));

export default function TopicDetail() {
    const { id } = useParams();
    const [expanded, setExpanded] = useState(null);
    const [search, setSearch] = useState('');
    const [level, setLevel] = useState('');
    const [filter, setFilter] = useState('');

    const toggleSection = (sectionId) => {
        setExpanded(expanded === sectionId ? null : sectionId);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Short Stories</h1>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="border px-2 py-1 rounded"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="border px-2 py-1 rounded"
                    value={level}
                    onChange={e => setLevel(e.target.value)}
                >
                    <option value="">All levels</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                </select>
                <select
                    className="border px-2 py-1 rounded"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <option value="">No filter</option>
                    <option value="favorites">Favorites</option>
                    <option value="inProgress">In progress</option>
                </select>
                <button className="px-4 py-1 bg-gray-500 text-white rounded">OK</button>
            </div>

            <div className="space-y-2">
                {sections.map(section => (
                    <div key={section.id} className="border rounded-xl p-3">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection(section.id)}
                        >
                            <span className="font-bold text-lg">{section.title}</span>
                            <span className="flex items-center gap-2">
                <span className="text-sm">{section.lessons}</span>
                <Star size={16} className="text-gray-400" />
                                {expanded === section.id ? <ChevronUp /> : <ChevronDown />}
              </span>
                        </div>
                        {expanded === section.id && (
                            <div className="mt-2 p-2 bg-gray-100 rounded">
                                {/* 👇 Sau này chèn danh sách bài nghe ở đây */}
                                List of dictation lessons for {section.title}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}