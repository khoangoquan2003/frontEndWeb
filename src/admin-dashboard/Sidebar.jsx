"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
    LayoutDashboard,
    BookOpen,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Settings,
    Bell,
    User,
    Brain,
} from "lucide-react"
import { toast } from "react-toastify"

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [notifications] = useState(3) // Mock notification count

    const navItems = [
        {
            path: "/admin/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            description: "Tổng quan hệ thống",
            badge: null,
        },
        {
            path: "/admin/dictations",
            label: "Dictation List",
            icon: BookOpen,
            description: "Quản lý bài học",
            badge: "12",
        },
        {
            path: "/admin/users",
            label: "User Management",
            icon: Users,
            description: "Quản lý người dùng",
            badge: notifications > 0 ? notifications.toString() : null,
        },
        {
            path: "/admin/settings",
            label: "Settings",
            icon: Settings,
            description: "Cài đặt hệ thống",
            badge: null,
        },
    ]

    const handleLogout = () => {
        localStorage.removeItem("nickname")
        localStorage.removeItem("userId")

        toast.info("👋 Bạn đã đăng xuất", {
            position: "top-right",
            autoClose: 2000,
        })
        setTimeout(() => {
            navigate("/login")
        }, 1000)
    }

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <div
            className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen p-4 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out shadow-2xl border-r border-slate-700 ${
                isCollapsed ? "w-20" : "w-72"
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                                DailyDict Admin
                            </h2>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    )}
                </Link>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="text-slate-400 hover:text-white hover:bg-slate-700 p-2"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </div>

            {/* User Profile Section */}
            {!isCollapsed && (
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-slate-400">Super Administrator</p>
                        </div>
                        <div className="relative">
                            <Bell className="w-4 h-4 text-slate-400" />
                            {notifications > 0 && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">{notifications}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 relative overflow-hidden ${
                                isActive
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                    : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                            }`}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r"></div>
                            )}

                            {/* Icon */}
                            <div
                                className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>

                            {/* Label and Description */}
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium truncate">{item.label}</span>
                                        {item.badge && (
                                            <Badge
                                                variant={isActive ? "secondary" : "outline"}
                                                className={`ml-2 text-xs ${
                                                    isActive
                                                        ? "bg-white/20 text-white border-white/30"
                                                        : "bg-slate-700 text-slate-300 border-slate-600"
                                                }`}
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
                                </div>
                            )}

                            {/* Collapsed state badge */}
                            {isCollapsed && item.badge && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">{item.badge}</span>
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Quick Actions */}
            {!isCollapsed && (
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Add New Topic
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            View All Users
                        </Button>
                    </div>
                </div>
            )}

            {/* Logout Button */}
            <div className="pt-4 border-t border-slate-700">
                <Button
                    onClick={handleLogout}
                    className={`w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                        isCollapsed ? "px-3" : "px-4"
                    }`}
                >
                    <LogOut className="w-4 h-4" />
                    {!isCollapsed && <span className="ml-2">Logout</span>}
                </Button>
            </div>

            {/* Version Info */}
            {!isCollapsed && (
                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">Version 1.0.0</p>
                </div>
            )}
        </div>
    )
}
