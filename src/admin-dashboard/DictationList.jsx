import React, { useEffect, useState } from 'react';
import { http } from '../api/Http';
import { useNavigate } from 'react-router-dom';
import AddTopicForm from '../admin-form/AddTopicForm';
import AddCourseForm from '../admin-form/AddCourseForm';

export default function DictationList() {
    // === State chính ===
    const [topics, setTopics] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const navigate = useNavigate();
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

    // Modal tạo topic mới
    const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
    const [newTopic, setNewTopic] = useState({
        type: '',
        level: '',
        countTopic: '',
        image: null,
    });
    const [submittingTopic, setSubmittingTopic] = useState(false);
    const [courseCounts, setCourseCounts] = useState({});

    // Modal chi tiết topic
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [activeTab, setActiveTab] = useState('info'); // info | sections | courses

    // Data Sections và Courses trong modal detail
    const [sections, setSections] = useState([]);
    const [loadingSections, setLoadingSections] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);

    // Thêm section mới cho topic đang chọn
    const [submittingSection, setSubmittingSection] = useState(false);

    // === Fetch topics khi component mount ===
    useEffect(() => {
        loadTopics();
    }, []);

    async function loadTopics() {
        setLoadingTopics(true);
        try {
            const res = await http.get('/api/show-all-topic');
            if (res.data.code === 200 && Array.isArray(res.data.result)) {
                setTopics(res.data.result);
            } else {
                console.warn('API trả về dữ liệu không đúng', res.data);
            }
        } catch (error) {
            console.error('Lỗi tải danh sách topics', error);
        }
        setLoadingTopics(false);
    }

    // === Modal Detail Topic ===
    const openDetailModal = (topic) => {
        setSelectedTopic(topic);
        setActiveTab('info');
        setSelectedSection(null);
        setCourses([]);
        fetchSections(topic.id);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedTopic(null);
        setSections([]);
        setSelectedSection(null);
        setCourses([]);
    };

    async function fetchSections(topicId) {
        setLoadingSections(true);
        try {
            const res = await http.get('/api/show-all-section', { params: { topicId } });
            if (res.data.code === 200 && Array.isArray(res.data.result)) {
                const loadedSections = res.data.result;
                setSections(loadedSections);

                // Gọi API đếm course cho từng section
                const counts = {};
                await Promise.all(
                    loadedSections.map(async (section) => {
                        try {
                            const resCourse = await http.get('/api/show-all-course', { params: { sectionId: section.id } });
                            counts[section.id] = Array.isArray(resCourse.data.result) ? resCourse.data.result.length : 0;
                        } catch {
                            counts[section.id] = 0;
                        }
                    })
                );
                setCourseCounts(counts);
            } else {
                setSections([]);
            }
        } catch (error) {
            console.error('Lỗi tải sections', error);
            setSections([]);
        }
        setLoadingSections(false);
    }

