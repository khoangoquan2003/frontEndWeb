// src/admin-form/AddCourseForm.jsx
import React, { useState } from 'react';
import { http } from '../api/Http';

export default function AddCourseForm({ sectionId, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        countOfSentence: 0,
        mainAudio: null,
        sentences: [''],
        sentenceAudios: [],
        transcript: ''
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'mainAudio') {
            setFormData({ ...formData, mainAudio: files[0] });
        } else if (name.startsWith('sentenceAudio')) {
            const index = parseInt(name.split('-')[1]);
            const newAudios = [...formData.sentenceAudios];
            newAudios[index] = files[0];
            setFormData({ ...formData, sentenceAudios: newAudios });
        } else if (name.startsWith('sentence')) {
            const index = parseInt(name.split('-')[1]);
            const newSentences = [...formData.sentences];
            newSentences[index] = value;
            setFormData({ ...formData, sentences: newSentences });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addSentenceField = () => {
        setFormData({
            ...formData,
            sentences: [...formData.sentences, ''],
            sentenceAudios: [...formData.sentenceAudios, null],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('level', formData.level);
            data.append('countOfSentence', formData.sentences.length.toString());
            data.append('mainAudio', formData.mainAudio);
            data.append('transcript', formData.transcript);
            data.append('sectionId', sectionId);

            formData.sentences.forEach(s => data.append('sentence', s));
            formData.sentenceAudios.forEach(audio => data.append('sentenceAudio', audio));

            const res = await http.post('/api/create-course', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data?.result) {
                alert('Tạo course thành công!');
                onSuccess();
                onCancel(); // đóng modal
            } else {
                alert('Tạo course thất bại!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Lỗi khi tạo course!');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center" onClick={onCancel}>
            <div
                className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className="text-xl font-bold mb-4">➕ Thêm Course mới</h4>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Tên Course"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />

                    <select
                        name="level"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                        value={formData.level}
                    >
                        <option value="" disabled>-- Chọn Level --</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                    </select>

                    <label className="block mb-1 font-semibold">Main Audio</label>
                    <input
                        type="file"
                        name="mainAudio"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />

                    <textarea
                        name="transcript"
                        placeholder="Transcript"
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    {formData.sentences.map((_, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <div className="flex-1">
                                <label className="block mb-1 font-semibold">{`Sentence ${i + 1}`}</label>
                                <input
                                    type="text"
                                    name={`sentence-${i}`}
                                    placeholder={`Sentence ${i + 1}`}
                                    value={formData.sentences[i]}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 font-semibold">{`Audio for Sentence ${i + 1}`}</label>
                                <input
                                    type="file"
                                    name={`sentenceAudio-${i}`}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                        </div>
                    ))}


                    <button type="button" onClick={addSentenceField} className="text-blue-600 underline">
                        + Thêm câu
                    </button>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {submitting ? 'Đang gửi...' : 'Tạo Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
