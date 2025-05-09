import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import { FaClock, FaRegStickyNote, FaStar, FaUserCircle, FaSun, FaCog } from 'react-icons/fa';

const Header = ({ nickname }) => {
    const [isVideoDropdownOpen, setIsVideoDropdownOpen] = useState(false);
    const [isInProgressDropdownOpen, setIsInProgressDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const navigate = useNavigate(); // Để sử dụng navigate sau khi logout
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const [theme, setTheme] = useState("light");

    const toggleTheme = (selectedTheme) => {
        setTheme(selectedTheme);
        document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
        setIsThemeDropdownOpen(false);
    };


    // Hàm giúp mở/đóng dropdown khi click
    const handleDropdownToggle = (dropdown) => {
        if (dropdown === 'video') setIsVideoDropdownOpen(!isVideoDropdownOpen);
        if (dropdown === 'inProgress') setIsInProgressDropdownOpen(!isInProgressDropdownOpen);
        if (dropdown === 'user') setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    // Hàm để xử lý đăng xuất
    const handleLogout = () => {
        // Xóa thông tin đăng nhập khỏi localStorage
        localStorage.clear();

        // Hiển thị thông báo toast
        toast.info("👋 Bạn đã đăng xuất", {
            position: "top-right",
            autoClose: 2000, // Thông báo tự động đóng sau 2 giây
            hideProgressBar: true, // Ẩn thanh tiến trình
        });

        // Điều hướng về trang đăng nhập sau khi thông báo
        setTimeout(() => {
            navigate("/login"); // Điều hướng đến trang login
        }, 2000); // Delay 2 giây cho toast hiển thị
    };

    return (
        <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between w-full sticky top-0 z-50">
            {/* Logo */}
            <Link to="/homepage" className="flex items-center space-x-2">
                <div className="text-blue-600 font-bold text-2xl">D</div>
                <span className="font-semibold text-lg">DailyDictation</span>
            </Link>

            {/* Menu */}
            <nav className="flex items-center space-x-6 text-sm text-gray-700">
                <Link to="/topics" className="hover:text-blue-600">All exercises</Link>
                <Link to="/top-users" className="hover:text-blue-600">Top users</Link>

                {/* Dropdown Video lessons */}
                <div className="relative">
                    <span
                        className="hover:text-blue-600 cursor-pointer"
                        onClick={() => handleDropdownToggle('video')}
                    >
                        Video lessons ▾
                    </span>
                    {isVideoDropdownOpen && (
                        <div className="absolute top-full left-0 bg-white shadow rounded-md text-gray-700 mt-1 w-40 z-10">
                            <Link to="/videos/basic" className="block px-4 py-2 hover:bg-gray-100">Basic</Link>
                            <Link to="/videos/intermediate" className="block px-4 py-2 hover:bg-gray-100">Intermediate</Link>
                        </div>
                    )}
                </div>

                <Link to="/donate" className="text-pink-500 hover:underline">Donate 💖</Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4 text-sm text-gray-700">
                <div className="flex items-center space-x-1">
                    <FaClock />
                    <span>0 minutes</span>
                </div>

                {/* In-progress dropdown */}
                <div className="relative flex items-center space-x-1">
                    <FaStar />
                    <span
                        className="cursor-pointer"
                        onClick={() => handleDropdownToggle('inProgress')}
                    >
                        In-progress ▾
                    </span>
                    {isInProgressDropdownOpen && (
                        <div className="absolute top-full left-0 bg-white shadow rounded-md text-gray-700 mt-1 w-40 z-10">
                            <Link to="/in-progress/dictations" className="block px-4 py-2 hover:bg-gray-100">Dictations</Link>
                            <Link to="/in-progress/tests" className="block px-4 py-2 hover:bg-gray-100">Tests</Link>
                        </div>
                    )}
                </div>

                <Link to="/notes" className="flex items-center space-x-1 hover:text-blue-600">
                    <FaRegStickyNote />
                    <span>Notes</span>
                </Link>

                {/* User dropdown */}
                <div className="relative flex items-center space-x-1">
                    <FaUserCircle />
                    <span
                        className="cursor-pointer"
                        onClick={() => handleDropdownToggle('user')}
                    >
                        {nickname || "Guest"} ▾
                    </span>
                    {isUserDropdownOpen && (
                        <div className="absolute top-full right-0 bg-white shadow rounded-md text-gray-700 mt-1 w-48 z-10">
                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">👤 Profile Info</Link>
                            <Link to="/notifications" className="block px-4 py-2 hover:bg-gray-100">🔔 Notifications</Link>
                            <Link to="/comments" className="block px-4 py-2 hover:bg-gray-100">💬 Comments</Link>
                            <Link to="/favourites" className="block px-4 py-2 hover:bg-gray-100">⭐ Favourites</Link>
                            <div className="border-t my-1"></div>
                            <Link to="/changePassword" className="block px-4 py-2 hover:bg-gray-100">🔑 Change Password</Link>
                            <Link to="/changeMail" className="block px-4 py-2 hover:bg-gray-100">✉️ Change Email</Link>
                            <div className="border-t my-1"></div>
                            {/* Logout Link */}
                            <Link
                                to="/login"
                                onClick={handleLogout}  // Gọi handleLogout khi click
                                className="block px-4 py-2 hover:bg-red-100 text-red-600"
                            >
                                🚪 Logout
                            </Link>
                        </div>
                    )}
                </div>

                {/* Theme settings dropdown */}
                <div className="relative">
                    <div
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                    >
                        <FaCog />
                    </div>
                    {isThemeDropdownOpen && (
                        <div className="absolute right-0 mt-1 bg-white shadow rounded-md text-gray-700 w-32 z-10 dark:bg-gray-800 dark:text-white">
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => toggleTheme('light')}
                            >
                                🌞 Light Mode
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => toggleTheme('dark')}
                            >
                                🌙 Dark Mode
                            </button>
                        </div>
                    )}
                </div>


            </div>
        </header>
    );
};

export default Header;
