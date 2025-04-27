import React, { useState } from "react";

const TopUsers = () => {
    // Mảng dữ liệu mẫu top 30 users
    const users = [
        { id: 1, username: "user1", activeTime: 120 },
        { id: 2, username: "user2", activeTime: 150 },
        { id: 3, username: "user3", activeTime: 200 },
        { id: 4, username: "user4", activeTime: 90 },
        { id: 5, username: "user5", activeTime: 110 },
        { id: 6, username: "user6", activeTime: 180 },
        { id: 7, username: "user7", activeTime: 220 },
        { id: 8, username: "user8", activeTime: 160 },
        { id: 9, username: "user9", activeTime: 130 },
        { id: 10, username: "user10", activeTime: 140 },
        { id: 11, username: "user11", activeTime: 170 },
        { id: 12, username: "user12", activeTime: 200 },
        { id: 13, username: "user13", activeTime: 180 },
        { id: 14, username: "user14", activeTime: 190 },
        { id: 15, username: "user15", activeTime: 210 },
        { id: 16, username: "user16", activeTime: 230 },
        { id: 17, username: "user17", activeTime: 250 },
        { id: 18, username: "user18", activeTime: 240 },
        { id: 19, username: "user19", activeTime: 220 },
        { id: 20, username: "user20", activeTime: 210 },
        { id: 21, username: "user21", activeTime: 200 },
        { id: 22, username: "user22", activeTime: 180 },
        { id: 23, username: "user23", activeTime: 170 },
        { id: 24, username: "user24", activeTime: 160 },
        { id: 25, username: "user25", activeTime: 150 },
        { id: 26, username: "user26", activeTime: 140 },
        { id: 27, username: "user27", activeTime: 130 },
        { id: 28, username: "user28", activeTime: 120 },
        { id: 29, username: "user29", activeTime: 110 },
        { id: 30, username: "user30", activeTime: 100 },
    ];

    // Chia ra 2 mảng: top 1 đến 15 và 16 đến 30
    const firstHalf = users.slice(0, 15);
    const secondHalf = users.slice(15, 30);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
            <h1 className="text-2xl font-bold text-center mb-6">🏆 Top 30 Users</h1>

            <div className="flex space-x-8">
                {/* Bảng 1: Từ 1 đến 15 */}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-4">Top 1 - 15</h2>
                    <table className="w-full text-sm text-left text-gray-600 border mb-6">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">#</th>
                            <th className="py-2 px-4 border-b">Username</th>
                            <th className="py-2 px-4 border-b">Active Time (minutes)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {firstHalf.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{index + 1}</td>
                                <td className="py-2 px-4 border-b font-medium">{user.username}</td>
                                <td className="py-2 px-4 border-b">{user.activeTime}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Bảng 2: Từ 16 đến 30 */}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-4">Top 16 - 30</h2>
                    <table className="w-full text-sm text-left text-gray-600 border">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">#</th>
                            <th className="py-2 px-4 border-b">Username</th>
                            <th className="py-2 px-4 border-b">Active Time (minutes)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {secondHalf.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{index + 16}</td>
                                <td className="py-2 px-4 border-b font-medium">{user.username}</td>
                                <td className="py-2 px-4 border-b">{user.activeTime}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopUsers;
