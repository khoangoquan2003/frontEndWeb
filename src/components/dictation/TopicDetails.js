import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const TopicDetails = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("All levels");
    const [filter, setFilter] = useState("No filter");
    const [openSection, setOpenSection] = useState(null); // To control dropdown visibility
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

    const chunkTopics = (topics) => {
        const chunks = [];
        for (let i = 0; i < topics.length; i += 7) {
            chunks.push(topics.slice(i, i + 7));
        }
        return chunks;
    };

    return (
        <div className="p-8">
            {/* Title and search form on the same line */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold">Short Stories</h1>

                {/* 🔍 Search & Filters */}
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

            {/* 📚 Section List */}
            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.id}>
                        {/* Section */}
                        <div
                            className="border rounded px-6 py-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition"
                            onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                        >
                            <div className="font-semibold text-2xl">
                                {section.title}{" "}
                                <span className="text-sm font-normal ml-2 text-gray-500">
                                    {section.count}
                                    <FaStar className="inline ml-1 text-yellow-400" />
                                </span>
                            </div>
                            <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                        </div>

                        {/* Dropdown Topics */}
                        {openSection === section.id && (
                            <div className="mt-4 space-y-4">
                                {chunkTopics(section.topics).map((topicRow, rowIndex) => (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" key={rowIndex}>
                                        {topicRow.map((topic, index) => (
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

                                                {/* Thanh tiến trình trong bài "First snowfall" */}
                                                {topic === "First snowfall" && (
                                                    <div className="mt-4">
                                                        <div className="text-sm text-gray-600 mb-2">Progress for "First snowfall"</div>
                                                        <div className="relative pt-1">
                                                            <div className="flex mb-2 items-center justify-between">
                                                                <div>
                                                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase">
                                                                        50% Completed
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex mb-2">
                                                                <div className="w-full bg-gray-200 rounded-full">
                                                                    <div
                                                                        className="bg-blue-600 text-xs leading-none py-1 text-center text-white rounded-full"
                                                                        style={{ width: "50%" }}
                                                                    >
                                                                        {/* You can change the percentage value dynamically */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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
