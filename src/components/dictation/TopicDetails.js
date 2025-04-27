import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const TopicDetails = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("All levels");
    const [filter, setFilter] = useState("No filter");
    const navigate = useNavigate();

    const sections = Array.from({ length: 8 }, (_, i) => ({
        title: `Section ${i + 1}`,
        count: 20,
        id: i + 1, // sẽ dùng để truyền vào query
    }));

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Short Stories</h1>

            {/* 🔍 Search & Filters */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Search"
                    className="border px-3 py-2 rounded w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border px-3 py-2 rounded"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    <option>All levels</option>
                    <option>A1</option>
                    <option>A2</option>
                    <option>B1</option>
                    <option>B2</option>
                    <option>C1</option>
                </select>
                <select
                    className="border px-3 py-2 rounded"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option>No filter</option>
                    <option>Favorites</option>
                </select>
                <button className="bg-gray-500 text-white px-4 py-2 rounded">
                    OK
                </button>
            </div>

            {/* 📚 Section List */}
            <div className="space-y-3">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="border rounded px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition"
                        onClick={() => navigate(`/dictation?courseId=${section.id}`)}
                    >
                        <div className="font-semibold text-lg">
                            {section.title}{" "}
                            <span className="text-sm font-normal ml-2 text-gray-500">
                                {section.count}
                                <FaStar className="inline ml-1 text-yellow-400" />
                            </span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopicDetails;
