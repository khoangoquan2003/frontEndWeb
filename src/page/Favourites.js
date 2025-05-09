import React from 'react';

const Favourites = () => {
    const favourites = []; // Thay bằng dữ liệu thật nếu có

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-4">⭐ Yêu thích</h1>
            {favourites.length === 0 ? (
                <p className="text-gray-600 italic">Bạn chưa có mục nào yêu thích.</p>
            ) : (
                <ul className="space-y-2">
                    {favourites.map((item, index) => (
                        <li key={index} className="p-3 bg-white shadow rounded">{item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Favourites;
