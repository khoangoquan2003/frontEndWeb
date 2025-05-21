import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const TopicDetails = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("All levels");
    const [filter, setFilter] = useState("No filter");
    const [openSection, setOpenSection] = useState(null);
    const navigate = useNavigate();

    const sections = Array.from({ length: 8 }, (_, i) => ({
        title: `Section ${i + 1}`,
        count: 20,
        id: i + 1,
        topics: [
            "First snowfall",
            "Jessica's first day of school",
            "My flower garden",
            "Going camping",
            "My house",
            "My first pet",
            "Jennifer the firefighter",
            "Mark's big game",
            "The Easter Egg Hunt",
            "Joe's first car",
            "Summer vacation",
            "Cleaning up leaves",
            "Susan's wedding day",
            "Remembrance Day",
            "Halloween Night",
            "Christmas Eve",
            "Thanksgiving",
            "Learning how to drive",
            "Housework",
            "Working outside"
        ]
    }));

    const splitTopicsIntoColumns = (topics, columns = 3) => {
        const colLength = Math.ceil(topics.length / columns);
        return Array.from({ length: columns }, (_, i) =>
            topics.slice(i * colLength, (i + 1) * colLength)
        );
    };

    const progressColors = [
        'bg-blue-600',
        'bg-green-600',
        'bg-yellow-500',
        'bg-purple-600',
        'bg-red-500',
        'bg-pink-500',
        'bg-indigo-500'
    ];

    return (
        <div className="p-8">
            {/* Title and search form */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold">Short Stories</h1>
                <div className="flex gap-4 items-center w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border px-4 py-2 rounded text-sm flex-grow min-w-[150px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="border px-4 py-2 rounded text-sm flex-grow min-w-[120px]"
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
                        className="border px-4 py-2 rounded text-sm flex-grow min-w-[120px]"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option>No filter</option>
                        <option>Favorites</option>
                    </select>
                    <button className="bg-gray-600 text-white px-6 py-2 rounded text-sm">
                        OK
                    </button>
                </div>
            </div>

            {/* Section List */}
            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.id}>
                        {/* Section Header */}
                        <div
                            className="border rounded px-6 py-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition"
                            onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                        >
                            <div className="font-semibold text-2xl">
                                {section.title}
                                <span className="text-sm font-normal ml-2 text-gray-500">
                                    {section.count}
                                    <FaStar className="inline ml-1 text-yellow-400" />
                                </span>
                            </div>
                            <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                        </div>

                        {/* Dropdown Topics */}
                        {openSection === section.id && (
                            <div className="flex gap-6 mt-4">
                                {splitTopicsIntoColumns(section.topics).map((column, colIndex) => (
                                    <div key={colIndex} className="flex flex-col gap-4 flex-1">
                                        {column.map((topic, index) => {
                                            const globalIndex = colIndex * Math.ceil(section.topics.length / 3) + index;
                                            const colorClass = progressColors[globalIndex % progressColors.length];
                                            const progressPercent = 20 + (globalIndex * 13) % 60; // số % giả từ 20% đến 80%

                                            return (
                                                <div
                                                    key={index}
                                                    className={`border p-4 rounded cursor-pointer hover:bg-gray-100 ${topic === "First snowfall" ? 'bg-blue-50' : ''}`}
                                                    onClick={() => navigate(`/dictation?courseId=${section.id}`)}
                                                >
                                                    <h3 className="font-semibold text-lg">{topic}</h3>
                                                    <div className="text-sm text-gray-600 mt-2">
                                                        <div>Parts: 20</div>
                                                        <div>Vocab Level: A1</div>
                                                    </div>

                                                    {/* Progress bar for First snowfall */}
                                                    {true && (
                                                        <div className="mt-4">
                                                            <div className="relative pt-1">
                                                                <div className="flex mb-2">
                                                                    <div className="w-full bg-gray-200 rounded-full">
                                                                        <div
                                                                            className={`${colorClass} text-xs leading-none py-1 text-center text-white rounded-full`}
                                                                            style={{ width: `${progressPercent}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopicDetails;
