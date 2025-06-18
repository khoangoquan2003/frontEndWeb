import { useEffect, useState, useCallback } from 'react';
import { FaStar, FaSearch, FaFilter, FaBook, FaGraduationCap } from 'react-icons/fa';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import {http} from "../../api/Http";
const TopicDetails = () => {
    const [sections, setSections] = useState([]);
    const [coursesBySection, setCoursesBySection] = useState({});
    const [openSection, setOpenSection] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('All levels');
    const [filter, setFilter] = useState("No filter");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCourses, setTotalCourses] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const topicId = queryParams.get('topicId');
    const topicType = queryParams.get('type');

    const progressColors = [
        'bg-blue-600', 'bg-green-600', 'bg-yellow-500', 'bg-purple-600',
        'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];

    const levels = ['All levels', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const filterOptions = ['No filter', 'Favorites', 'Completed', 'In Progress'];

    useEffect(() => {
        if (topicId) {
            fetchSectionsAndCourses();
        }
    }, [topicId, selectedLevel]);

    const fetchSectionsAndCourses = useCallback(async () => {
        if (!topicId) return;

        try {
            setLoading(true);
            setError(null);

            let fetchedSections = [];
            let fetchedCoursesBySection = {};
            let courseCount = 0;

            if (selectedLevel === 'All levels') {
                // Lấy tất cả section theo topicId
                const sectionRes = await http.get(`http://localhost:8080/api/show-all-section?topicId=${topicId}`);

                if (sectionRes.data.code === 200) {
                    fetchedSections = sectionRes.data.result.map(section => ({
                        id: section.id,
                        title: section.name,
                        count: section.countOfCourse,
                        description: section.description || `Khám phá ${section.countOfCourse} khóa học trong chủ đề này`
                    }));

                    // Gọi từng section để lấy khóa học
                    for (const section of fetchedSections) {
                        try {
                            const courseRes = await http.get(`http://localhost:8080/api/show-all-course?sectionId=${section.id}`);
                            if (courseRes.data.code === 200) {
                                const courseList = courseRes.data.result.map(course => ({
                                    id: course.id,
                                    name: course.name,
                                    level: course.level,
                                    parts: course.parts || 20,
                                    completed: course.completed || false,
                                    progress: course.progress || Math.floor(Math.random() * 100)
                                }));
                                fetchedCoursesBySection[section.id] = courseList;
                                courseCount += courseList.length;
                            }
                        } catch (courseError) {
                            console.warn(`Không thể tải khóa học cho section ${section.id}:`, courseError);
                            fetchedCoursesBySection[section.id] = [];
                        }
                    }
                }
            } else {
                // Gọi API lọc theo level
                const levelRes = await http.get(`http://localhost:8080/api/search-level?level=${selectedLevel}`);

                if (levelRes.data.code === 200) {
                    fetchedSections = levelRes.data.result.map(section => ({
                        id: section.id,
                        title: section.name,
                        count: section.countOfCourse,
                        description: section.description || `Khám phá các khóa học cấp độ ${selectedLevel}`
                    }));

                    // Gọi từng section để lấy khóa học
                    for (const section of fetchedSections) {
                        try {
                            const courseRes = await http.get(`http://localhost:8080/api/show-all-course?sectionId=${section.id}`);
                            if (courseRes.data.code === 200) {
                                const filteredCourses = courseRes.data.result
                                    .filter(course => course.level === selectedLevel)
                                    .map(course => ({
                                        id: course.id,
                                        name: course.name,
                                        level: course.level,
                                        parts: course.parts || 20,
                                        completed: course.completed || false,
                                        progress: course.progress || Math.floor(Math.random() * 100)
                                    }));
                                fetchedCoursesBySection[section.id] = filteredCourses;
                                courseCount += filteredCourses.length;
                            }
                        } catch (courseError) {
                            console.warn(`Không thể tải khóa học cho section ${section.id}:`, courseError);
                            fetchedCoursesBySection[section.id] = [];
                        }
                    }
                }
            }

            setSections(fetchedSections);
            setCoursesBySection(fetchedCoursesBySection);
            setTotalCourses(courseCount);
            setOpenSection(null);

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, [topicId, selectedLevel]);

    const splitIntoColumns = (items, columns = 3) => {
        if (!items || items.length === 0) return Array(columns).fill([]);
        const colLength = Math.ceil(items.length / columns);
        return Array.from({ length: columns }, (_, i) =>
            items.slice(i * colLength, (i + 1) * colLength)
        );
    };

    const handleToggleSection = (sectionId) => {
        setOpenSection(openSection === sectionId ? null : sectionId);
    };

    const handleCourseClick = (course) => {
        navigate(`/dictation?courseId=${course.id}&courseName=${encodeURIComponent(course.name)}&level=${course.level}`);
    };

    const getFilteredSections = () => {
        return sections.filter(section => {
            const courses = coursesBySection[section.id] || [];

            // Filter by search term
            if (searchTerm) {
                const hasMatchingCourse = courses.some(course =>
                    course.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (!hasMatchingCourse && !section.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return false;
                }
            }

            // Filter by level
            if (selectedLevel !== 'All levels') {
                return courses.length > 0;
            }

            return true;
        });
    };

    // Loading Component
    const LoadingComponent = () => (
        <div className="flex justify-center items-center py-20">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Đang tải nội dung...</p>
            </div>
        </div>
    );

    // Error Component
    const ErrorComponent = () => (
        <div className="text-center py-20">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Đã xảy ra lỗi</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button
                onClick={fetchSectionsAndCourses}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
                Thử lại
            </button>
        </div>
    );

    // Course Card Component
    const CourseCard = ({ course, index, sectionId }) => {
        const globalIndex = index + (sectionId * 10); // Tạo index unique
        const colorClass = progressColors[globalIndex % progressColors.length];

        return (
            <div
                className="group border border-gray-200 p-5 rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300 bg-white"
                onClick={() => handleCourseClick(course)}
            >
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.name}
                    </h3>
                    {course.completed && (
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Hoàn thành
                        </div>
                    )}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                        <FaBook className="text-blue-500" />
                        <span>Số phần: {course.parts}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaGraduationCap className="text-purple-500" />
                        <span>Cấp độ: {course.level}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-medium text-gray-800">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${course.progress}%` }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <LoadingComponent />;
    if (error) return <ErrorComponent />;

    const filteredSections = getFilteredSections();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">{topicType}</h1>
                            <p className="text-gray-600">
                                Tổng cộng {totalCourses} khóa học • {filteredSections.length} chủ đề
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm khóa học..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Level Filter */}
                            <select
                                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                            >
                                {levels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>

                            {/* Additional Filter */}
                            <select
                                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                {filterOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {filteredSections.length > 0 ? (
                        filteredSections.map(section => {
                            const sectionCourses = coursesBySection[section.id] || [];
                            const isOpen = openSection === section.id;

                            return (
                                <div key={section.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    {/* Section Header */}
                                    <div
                                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
                                        onClick={() => handleToggleSection(section.id)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className="text-2xl font-bold text-gray-800">
                                                        {section.title}
                                                    </h2>
                                                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                                        <span>{section.count}</span>
                                                        <FaStar className="text-yellow-500" />
                                                    </div>
                                                </div>
                                                <p className="text-gray-600">{section.description}</p>
                                            </div>
                                            <div className="ml-4">
                                                {isOpen ? (
                                                    <ChevronDownIcon className="w-6 h-6 text-gray-600 transition-transform duration-200" />
                                                ) : (
                                                    <ChevronRightIcon className="w-6 h-6 text-gray-600 transition-transform duration-200" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Content */}
                                    {isOpen && (
                                        <div className="p-6">
                                            {sectionCourses.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {sectionCourses.map((course, index) => (
                                                        <CourseCard
                                                            key={course.id}
                                                            course={course}
                                                            index={index}
                                                            sectionId={section.id}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="text-4xl mb-4">📚</div>
                                                    <p className="text-gray-500">Chưa có khóa học nào trong phần này</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Không tìm thấy kết quả
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedLevel('All levels');
                                    setFilter('No filter');
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopicDetails;