import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TopicDetails = () => {
    const [sections, setSections] = useState([]);
    const [coursesBySection, setCoursesBySection] = useState({});
    const [openSection, setOpenSection] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('All levels');
    const [filter, setFilter] = useState("No filter");
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const topicId = queryParams.get('topicId');
    const topicType = queryParams.get('type');

    const progressColors = ['bg-blue-600', 'bg-green-600', 'bg-yellow-500', 'bg-purple-600', 'bg-red-500', 'bg-pink-500', 'bg-indigo-500'];

    useEffect(() => {
        fetchSectionsAndCourses();
    }, [topicId, selectedLevel]);

    const fetchSectionsAndCourses = async () => {
        if (!topicId) return;

        try {
            let fetchedSections = [];
            let fetchedCoursesBySection = {};

            if (selectedLevel === 'All levels') {
                // Lấy tất cả section theo topicId
                const sectionRes = await axios.get(`http://localhost:8080/api/show-all-section?topicId=${topicId}`);
                if (sectionRes.data.code === 200) {
                    fetchedSections = sectionRes.data.result.map(section => ({
                        id: section.id,
                        title: section.name,
                        count: section.countOfCourse
                    }));

                    // Gọi từng section để lấy khóa học
                    for (const section of fetchedSections) {
                        const courseRes = await axios.get(`http://localhost:8080/api/show-all-course?sectionId=${section.id}`);
                        if (courseRes.data.code === 200) {
                            const courseList = courseRes.data.result.map(course => ({
                                id: course.id,
                                name: course.name,
                                level: course.level
                            }));
                            fetchedCoursesBySection[section.id] = courseList;
                        }
                    }
                }
            } else {
                // Gọi API lọc theo level
                const levelRes = await axios.get(`http://localhost:8080/api/search-level?level=${selectedLevel}`);
                if (levelRes.data.code === 200) {
                    fetchedSections = levelRes.data.result.map(section => ({
                        id: section.id,
                        title: section.name,
                        count: section.countOfCourse
                    }));

                    // Gọi từng section để lấy khóa học
                    for (const section of fetchedSections) {
                        const courseRes = await axios.get(`http://localhost:8080/api/show-all-course?sectionId=${section.id}`);
                        if (courseRes.data.code === 200) {
                            const filteredCourses = courseRes.data.result
                                .filter(course => course.level === selectedLevel)
                                .map(course => ({
                                    id: course.id,
                                    name: course.name,
                                    level: course.level
                                }));
                            fetchedCoursesBySection[section.id] = filteredCourses;
                        }
                    }
                }
            }

            setSections(fetchedSections);
            setCoursesBySection(fetchedCoursesBySection);
            setOpenSection(null);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    const splitIntoColumns = (items, columns = 3) => {
        const colLength = Math.ceil(items.length / columns);
        return Array.from({ length: columns }, (_, i) =>
            items.slice(i * colLength, (i + 1) * colLength)
        );
    };

    const handleToggleSection = (sectionId) => {
        setOpenSection(openSection === sectionId ? null : sectionId);
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold">{topicType}</h1>
                <div className="flex gap-4 items-center w-full sm:w-auto">

                    <select
                        className="border px-4 py-2 rounded text-sm"
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
                        className="border px-4 py-2 rounded text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option>No filter</option>
                        <option>Favorites</option>
                    </select>
                    <button className="bg-gray-600 text-white px-6 py-2 rounded text-sm"
                            onClick={fetchSectionsAndCourses}>
                        OK
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {sections
                    .filter(section => (selectedLevel === 'All levels' || coursesBySection[section.id]?.length))
                    .map(section => (
                        <div key={section.id}>
                            <div
                                className="border rounded px-6 py-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition"
                                onClick={() => handleToggleSection(section.id)}
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

                            {openSection === section.id && (
                                <div className="flex gap-6 mt-4">
                                    {splitIntoColumns(coursesBySection[section.id] || []).map((column, colIndex) => (
                                        <div key={colIndex} className="flex flex-col gap-4 flex-1">
                                            {column.map((course, index) => {
                                                const globalIndex = colIndex * Math.ceil((coursesBySection[section.id]?.length || 0) / 3) + index;
                                                const colorClass = progressColors[globalIndex % progressColors.length];
                                                const progressPercent = 20 + (globalIndex * 13) % 60;

                                                return (
                                                    <div
                                                        key={course.id}
                                                        className="border p-4 rounded cursor-pointer hover:bg-gray-100"
                                                        onClick={() => navigate(`/dictation?courseId=${course.id}`)}
                                                    >
                                                        <h3 className="font-semibold text-lg">{course.name}</h3>
                                                        <div className="text-sm text-gray-600 mt-2">
                                                            <div>Parts: 20</div>
                                                            <div>Vocab Level: {course.level}</div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                                <div
                                                                    className={`${colorClass} h-3 rounded-full`}
                                                                    style={{ width: `${progressPercent}%` }}
                                                                />
                                                            </div>
                                                        </div>
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
