import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaClock, FaUser, FaSearch, FaFilter, FaChevronUp, FaChevronDown } from 'react-icons/fa';

// Utility functions
const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const getRankIcon = (rank) => {
    switch (rank) {
        case 1:
            return <FaTrophy className="text-yellow-500 text-lg" />;
        case 2:
            return <FaMedal className="text-gray-400 text-lg" />;
        case 3:
            return <FaAward className="text-amber-600 text-lg" />;
        default:
            return <span className="text-sm font-bold text-gray-600">#{rank}</span>;
    }
};

const getRankBadgeColor = (rank) => {
    if (rank <= 3) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank <= 10) return 'bg-gradient-to-r from-blue-400 to-blue-600';
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
};

const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
};

// Sub-components
const UserRow = ({ user, rank, isTopThree }) => (
    <tr className={`hover:bg-gray-50 transition-colors ${isTopThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
        <td className="py-4 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getRankBadgeColor(rank)}`}>
                    {rank <= 3 ? getRankIcon(rank) : rank}
                </div>
            </div>
        </td>
        <td className="py-4 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(user.username)}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{user.username}</p>
                    {isTopThree && <p className="text-xs text-yellow-600 font-medium">⭐ Top Performer</p>}
                </div>
            </div>
        </td>
        <td className="py-4 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
                <FaClock className="text-gray-400 text-sm" />
                <span className="font-medium text-gray-700">{formatTime(user.activeTime)}</span>
            </div>
        </td>
    </tr>
);

const StatsCard = ({ icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
            <div className={`p-3 bg-${color}-100 rounded-full`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </div>
    </div>
);

const TopThreePodium = ({ users }) => (
    <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">🏆 Top 3 Xuất Sắc</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <div className="md:order-1 transform md:translate-y-4">
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-300 p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                        <FaMedal className="text-2xl" />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                        {getInitials(users[1].username)}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{users[1].username}</h3>
                    <p className="text-gray-600 font-medium">{formatTime(users[1].activeTime)}</p>
                    <div className="mt-4 bg-gray-100 rounded-lg py-2 px-4">
                        <span className="text-2xl font-bold text-gray-700">#2</span>
                    </div>
                </div>
            </div>

            {/* 1st Place */}
            <div className="md:order-2">
                <div className="bg-white rounded-xl shadow-xl border-2 border-yellow-400 p-6 text-center relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                            👑 CHAMPION
                        </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 mt-4">
                        <FaTrophy className="text-3xl" />
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        {getInitials(users[0].username)}
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 mb-2">{users[0].username}</h3>
                    <p className="text-gray-600 font-medium text-lg">{formatTime(users[0].activeTime)}</p>
                    <div className="mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg py-3 px-4">
                        <span className="text-2xl font-bold text-white">#1</span>
                    </div>
                </div>
            </div>

            {/* 3rd Place */}
            <div className="md:order-3 transform md:translate-y-8">
                <div className="bg-white rounded-xl shadow-lg border-2 border-amber-300 p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                        <FaAward className="text-xl" />
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                        {getInitials(users[2].username)}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{users[2].username}</h3>
                    <p className="text-gray-600 font-medium">{formatTime(users[2].activeTime)}</p>
                    <div className="mt-4 bg-amber-100 rounded-lg py-2 px-4">
                        <span className="text-2xl font-bold text-amber-700">#3</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TopUsers = () => {
    // Dữ liệu mẫu với thông tin phong phú hơn
    const [users] = useState([
        { id: 1, username: "Alex Johnson", activeTime: 250 },
        { id: 2, username: "Maria Garcia", activeTime: 240 },
        { id: 3, username: "David Chen", activeTime: 230 },
        { id: 4, username: "Sarah Wilson", activeTime: 220 },
        { id: 5, username: "Michael Brown", activeTime: 210 },
        { id: 6, username: "Emma Davis", activeTime: 200 },
        { id: 7, username: "James Miller", activeTime: 190 },
        { id: 8, username: "Lisa Anderson", activeTime: 180 },
        { id: 9, username: "Robert Taylor", activeTime: 170 },
        { id: 10, username: "Jennifer White", activeTime: 160 },
        { id: 11, username: "Christopher Lee", activeTime: 150 },
        { id: 12, username: "Amanda Clark", activeTime: 140 },
        { id: 13, username: "Daniel Rodriguez", activeTime: 130 },
        { id: 14, username: "Jessica Martinez", activeTime: 120 },
        { id: 15, username: "Matthew Lewis", activeTime: 110 },
        { id: 16, username: "Ashley Walker", activeTime: 100 },
        { id: 17, username: "Andrew Hall", activeTime: 95 },
        { id: 18, username: "Stephanie Young", activeTime: 90 },
        { id: 19, username: "Joshua King", activeTime: 85 },
        { id: 20, username: "Michelle Wright", activeTime: 80 },
        { id: 21, username: "Kevin Lopez", activeTime: 75 },
        { id: 22, username: "Nicole Hill", activeTime: 70 },
        { id: 23, username: "Brandon Scott", activeTime: 65 },
        { id: 24, username: "Rachel Green", activeTime: 60 },
        { id: 25, username: "Tyler Adams", activeTime: 55 },
        { id: 26, username: "Samantha Baker", activeTime: 50 },
        { id: 27, username: "Justin Nelson", activeTime: 45 },
        { id: 28, username: "Lauren Carter", activeTime: 40 },
        { id: 29, username: "Ryan Mitchell", activeTime: 35 },
        { id: 30, username: "Kayla Perez", activeTime: 30 },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState('split'); // 'split' or 'full'

    // Filter và sort users
    const filteredUsers = users
        .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortOrder === 'desc' ? b.activeTime - a.activeTime : a.activeTime - b.activeTime);

    const topThree = filteredUsers.slice(0, 3);
    const firstHalf = filteredUsers.slice(0, 15);
    const secondHalf = filteredUsers.slice(15, 30);

    // Statistics
    const totalActiveTime = users.reduce((sum, user) => sum + user.activeTime, 0);
    const averageTime = Math.round(totalActiveTime / users.length);
    const topPerformer = users[0];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        🏆 Bảng Xếp Hạng Top 30
                    </h1>
                    <p className="text-gray-600 text-lg">Những học viên xuất sắc nhất trong cộng đồng</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        icon={<FaUser className="text-blue-600 text-xl" />}
                        title="Tổng học viên"
                        value="30"
                        subtitle="Đang hoạt động"
                        color="blue"
                    />
                    <StatsCard
                        icon={<FaClock className="text-green-600 text-xl" />}
                        title="Thời gian trung bình"
                        value={formatTime(averageTime)}
                        subtitle="Mỗi học viên"
                        color="green"
                    />
                    <StatsCard
                        icon={<FaTrophy className="text-yellow-600 text-xl" />}
                        title="Thời gian cao nhất"
                        value={formatTime(topPerformer.activeTime)}
                        subtitle={topPerformer.username}
                        color="yellow"
                    />
                    <StatsCard
                        icon={<FaClock className="text-purple-600 text-xl" />}
                        title="Tổng thời gian"
                        value={formatTime(totalActiveTime)}
                        subtitle="Toàn cộng đồng"
                        color="purple"
                    />
                </div>

                {/* Top 3 Podium */}
                <TopThreePodium users={topThree} />

                {/* Search and Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm học viên..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {sortOrder === 'desc' ? <FaChevronDown /> : <FaChevronUp />}
                                Sắp xếp
                            </button>
                            <button
                                onClick={() => setViewMode(viewMode === 'split' ? 'full' : 'split')}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaFilter />
                                {viewMode === 'split' ? 'Xem đầy đủ' : 'Chia đôi'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Tables */}
                {viewMode === 'split' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* First Half */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">🥇 Top 1 - 15</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Hạng</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Học viên</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {firstHalf.map((user, index) => (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            rank={index + 1}
                                            isTopThree={index < 3}
                                        />
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Second Half */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">📊 Top 16 - 30</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Hạng</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Học viên</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {secondHalf.map((user, index) => (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            rank={index + 16}
                                            isTopThree={false}
                                        />
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Full Table */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">📋 Bảng Xếp Hạng Đầy Đủ</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Hạng</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Học viên</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.map((user, index) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        rank={index + 1}
                                        isTopThree={index < 3}
                                    />
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy học viên nào</h3>
                        <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopUsers;
