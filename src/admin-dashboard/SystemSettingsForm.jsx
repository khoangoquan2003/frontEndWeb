"use client"

import { useState } from "react"
import {
    FaCog,
    FaUser,
    FaShieldAlt,
    FaBell,
    FaServer,
    FaPalette,
    FaSave,
    FaUndo,
    FaUpload,
    FaDownload,
    FaExclamationTriangle,
    FaInfoCircle,
} from "react-icons/fa"

const SystemSettingsForm = () => {
    // State cho các tab
    const [activeTab, setActiveTab] = useState("general")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // State cho form data
    const [settings, setSettings] = useState({
        // General Settings
        siteName: "DailyDict Learning Platform",
        siteDescription: "Nền tảng học tập trực tuyến hiện đại",
        adminEmail: "admin@dailydict.com",
        timezone: "Asia/Ho_Chi_Minh",
        language: "vi",
        dateFormat: "DD/MM/YYYY",

        // User Settings
        allowRegistration: true,
        requireEmailVerification: true,
        defaultUserRole: "student",
        maxUsersPerClass: 50,
        sessionTimeout: 30,

        // Security Settings
        enableTwoFactor: false,
        passwordMinLength: 8,
        passwordRequireSpecial: true,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        enableSSL: true,

        // Notification Settings
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        notificationFrequency: "daily",

        // System Settings
        maintenanceMode: false,
        debugMode: false,
        cacheEnabled: true,
        backupFrequency: "weekly",
        maxFileSize: 10,

        // UI Settings
        theme: "light",
        primaryColor: "#3B82F6",
        logoUrl: "",
        faviconUrl: "",
        customCSS: "",
    })

    // Tabs configuration
    const tabs = [
        { id: "general", label: "Cài đặt chung", icon: <FaCog /> },
        { id: "users", label: "Người dùng", icon: <FaUser /> },
        { id: "security", label: "Bảo mật", icon: <FaShieldAlt /> },
        { id: "notifications", label: "Thông báo", icon: <FaBell /> },
        { id: "system", label: "Hệ thống", icon: <FaServer /> },
        { id: "ui", label: "Giao diện", icon: <FaPalette /> },
    ]

    // Handle input changes
    const handleInputChange = (field, value) => {
        setSettings((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Show success message
            alert("Cài đặt đã được lưu thành công!")
        } catch (error) {
            alert("Có lỗi xảy ra khi lưu cài đặt!")
        } finally {
            setIsLoading(false)
        }
    }

    // Reset form
    const handleReset = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Bạn có chắc chắn muốn khôi phục cài đặt mặc định?")) {
            // Reset to default values
            setSettings({
                siteName: "DailyDict Learning Platform",
                siteDescription: "Nền tảng học tập trực tuyến hiện đại",
                adminEmail: "admin@dailydict.com",
                timezone: "Asia/Ho_Chi_Minh",
                language: "vi",
                dateFormat: "DD/MM/YYYY",
                allowRegistration: true,
                requireEmailVerification: true,
                defaultUserRole: "student",
                maxUsersPerClass: 50,
                sessionTimeout: 30,
                enableTwoFactor: false,
                passwordMinLength: 8,
                passwordRequireSpecial: true,
                maxLoginAttempts: 5,
                lockoutDuration: 15,
                enableSSL: true,
                emailNotifications: true,
                pushNotifications: false,
                smsNotifications: false,
                notificationFrequency: "daily",
                maintenanceMode: false,
                debugMode: false,
                cacheEnabled: true,
                backupFrequency: "weekly",
                maxFileSize: 10,
                theme: "light",
                primaryColor: "#3B82F6",
                logoUrl: "",
                faviconUrl: "",
                customCSS: "",
            })
        }
    }

    // Render form sections
    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên website</label>
                    <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleInputChange("siteName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email quản trị</label>
                    <input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả website</label>
                <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Múi giờ</label>
                    <select
                        value={settings.timezone}
                        onChange={(e) => handleInputChange("timezone", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                    <select
                        value={settings.language}
                        onChange={(e) => handleInputChange("language", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Định dạng ngày</label>
                    <select
                        value={settings.dateFormat}
                        onChange={(e) => handleInputChange("dateFormat", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
        </div>
    )

    const renderUserSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Cho phép đăng ký</h4>
                            <p className="text-sm text-gray-500">Người dùng có thể tự đăng ký tài khoản</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.allowRegistration}
                                onChange={(e) => handleInputChange("allowRegistration", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Xác thực email</h4>
                            <p className="text-sm text-gray-500">Yêu cầu xác thực email khi đăng ký</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.requireEmailVerification}
                                onChange={(e) => handleInputChange("requireEmailVerification", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò mặc định</label>
                        <select
                            value={settings.defaultUserRole}
                            onChange={(e) => handleInputChange("defaultUserRole", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="student">Học viên</option>
                            <option value="teacher">Giáo viên</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số người tối đa/lớp</label>
                        <input
                            type="number"
                            value={settings.maxUsersPerClass}
                            onChange={(e) => handleInputChange("maxUsersPerClass", Number.parseInt(e.target.value))}
                            min="1"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian hết phiên (phút)</label>
                        <input
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) => handleInputChange("sessionTimeout", Number.parseInt(e.target.value))}
                            min="5"
                            max="120"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                    <FaExclamationTriangle className="text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                        Thay đổi cài đặt bảo mật có thể ảnh hưởng đến tất cả người dùng. Vui lòng cân nhắc kỹ trước khi thay đổi.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Xác thực 2 bước</h4>
                            <p className="text-sm text-gray-500">Bật xác thực 2 bước cho tài khoản admin</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableTwoFactor}
                                onChange={(e) => handleInputChange("enableTwoFactor", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">SSL/HTTPS</h4>
                            <p className="text-sm text-gray-500">Bắt buộc sử dụng kết nối an toàn</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableSSL}
                                onChange={(e) => handleInputChange("enableSSL", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Ký tự đặc biệt</h4>
                            <p className="text-sm text-gray-500">Yêu cầu ký tự đặc biệt trong mật khẩu</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.passwordRequireSpecial}
                                onChange={(e) => handleInputChange("passwordRequireSpecial", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Độ dài mật khẩu tối thiểu</label>
                        <input
                            type="number"
                            value={settings.passwordMinLength}
                            onChange={(e) => handleInputChange("passwordMinLength", Number.parseInt(e.target.value))}
                            min="6"
                            max="20"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số lần đăng nhập sai tối đa</label>
                        <input
                            type="number"
                            value={settings.maxLoginAttempts}
                            onChange={(e) => handleInputChange("maxLoginAttempts", Number.parseInt(e.target.value))}
                            min="3"
                            max="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian khóa tài khoản (phút)</label>
                        <input
                            type="number"
                            value={settings.lockoutDuration}
                            onChange={(e) => handleInputChange("lockoutDuration", Number.parseInt(e.target.value))}
                            min="5"
                            max="60"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Loại thông báo</h3>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Email</h4>
                            <p className="text-sm text-gray-500">Gửi thông báo qua email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Push Notification</h4>
                            <p className="text-sm text-gray-500">Thông báo đẩy trên trình duyệt</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.pushNotifications}
                                onChange={(e) => handleInputChange("pushNotifications", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">SMS</h4>
                            <p className="text-sm text-gray-500">Gửi thông báo qua tin nhắn</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.smsNotifications}
                                onChange={(e) => handleInputChange("smsNotifications", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tần suất thông báo</h3>
                    <div className="space-y-3">
                        {[
                            { value: "realtime", label: "Thời gian thực" },
                            { value: "hourly", label: "Mỗi giờ" },
                            { value: "daily", label: "Hàng ngày" },
                            { value: "weekly", label: "Hàng tuần" },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                                <input
                                    type="radio"
                                    name="notificationFrequency"
                                    value={option.value}
                                    checked={settings.notificationFrequency === option.value}
                                    onChange={(e) => handleInputChange("notificationFrequency", e.target.value)}
                                    className="mr-3 text-blue-600"
                                />
                                <span className="text-gray-900">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    const renderSystemSettings = () => (
        <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                        Cài đặt hệ thống có thể ảnh hưởng đến hiệu suất và tính khả dụng của website. Hãy thận trọng khi thay đổi.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Chế độ bảo trì</h4>
                            <p className="text-sm text-gray-500">Tạm thời tắt website để bảo trì</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => handleInputChange("maintenanceMode", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Chế độ Debug</h4>
                            <p className="text-sm text-gray-500">Hiển thị thông tin debug (chỉ dành cho dev)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.debugMode}
                                onChange={(e) => handleInputChange("debugMode", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Cache</h4>
                            <p className="text-sm text-gray-500">Bật cache để tăng tốc độ website</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.cacheEnabled}
                                onChange={(e) => handleInputChange("cacheEnabled", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tần suất sao lưu</label>
                        <select
                            value={settings.backupFrequency}
                            onChange={(e) => handleInputChange("backupFrequency", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="daily">Hàng ngày</option>
                            <option value="weekly">Hàng tuần</option>
                            <option value="monthly">Hàng tháng</option>
                            <option value="manual">Thủ công</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kích thước file tối đa (MB)</label>
                        <input
                            type="number"
                            value={settings.maxFileSize}
                            onChange={(e) => handleInputChange("maxFileSize", Number.parseInt(e.target.value))}
                            min="1"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <FaDownload className="mr-2" />
                            Tải xuống bản sao lưu
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <FaUpload className="mr-2" />
                            Khôi phục từ file
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderUISettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề giao diện</label>
                        <div className="space-y-3">
                            {[
                                { value: "light", label: "Sáng", preview: "bg-white border-gray-300" },
                                { value: "dark", label: "Tối", preview: "bg-gray-800 border-gray-600" },
                                { value: "auto", label: "Tự động", preview: "bg-gradient-to-r from-white to-gray-800" },
                            ].map((theme) => (
                                <label
                                    key={theme.value}
                                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                    <input
                                        type="radio"
                                        name="theme"
                                        value={theme.value}
                                        checked={settings.theme === theme.value}
                                        onChange={(e) => handleInputChange("theme", e.target.value)}
                                        className="mr-3 text-blue-600"
                                    />
                                    <div className={`w-6 h-6 rounded-full mr-3 ${theme.preview}`}></div>
                                    <span className="text-gray-900">{theme.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Màu chủ đạo</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.primaryColor}
                                onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="#3B82F6"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo website</label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="url"
                                value={settings.logoUrl}
                                onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/logo.png"
                            />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <FaUpload />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="url"
                                value={settings.faviconUrl}
                                onChange={(e) => handleInputChange("faviconUrl", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/favicon.ico"
                            />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <FaUpload />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CSS tùy chỉnh</label>
                        <textarea
                            value={settings.customCSS}
                            onChange={(e) => handleInputChange("customCSS", e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder="/* CSS tùy chỉnh của bạn */"
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt hệ thống</h1>
                    <p className="text-gray-600">Quản lý và cấu hình các thiết lập cho hệ thống DailyDict</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                                            activeTab === tab.id
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === "general" && renderGeneralSettings()}
                            {activeTab === "users" && renderUserSettings()}
                            {activeTab === "security" && renderSecuritySettings()}
                            {activeTab === "notifications" && renderNotificationSettings()}
                            {activeTab === "system" && renderSystemSettings()}
                            {activeTab === "ui" && renderUISettings()}
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <FaInfoCircle />
                                <span>Thay đổi sẽ được áp dụng ngay lập tức</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FaUndo className="mr-2" />
                                    Khôi phục mặc định
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="mr-2" />
                                            Lưu cài đặt
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SystemSettingsForm
