import React, { useEffect, useState } from 'react';
import { http } from '../api/Http';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.error("Không tìm thấy userId trong localStorage");
                    setLoading(false);
                    return;
                }

                const response = await http.get(`/api/show-all-notification?userId=${userId}`);

                if (response.data && response.data.result) {
                    // Lọc thông báo: chỉ lấy những thông báo mà triggerUserId khác với userId hiện tại
                    const filtered = response.data.result.filter(note => note.triggerUserId !== Number(userId));

                    console.log("Filtered notifications:", filtered);

                    const sorted = filtered.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );

                    setNotifications(sorted);
                } else {
                    console.error("Dữ liệu trả về không hợp lệ:", response);
                }


            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4 mb-20">
            <h1 className="text-2xl font-bold mb-4">🔔 Thông báo</h1>

            {loading ? (
                <p className="text-gray-500 italic">Đang tải thông báo...</p>
            ) : notifications.length === 0 ? (
                <p className="text-gray-600 italic">Không có thông báo nào.</p>
            ) : (
                <ul className="space-y-6 mb-20">
                    {notifications.map((note) => {
                        const firstLetter = note.message?.charAt(0).toUpperCase() || '?';

                        return (
                            <li
                                key={note.id}
                                className="p-4 pb-6 bg-white shadow rounded-lg border border-gray-200 hover:bg-gray-50 transition flex items-start space-x-4"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                                    {firstLetter}
                                </div>

                                <div className="flex-1">
                                    <p className="text-gray-800">{note.message}</p>
                                    <div className="text-xs text-gray-500 mt-2 flex justify-between items-center">
                                        <span>
                                            {new Date(note.createdAt).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })}
                                        </span>
                                        <a
                                            href={`/dictation?courseId=${note.course}&courseName=${encodeURIComponent(note.courseName || '')}`}
                                            className="text-blue-500 hover:underline text-base font-semibold"
                                        >
                                            {note.courseName ? `Xem bài học: ${note.courseName}` : 'Xem bài học'}
                                        </a>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
