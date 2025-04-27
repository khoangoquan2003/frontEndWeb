import React from 'react';

const Comments = () => {
    const comments = []; // Thay bằng dữ liệu thực tế nếu có

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-4">💬 Bình luận</h1>
            {comments.length === 0 ? (
                <p className="text-gray-600 italic">Bạn chưa có bình luận nào.</p>
            ) : (
                <ul className="space-y-2">
                    {comments.map((comment, index) => (
                        <li key={index} className="p-3 bg-white shadow rounded">{comment}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Comments;
