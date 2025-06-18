"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import {
    Users,
    BookOpen,
    MessageCircle,
    TrendingUp,
    Activity,
    BarChart3,
    RefreshCw,
    Calendar,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react"
import { http } from "../api/Http"

export default function Dashboard() {
    const [userCount, setUserCount] = useState(0)
    const [dictationCount, setDictationCount] = useState(0)
    const [commentCount, setCommentCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState(new Date())

    // Mock data for trends (you can replace with real API data)
    const [trends] = useState({
        users: { change: 12, isPositive: true },
        topics: { change: 8, isPositive: true },
        comments: { change: -3, isPositive: false },
    })

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        setLoading(true)
        try {
            await Promise.all([fetchUserCount(), fetchDictationCount(), fetchCommentCount()])
            setLastUpdated(new Date())
        } catch (error) {
            console.error("Failed to fetch dashboard data", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserCount = async () => {
        try {
            const response = await http.get("/api/get-all-user")
            if (response.data.code === 200) {
                setUserCount(response.data.result.length)
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        }
    }

    const fetchDictationCount = async () => {
        try {
            const response = await http.get("/api/show-all-topic")
            console.log("Dictation API response:", response.data)

            if (response.data.code === 200 && Array.isArray(response.data.result)) {
                setDictationCount(response.data.result.length)
            } else {
                console.warn("Unexpected data format:", response.data)
            }
        } catch (error) {
            console.error("Failed to fetch dictations", error)
        }
    }

    const fetchCommentCount = async () => {
        try {
            const response = await http.get("/api/all-comments")
            if (response.data.code === 200 && Array.isArray(response.data.result)) {
                setCommentCount(response.data.result.length)
            } else {
                console.warn("Unexpected comment data:", response.data)
            }
        } catch (error) {
            console.error("Failed to fetch comments", error)
        }
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("vi-VN").format(num)
    }

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
        }).format(date)
    }

    const statsCards = [
        {
            title: "Tổng người dùng",
            value: userCount,
            icon: Users,
            description: "Người dùng đã đăng ký",
            trend: trends.users,
            color: "bg-blue-500",
            lightColor: "bg-blue-50 border-blue-200",
            textColor: "text-blue-600",
        },
        {
            title: "Chủ đề bài học",
            value: dictationCount,
            icon: BookOpen,
            description: "Tổng số chủ đề",
            trend: trends.topics,
            color: "bg-green-500",
            lightColor: "bg-green-50 border-green-200",
            textColor: "text-green-600",
        },
        {
            title: "Bình luận",
            value: commentCount,
            icon: MessageCircle,
            description: "Tổng số bình luận",
            trend: trends.comments,
            color: "bg-purple-500",
            lightColor: "bg-purple-50 border-purple-200",
            textColor: "text-purple-600",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 ml-64">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">Tổng quan về hệ thống học tiếng Anh</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            Cập nhật lần cuối: {formatTime(lastUpdated)}
                        </div>
                        <Button onClick={fetchAllData} disabled={loading} size="sm" className="bg-blue-600 hover:bg-blue-700">
                            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                            Làm mới
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statsCards.map((stat, index) => (
                        <Card
                            key={index}
                            className={`${stat.lightColor} border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden`}
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>

                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                                    >
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {stat.trend.isPositive ? (
                                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                                        )}
                                        <span
                                            className={`text-sm font-medium ${stat.trend.isPositive ? "text-green-600" : "text-red-600"}`}
                                        >
                      {stat.trend.change}%
                    </span>
                                    </div>
                                </div>
                                <CardTitle className={`text-lg ${stat.textColor} group-hover:text-opacity-80 transition-colors`}>
                                    {stat.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {loading ? (
                                            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                                        ) : (
                                            formatNumber(stat.value)
                                        )}
                                    </div>
                                    <CardDescription className="text-gray-600">{stat.description}</CardDescription>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Hoạt động gần đây
                            </CardTitle>
                            <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { action: "Người dùng mới đăng ký", time: "5 phút trước", type: "user" },
                                    { action: "Chủ đề mới được tạo", time: "15 phút trước", type: "topic" },
                                    { action: "Bình luận mới", time: "30 phút trước", type: "comment" },
                                    { action: "Người dùng hoàn thành bài học", time: "1 giờ trước", type: "completion" },
                                ].map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                activity.type === "user"
                                                    ? "bg-blue-500"
                                                    : activity.type === "topic"
                                                        ? "bg-green-500"
                                                        : activity.type === "comment"
                                                            ? "bg-purple-500"
                                                            : "bg-orange-500"
                                            }`}
                                        ></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Status */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                Trạng thái hệ thống
                            </CardTitle>
                            <CardDescription>Tình trạng hoạt động của các dịch vụ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { service: "API Server", status: "online", uptime: "99.9%" },
                                    { service: "Database", status: "online", uptime: "99.8%" },
                                    { service: "File Storage", status: "online", uptime: "99.7%" },
                                    { service: "Email Service", status: "maintenance", uptime: "95.2%" },
                                ].map((service, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    service.status === "online"
                                                        ? "bg-green-500"
                                                        : service.status === "maintenance"
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                }`}
                                            ></div>
                                            <span className="font-medium text-gray-900">{service.service}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={service.status === "online" ? "default" : "secondary"}>
                                                {service.status === "online" ? "Hoạt động" : "Bảo trì"}
                                            </Badge>
                                            <span className="text-sm text-gray-500">{service.uptime}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-purple-600" />
                            Thống kê nhanh
                        </CardTitle>
                        <CardDescription>Các chỉ số quan trọng trong tuần này</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Lượt truy cập", value: "2,847", change: "+12%" },
                                { label: "Bài học hoàn thành", value: "1,234", change: "+8%" },
                                { label: "Thời gian học TB", value: "24 phút", change: "+5%" },
                                { label: "Tỷ lệ hoàn thành", value: "87%", change: "+3%" },
                            ].map((metric, index) => (
                                <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border">
                                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                                    <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                                    <div className="text-xs text-green-600 font-medium">{metric.change}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
