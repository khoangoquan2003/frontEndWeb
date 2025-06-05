import React, { useEffect, useState } from 'react';
import { http } from '../api/Http';

const Favourites = () => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchFavourites();
    }, []);

    const fetchFavourites = async () => {
        try {
            const response = await http.get(`/api/show-all-favorite-course`, {
                params: { userId }
            });
            setFavourites(response.data.result || []);
        } catch (error) {
            console.error("❌ Lỗi khi lấy danh sách yêu thích:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (courseId) => {
        if (!window.confirm("Bạn có chắc muốn xóa khỏi danh sách yêu thích không?")) return;

        try {
            await http.delete("/api/delete-favorite-course", {
                params: { userId, courseId }
            });
            // Cập nhật danh sách sau khi xóa
            setFavourites((prev) => prev.filter((item) => item.courseId !== courseId));
        } catch (error) {
            console.error("❌ Lỗi khi xóa khóa học yêu thích:", error);
            alert("Không thể xóa khóa học khỏi yêu thích.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 px-4 pb-20">
            <h1 className="text-2xl font-bold mb-4">⭐ Yêu thích của bạn</h1>

            {loading ? (
                <p className="text-gray-600 italic">Đang tải...</p>
            ) : favourites.length === 0 ? (
                <p className="text-gray-600 italic">Bạn chưa có khóa học nào trong mục yêu thích.</p>
            ) : (
                <ul className="space-y-3">
                    {favourites.map((item, index) => (
                        <li
                            key={index}
                            className="p-4 bg-white shadow border rounded flex justify-between items-center hover:bg-gray-50 transition"
                        >
                            <span
                                className="cursor-pointer"
                                onClick={() => window.location.href = `/dictation?courseId=${item.courseId}&courseName=${encodeURIComponent(item.courseName)}`}
                            >
                                📘 {item.courseName}
                            </span>
                            <button
                                onClick={() => handleRemoveFavorite(item.courseId)}
                                className="text-red-500 hover:text-red-700 underline text-sm"
                                title="Xóa khỏi yêu thích"
                            >
                                Remove
                            </button>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Favourites;
