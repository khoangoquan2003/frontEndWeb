import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // ✅ import toast

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/dictations', label: 'Dictation List' },
        { path: '/admin/users', label: 'User Management' },
    ];

    const handleLogout = () => {
        localStorage.removeItem("nickname");
        localStorage.removeItem("userId");

        toast.info("👋 Bạn đã đăng xuất", {
            position: "top-right",
            autoClose: 2000,
        });
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    return (
        <div className="bg-gray-800 text-white w-72 h-full p-6 flex flex-col fixed left-0 top-0">
            <Link to="/admin/dashboard">
                <h2 className="text-2xl font-semibold mb-6 whitespace-nowrap overflow-hidden text-ellipsis">
                    🧠 DailyDict Admin
                </h2>
            </Link>
            <nav className="space-y-4 flex-1">
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

            {/* 🔐 Nút Logout */}
            <button
                onClick={handleLogout}
                className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
            >
                Logout
            </button>
        </div>
    );
}
