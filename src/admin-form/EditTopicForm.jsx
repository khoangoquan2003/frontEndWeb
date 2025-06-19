import React from 'react';

export default function EditTopicForm({
                                          editedTopic,
                                          onEditedTopicChange,
                                          submitEditedTopic,
                                          submittingTopic,
                                          onCancel,
                                      }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">✏️ Chỉnh sửa Khóa Học</h3>
                <form onSubmit={submitEditedTopic}>
                    {/* Loại khóa học */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Loại khóa học</label>
                        <input
                            type="text"
                            name="type"
                            value={editedTopic.type}
                            onChange={onEditedTopicChange}
                            className="w-full border p-2 rounded"
                            placeholder="Ví dụ: Nghe hiểu, Giao tiếp..."
                            required
                        />
                    </div>

                    {/* Trình độ */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Trình độ (CEFR)</label>
                        <select
                            name="level"
                            value={editedTopic.level}
                            onChange={onEditedTopicChange}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">-- Chọn trình độ --</option>
                            <option value="A1">A1 - Beginner</option>
                            <option value="A2">A2 - Elementary</option>
                            <option value="B1">B1 - Intermediate</option>
                            <option value="B2">B2 - Upper Intermediate</option>
                            <option value="C1">C1 - Advanced</option>
                            <option value="C2">C2 - Proficient</option>
                        </select>
                    </div>

                    {/* Số lượng bài */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Số lượng bài</label>
                        <input
                            type="number"
                            name="countTopic"
                            min={1}
                            value={editedTopic.countTopic}
                            onChange={onEditedTopicChange}
                            className="w-full border p-2 rounded"
                            placeholder="Ví dụ: 10"
                            required
                        />
                    </div>

                    {/* Ảnh đại diện (Không bắt buộc) */}
                    <div className="mb-5">
                        <label className="block mb-1 font-medium">Ảnh chủ đề (Tùy chọn)</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={onEditedTopicChange}
                            className="w-full"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submittingTopic}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {submittingTopic ? 'Đang chỉnh sửa...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
