import React, { useEffect, useState } from 'react';
import { http } from "../api/Http";

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const storedUserName = localStorage.getItem('userName');

                if (!userId) {
                    console.error("❌ Không tìm thấy userId trong localStorage");
                    return;
                }

                setUserName(storedUserName || 'Người dùng');

                const response = await http.get(`/api/show-comment-user?userId=${userId}`);

                if (response.data && response.data.result) {
                    // Sort mới nhất -> cũ nhất
                    const sortedComments = response.data.result.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
                    setComments(sortedComments);
                } else {
                    console.error("❌ Dữ liệu trả về không hợp lệ:", response);
                }
            } catch (error) {
                console.error("❌ Lỗi khi gọi API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6">💬 Bình luận của {userName}</h1>

            {loading ? (
                <p className="text-gray-500 italic">Đang tải bình luận...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-600 italic">Bạn chưa có bình luận nào.</p>
            ) : (
                <div className="space-y-6 pb-10"> {/* 👈 Thêm padding bottom ở đây */}
                    {comments.map((comment) => (
                        <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-white shadow rounded space-y-1">
                            {/* Avatar và tên người dùng */}
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <p className="text-sm font-semibold text-blue-700 capitalize">{userName}</p>
                            </div>

                            {/* Nội dung bình luận */}
                            <p className="text-gray-800">{comment.content}</p>

                            {/* Ngày giờ + Link tới dictation */}
                            <div className="text-xs text-gray-500 flex justify-between items-center pt-1">
      <span>
        {new Date(comment.createDate).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })}
      </span>

                                <a
                                    href={`/dictation?courseId=${comment.courseId}&courseName=${encodeURIComponent(comment.courseName || '')}`}
                                    className="text-blue-500 hover:underline text-lg"
                                >
                                    {comment.courseName ? `Xem bài học: ${comment.courseName}` : 'Xem bài học'}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;
