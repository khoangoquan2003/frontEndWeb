import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/dictations', label: 'Dictation List' },
        { path: '/admin/users', label: 'User Management' },
    ];

    return (
        <div className="bg-gray-800 text-white w-72 h-full p-6 flex flex-col fixed left-0 top-0">
            {/* Wrap the header in a Link to navigate to /admin/dashboard */}
            <Link to="/admin/dashboard">
                <h2 className="text-2xl font-semibold mb-6 whitespace-nowrap overflow-hidden text-ellipsis">
                    🧠 DailyDict Admin
                </h2>
            </Link>
            <nav className="space-y-4">
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`block p-3 rounded-lg transition-colors duration-200 ${
                            location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
