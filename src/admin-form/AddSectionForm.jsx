import React from 'react';

export default function AddSectionForm({
                                           newSection,
                                           onChange,
                                           onSubmit,
                                           submitting
                                       }) {
    return (
        <form onSubmit={onSubmit} className="mt-6 border-t pt-4">
            <h4 className="font-semibold mb-3">Thêm Section mới</h4>
            <div className="mb-3">
                <input
                    type="text"
                    name="name"
                    placeholder="Tên section"
                    value={newSection.name}
                    onChange={onChange}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="number"
                    name="countOfCourse"
                    min={0}
                    placeholder="Số lượng khóa học"
                    value={newSection.countOfCourse}
                    onChange={onChange}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                {submitting ? 'Đang tạo...' : 'Tạo Section'}
            </button>
        </form>
    );
}
