import React, { useEffect, useState } from 'react';
import { http } from '../api/Http';

export default function DictationList() {
    const [dictations, setDictations] = useState([]);
    const [sectionsByTopic, setSectionsByTopic] = useState({});
    const [loadingDictations, setLoadingDictations] = useState(false);
    const [loadingSections, setLoadingSections] = useState({});

    useEffect(() => {
        fetchDictations();
    }, []);

    const fetchDictations = async () => {
        setLoadingDictations(true);
        try {
            const response = await http.get('/api/show-all-topic');
            if (response.data.code === 200 && Array.isArray(response.data.result)) {
                setDictations(response.data.result);
            } else {
                console.warn('Unexpected API response', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch dictations', error);
        }
        setLoadingDictations(false);
    };

    const fetchSectionsForTopic = async (topicId) => {
        if (sectionsByTopic[topicId]) return;

        setLoadingSections((prev) => ({ ...prev, [topicId]: true }));
        try {
            const response = await http.get('/api/show-all-section', {
                params: { topicId },
            });
            if (response.data.code === 200 && Array.isArray(response.data.result)) {
                setSectionsByTopic((prev) => ({
                    ...prev,
                    [topicId]: response.data.result,
                }));
            } else {
                console.warn('Unexpected section API response', response.data);
            }
        } catch (error) {
            console.error(`Failed to fetch sections for topic ${topicId}`, error);
        }
        setLoadingSections((prev) => ({ ...prev, [topicId]: false }));
    };

    const handleDropdownFocus = (topicId) => {
        fetchSectionsForTopic(topicId);
    };

    return (
        <div style={{ padding: '20px', marginLeft: '16rem' }}>
            <h2 className="text-2xl font-semibold mb-6">🧠 DailyDict Admin</h2>

            {loadingDictations ? (
                <p>Loading topics...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dictations.map((topic) => {
                        console.log('Topic data:', topic); // <-- log dữ liệu từng topic ở đây
                        return (
                            <div key={topic.id} className="bg-white p-6 rounded-lg shadow-lg">
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

                                {/* Phần dropdown, nút Edit/Delete giữ nguyên */}
                                <label htmlFor={`section-select-${topic.id}`} className="block mb-2 font-medium">
                                    Sections:
                                </label>

                                <select
                                    id={`section-select-${topic.id}`}
                                    className="w-full p-2 border rounded"
                                    onFocus={() => handleDropdownFocus(topic.id)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        {loadingSections[topic.id] ? 'Loading sections...' : 'Select a section'}
                                    </option>

                                    {sectionsByTopic[topic.id] &&
                                        sectionsByTopic[topic.id].map((section) => (
                                            <option key={section.id} value={section.id}>
                                                {section.name} (Courses: {section.countOfCourse})
                                            </option>
                                        ))}
                                </select>

                                <div className="mt-4 flex space-x-4">
                                    <button
                                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
                                        onClick={() => alert('Edit feature coming soon')}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                                        onClick={() => alert('Delete feature coming soon')}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
