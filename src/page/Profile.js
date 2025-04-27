import React from "react";

const userData = {
    username: "Khoa Ngo Quan",
    avatar: "https://i.pravatar.cc/100?img=12",
    joinDate: "2022-01-15",
    totalActiveTime: 12840, // in minutes
    coursesCompleted: 8,
    last7Days: 320,
    last30Days: 1260,
};

const formatMinutes = (min) => {
    const hours = Math.floor(min / 60);
    const minutes = min % 60;
    return `${hours}h ${minutes}m`;
};

const Profile = () => {
    return (
        <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded mt-10">
            {/* Avatar + Name */}
            <div className="flex items-center space-x-4 mb-6">
                <img
                    src={userData.avatar}
                    alt="User avatar"
                    className="w-20 h-20 rounded-full border"
                />
                <div>
                    <h2 className="text-2xl font-semibold">{userData.username}</h2>
                    <p className="text-gray-600">Joined on {new Date(userData.joinDate).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-500">Total Active Time</p>
                    <p className="text-lg font-medium">{formatMinutes(userData.totalActiveTime)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-500">Courses Completed</p>
                    <p className="text-lg font-medium">{userData.coursesCompleted}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-500">Active Time (Last 7 Days)</p>
                    <p className="text-lg font-medium">{formatMinutes(userData.last7Days)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-500">Active Time (Last 30 Days)</p>
                    <p className="text-lg font-medium">{formatMinutes(userData.last30Days)}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
