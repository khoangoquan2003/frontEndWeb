import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaRegStickyNote, FaStar, FaUserCircle, FaSun } from 'react-icons/fa';

const Header = ({ nickname }) => {
    return (
        <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between w-full sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <div className="text-blue-600 font-bold text-2xl">D</div>
                <span className="font-semibold text-lg">DailyDictation</span>
            </div>

            {/* Menu */}
            <nav className="flex items-center space-x-6 text-sm text-gray-700">
                <Link to="/topics" className="hover:text-blue-600">All exercises</Link>
                <Link to="/top-users" className="hover:text-blue-600">Top users</Link>

                {/* Dropdown giả lập */}
                <div className="relative group cursor-pointer">
                    <span className="hover:text-blue-600">Video lessons ▾</span>
                    <div className="absolute hidden group-hover:block top-full left-0 bg-white shadow rounded-md text-gray-700 mt-1 w-40 z-10">
                        <Link to="/videos/basic" className="block px-4 py-2 hover:bg-gray-100">Basic</Link>
                        <Link to="/videos/intermediate" className="block px-4 py-2 hover:bg-gray-100">Intermediate</Link>
                    </div>
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
                <div className="relative group cursor-pointer flex items-center space-x-1">
                    <FaStar />
                    <span>In-progress ▾</span>
                    <div className="absolute hidden group-hover:block top-full left-0 bg-white shadow rounded-md text-gray-700 mt-1 w-40 z-10">
                        <Link to="/in-progress/dictations" className="block px-4 py-2 hover:bg-gray-100">Dictations</Link>
                        <Link to="/in-progress/tests" className="block px-4 py-2 hover:bg-gray-100">Tests</Link>
                    </div>
                </div>

                <Link to="/notes" className="flex items-center space-x-1 hover:text-blue-600">
                    <FaRegStickyNote />
                    <span>Notes</span>
                </Link>

                {/* User dropdown */}
                <div className="relative group cursor-pointer flex items-center space-x-1">
                    <FaUserCircle />
                    <span>{nickname || "Guest"} ▾</span>
                    <div className="absolute hidden group-hover:block top-full right-0 bg-white shadow rounded-md text-gray-700 mt-1 w-40 z-10">
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                        <Link to="/login" onClick={() => localStorage.clear()} className="block px-4 py-2 hover:bg-gray-100">
                            Logout
                        </Link>

                    </div>
                </div>

                {/* Light/Dark toggle */}
                <div className="cursor-pointer hover:text-blue-600">
                    <FaSun />
                </div>
            </div>
        </header>
    );
};

export default Header;
