// DictationList.jsx
import React, { useState } from 'react';

const sampleDictations = [
    {
        id: 1,
        title: 'Lesson 1 - Morning Routine',
        transcript: 'I wake up at 7 am every day...',
        audioUrl: 'https://example.com/audio1.mp3'
    },
    {
        id: 2,
        title: 'Lesson 2 - At the Market',
        transcript: 'The market is crowded and noisy...',
        audioUrl: 'https://example.com/audio2.mp3'
    }
];

export default function DictationList() {
    const [dictations, setDictations] = useState(sampleDictations);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', transcript: '', audioUrl: '' });

    const handleAddNew = () => {
        if (!formData.title || !formData.transcript || !formData.audioUrl) {
            alert('Please fill all fields!');
            return;
        }
        const newDictation = {
            id: dictations.length + 1,
            ...formData
        };
        setDictations([...dictations, newDictation]);
        setFormData({ title: '', transcript: '', audioUrl: '' });
        setShowForm(false);
    };

    return (
        <div style={{ padding: '20px', marginLeft: '16rem' }}> {/* Thêm margin-left để tránh bị che khuất bởi sidebar */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold mb-6">🧠 DailyDict Admin</h2>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setShowForm(true)}
                    >
                        + Add New
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dictations.map(dict => (
                        <div key={dict.id} className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="font-semibold text-xl mb-3">{dict.title}</h3>
                            <audio controls src={dict.audioUrl} className="w-full mb-4" />
                            <p className="text-sm"><strong>Transcript:</strong> {dict.transcript}</p>
                            <div className="mt-4 flex space-x-4">
                                <button
                                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
                                    onClick={() => alert("Edit feature coming soon")}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                                    onClick={() => alert("Delete feature coming soon")}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showForm && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
                            <h3 className="text-xl font-semibold mb-6">Add New Dictation</h3>
                            <label className="block mb-2 text-sm font-medium">Title:</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="block mb-2 text-sm font-medium">Transcript:</label>
                            <textarea
                                value={formData.transcript}
                                onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                            <label className="block mb-2 text-sm font-medium">Audio URL:</label>
                            <input
                                type="text"
                                value={formData.audioUrl}
                                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={handleAddNew}
                                    className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