// Gọi API lấy danh sách course theo section
    async function fetchCourses(sectionId) {
        setLoadingCourses(true);
        try {
            const res = await http.get('/api/show-all-course', {
                params: { sectionId },
            });

            if (res.data.code === 200 && Array.isArray(res.data.result)) {
                setCourses(res.data.result);
            } else {
                setCourses([]);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách course:', error);
            setCourses([]);
        }
        setLoadingCourses(false);
    }

    const onSelectSection = async (section) => {
        setSelectedSection(section);
        setCourses([]); // reset courses
        setLoadingCourses(true);
        try {
            const res = await http.get('/api/show-all-course', { params: { sectionId: section.id } });
            if (res.data.code === 200 && Array.isArray(res.data.result)) {
                setCourses(res.data.result);
            } else {
                setCourses([]);
            }
        } catch (err) {
            console.error('Lỗi tải courses:', err);
            setCourses([]);
        }
        setLoadingCourses(false);
        setActiveTab('courses');
    };

    const onNewTopicChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setNewTopic(prev => ({ ...prev, image: files[0] }));
        } else {
            setNewTopic(prev => ({ ...prev, [name]: value }));
        }
    };

    const submitNewTopic = async (e) => {
        e.preventDefault();
        setSubmittingTopic(true);

        try {
            const formData = new FormData();
            formData.append('type', newTopic.type);
            formData.append('level', newTopic.level);
            formData.append('countTopic', newTopic.countTopic);
            formData.append('image', newTopic.image);

            const res = await http.post('/api/create-topic', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data?.result) {
                loadTopics();
                setIsAddTopicModalOpen(false);
                setNewTopic({ type: '', level: '', countTopic: '', image: null });
            } else {
                alert('Tạo khóa học thất bại!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi khi gửi form!');
        }

        setSubmittingTopic(false);
    };

    const handleAutoCreateSection = async () => {
        if (!selectedTopic) return alert('Chưa chọn topic!');
        setSubmittingSection(true);
        try {
            const nextNumber = sections.length + 1;
            const payload = {
                name: `Section ${nextNumber}`,
                countOfCourse: 0,
                topicId: selectedTopic.id
            };
            const res = await http.post('/api/create-section', payload);
            if (res.data?.result) {
                const newSec = res.data.result;
                setSections(prev => [...prev, newSec]);

                // Load course count cho section mới
                try {
                    const resCourses = await http.get('/api/show-all-course', {
                        params: { sectionId: newSec.id }
                    });
                    const count = Array.isArray(resCourses.data.result) ? resCourses.data.result.length : 0;
                    setCourseCounts(prev => ({ ...prev, [newSec.id]: count }));
                } catch {
                    setCourseCounts(prev => ({ ...prev, [newSec.id]: 0 }));
                }

                alert('Tạo section thành công!');
            } else {
                alert('Tạo section thất bại!');
            }
        } catch (err) {
            console.error('Lỗi khi tạo section:', err);
            alert('Lỗi khi tạo section!');
        }
        setSubmittingSection(false);
    };
    const handleDeleteTopic = async (e, topicId) => {
        e.stopPropagation(); // Ngăn việc mở modal detail

        if (!window.confirm('Bạn có chắc chắn muốn xoá topic này?')) return;

        try {
            await http.delete(`/api/delete-topic/${topicId}`);
            alert('Xoá topic thành công!');
            loadTopics(); // Reload danh sách sau khi xoá
        } catch (error) {
            console.error('Lỗi khi xoá topic:', error);
            alert('Xoá topic thất bại!');
        }
    };

    const handleDeleteSection = async (e, sectionId) => {
        e.stopPropagation(); // Không trigger chọn section
        if (!window.confirm('Bạn có chắc chắn muốn xoá section này?')) return;

        try {
            await http.delete(`/api/delete-section/${sectionId}`);
            alert('Xoá section thành công!');
            // Xoá section khỏi state
            setSections(prev => prev.filter(section => section.id !== sectionId));
            // Xoá đếm course nếu có
            setCourseCounts(prev => {
                const updated = { ...prev };
                delete updated[sectionId];
                return updated;
            });
            // Nếu section đang xem bị xoá
            if (selectedSection?.id === sectionId) {
                setSelectedSection(null);
                setCourses([]);
            }
        } catch (error) {
            console.error('Lỗi khi xoá section:', error);
            alert('Xoá section thất bại!');
        }
    };

    return (
        <div style={{ padding: 20, marginLeft: '16rem' }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">🧠 DailyDict Admin</h2>
                <button
                    onClick={() => setIsAddTopicModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    ➕ Add New Topic
                </button>
            </div>

            {/* Danh sách topic */}
            {loadingTopics ? (
                <p>Đang tải danh sách khóa học...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topics.map(topic => (
                        <div
                            key={topic.id}
                            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
                            onClick={() => openDetailModal(topic)}
                        >
                            {topic.img && (
                                <img
                                    src={topic.img}
                                    alt={topic.title || `Topic #${topic.id}`}
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                />
                            )}
                            <h3 className="font-semibold text-xl mb-3">
                                {topic.type || topic.title || `Topic #${topic.id}`}
                            </h3>
                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={e => { e.stopPropagation(); alert('Edit feature coming soon'); }}
                                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => handleDeleteTopic(e, topic.id)}

                                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isAddTopicModalOpen && (
                <AddTopicForm
                    newTopic={newTopic}
                    onNewTopicChange={onNewTopicChange}
                    submitNewTopic={submitNewTopic}
                    submittingTopic={submittingTopic}
                    onCancel={() => setIsAddTopicModalOpen(false)}
                />
            )}


            {/* Modal chi tiết topic */}
            {isDetailModalOpen && selectedTopic && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end"
                    onClick={closeDetailModal}
                >
                    <div
                        className="bg-white w-full max-w-xl h-full shadow-lg p-6 overflow-auto"
                        style={{ maxHeight: '100vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header modal */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                                {selectedTopic.type || selectedTopic.title || `Topic #${selectedTopic.id}`}
                            </h3>
                            <button
                                onClick={closeDetailModal}
                                className="text-gray-600 hover:text-gray-900 font-bold text-2xl leading-none"
                                aria-label="Close modal"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-300 mb-4">
                            <nav className="flex space-x-4">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`pb-2 ${activeTab === 'info' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Thông tin Topic
                                </button>
                                <button
                                    onClick={() => setActiveTab('sections')}
                                    className={`pb-2 ${activeTab === 'sections' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Sections
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedSection) setActiveTab('courses');
                                        else alert('Vui lòng chọn một section trước');
                                    }}
                                    className={`pb-2 ${activeTab === 'courses' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Courses
                                </button>
                            </nav>
                        </div>

                        {/* Nội dung tab */}
                        <div>
                            {activeTab === 'info' && (
                                <div>
                                    <p><strong>Loại khóa học:</strong> {selectedTopic.type || 'Không có'}</p>
                                    <p><strong>Trình độ:</strong> {selectedTopic.level || 'Không có'}</p>
                                    <p><strong>Số lượng section:</strong> {sections.length}</p>
                                    {selectedTopic.img && (
                                        <img src={selectedTopic.img} alt="Topic" className="w-full max-h-48 object-cover rounded mt-4" />
                                    )}
                                </div>
                            )}

                            {activeTab === 'sections' && (
                                <div>
                                    {loadingSections ? (
                                        <p>Đang tải sections...</p>
                                    ) : sections.length === 0 ? (
                                        <p>Không có section nào cho topic này.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {sections.map(section => (
                                                <li
                                                    key={section.id}
                                                    className={`p-3 border rounded cursor-pointer flex justify-between items-center ${selectedSection?.id === section.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                                    onClick={() => onSelectSection(section)}
                                                >
                                                    <div>
                                                        <strong>{section.name}</strong> — Số khóa học: {courseCounts[section.id] ?? '...'}
                                                    </div>
                                                    <button
                                                        className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                                                        onClick={(e) => handleDeleteSection(e, section.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                    )}

                                    {/* Form thêm section */}
                                    <button
                                        onClick={handleAutoCreateSection}
                                        disabled={submittingSection}
                                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        {submittingSection ? 'Đang tạo...' : '➕ Thêm Section mới'}
                                    </button>

                                </div>
                            )}

                            {activeTab === 'courses' && (
                                <div>
                                    {selectedSection ? (
                                        <>
                                            <h4 className="font-semibold mb-3">Courses của Section: {selectedSection.name}</h4>
                                            {loadingCourses ? (
                                                <p>Đang tải courses...</p>
                                            ) : courses.length === 0 ? (
                                                <p>Không có course nào cho section này.</p>
                                            ) : (
                                                <ul className="space-y-2">
                                                    {courses.map(course => (
                                                        <li
                                                            key={course.id}
                                                            onClick={() => navigate(`/admin/course/${course.id}`)}
                                                            className="cursor-pointer border p-3 rounded hover:bg-gray-100"
                                                        >
                                                            <strong>{course.name}</strong> — Level: {course.level}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <button
                                                onClick={() => setIsAddCourseModalOpen(true)}
                                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                ➕ Thêm Course mới
                                            </button>

                                            {isAddCourseModalOpen && (
                                                <AddCourseForm
                                                    sectionId={selectedSection.id}
                                                    onSuccess={() => {
                                                        fetchCourses(selectedSection.id);
                                                        setCourseCounts(prev => ({
                                                            ...prev,
                                                            [selectedSection.id]: (prev[selectedSection.id] || 0) + 1,
                                                        }));
                                                    }}
                                                    onCancel={() => setIsAddCourseModalOpen(false)}
                                                />
                                            )}

                                        </>
                                    ) : (
                                        <p>Vui lòng chọn một section trong tab Sections trước.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
