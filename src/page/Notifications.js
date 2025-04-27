import React from 'react';

const Notifications = () => {
    const notifications = []; // Thay bằng dữ liệu thực tế nếu có

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-4">🔔 Thông báo</h1>
            {notifications.length === 0 ? (
                <p className="text-gray-600 italic">Không có thông báo nào.</p>
            ) : (
                <ul className="space-y-2">
                    {notifications.map((note, index) => (
                        <li key={index} className="p-3 bg-white shadow rounded">{note}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
