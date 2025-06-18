import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    FaUser, FaCamera, FaEdit, FaSave, FaTimes, FaClock,
    FaTrophy, FaCalendarAlt, FaChartLine, FaSpinner, FaUpload
} from "react-icons/fa";
import { http } from "../api/Http";

// Utility functions
const formatMinutes = (min) => {
    if (!min || min === 0) return "0h 0m";
    const hours = Math.floor(min / 60);
    const minutes = min % 60;
    return `${hours}h ${minutes}m`;
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Custom hooks
const useAuth = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedToken = localStorage.getItem("token");

        if (!storedUserId || !storedToken) {
            toast.error("Vui lòng đăng nhập để xem profile");
            navigate("/login");
            return;
        }

        setUserId(storedUserId);
        setToken(storedToken);
    }, [navigate]);

    return { userId, token };
};

// Sub-components
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Đang tải thông tin...</p>
        </div>
    </div>
);

const ErrorMessage = ({ message, onRetry }) => (
    <div className="text-center py-20">
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-semibold text-red-600 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-red-500 mb-4">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
                Thử lại
            </button>
        )}
    </div>
);

const StatCard = ({ icon, title, value, color = "blue" }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`text-3xl text-${color}-500`}>
                {icon}
            </div>
        </div>
    </div>
);

const AvatarUploadModal = ({ isOpen, onClose, onSave, loading }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file hình ảnh');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước file không được vượt quá 5MB');
                return;
            }

            setSelectedFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (selectedFile) {
            onSave(selectedFile);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Thay đổi ảnh đại diện</h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={loading}
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* File Input */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="avatar-upload"
                                disabled={loading}
                            />
                            <label htmlFor="avatar-upload" className="cursor-pointer">
                                <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Chọn ảnh từ máy tính</p>
                                <p className="text-sm text-gray-500 mt-1">PNG, JPG tối đa 5MB</p>
                            </label>
                        </div>

                        {/* Preview */}
                        {preview && (
                            <div className="text-center">
                                <img
                                    src={preview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200"
                                />
                                <p className="text-sm text-gray-600 mt-2">Xem trước</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!selectedFile || loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Lưu
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    const { userId, token } = useAuth();
    const [userData, setUserData] = useState(null);
    const [practiceData, setPracticeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit states
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [newNickName, setNewNickName] = useState("");
    const [savingNickname, setSavingNickname] = useState(false);

    // Avatar states
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const fetchData = useCallback(async () => {
        if (!userId || !token) return;

        try {
            setLoading(true);
            setError(null);

            const [userRes, practiceRes] = await Promise.all([
                http.get(`/api/show-information`, {
                    params: { userId },
                    headers: { Authorization: `Bearer ${token}` },
                }),
                http.get(`/api/show-practice`, {
                    params: { userId },
                    headers: { Authorization: `Bearer ${token}` },
                }).catch(() => ({ data: { result: null } })) // Don't fail if practice data is not available
            ]);

            const userResult = userRes.data.result;
            const practiceResult = practiceRes.data.result;

            if (!userResult) {
                throw new Error("Không thể tải thông tin người dùng");
            }

            const formattedUser = {
                id: userResult.id,
                username: userResult.nickName,
                img: userResult.img || "/placeholder.svg?height=80&width=80",
                joinDate: userResult.createDate,
                totalActiveTime: userResult.totalActiveTime || 0,
                coursesCompleted: userResult.coursesCompleted || 0,
                last7Days: userResult.last7Days || 0,
                last30Days: userResult.last30Days || 0,
            };

            setUserData(formattedUser);
            setPracticeData(practiceResult);

            // Update localStorage
            localStorage.setItem("nickname", userResult.nickName);

        } catch (error) {
            console.error("Error fetching profile data:", error);
            setError(error.message || "Không thể tải thông tin profile");
        } finally {
            setLoading(false);
        }
    }, [userId, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveNickname = async () => {
        if (!newNickName.trim()) {
            toast.error("Tên hiển thị không được để trống");
            return;
        }

        if (newNickName.trim() === userData.username) {
            setIsEditingNickname(false);
            return;
        }

        try {
            setSavingNickname(true);

            await http.put(
                `/api/edit-nick-name-user`,
                {},
                {
                    params: { userId, newNickName: newNickName.trim() },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUserData(prev => ({
                ...prev,
                username: newNickName.trim(),
            }));

            localStorage.setItem("nickname", newNickName.trim());
            setIsEditingNickname(false);

            toast.success("Cập nhật tên hiển thị thành công!");

        } catch (error) {
            console.error("Failed to update nickname:", error);
            toast.error("Không thể cập nhật tên hiển thị");
        } finally {
            setSavingNickname(false);
        }
    };

    const handleSaveAvatar = async (file) => {
        try {
            setUploadingAvatar(true);

            const formData = new FormData();
            formData.append("newImage", file);

            const response = await http.put(
                `/api/edit-image`,
                formData,
                {
                    params: { userId },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newImgUrl = response.data.result.img;

            setUserData(prev => ({
                ...prev,
                img: newImgUrl,
            }));

            setShowAvatarModal(false);
            toast.success("Cập nhật ảnh đại diện thành công!");

        } catch (error) {
            console.error("Failed to update avatar:", error);
            toast.error("Không thể cập nhật ảnh đại diện");
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
    if (!userData) return <ErrorMessage message="Không tìm thấy thông tin người dùng" />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={userData.img || "/placeholder.svg"}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                                onError={(e) => {
                                    e.target.src = "/placeholder.svg?height=96&width=96";
                                }}
                            />
                            <button
                                onClick={() => setShowAvatarModal(true)}
                                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                                title="Thay đổi ảnh đại diện"
                            >
                                <FaCamera size={14} />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                                {isEditingNickname ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={newNickName}
                                            onChange={(e) => setNewNickName(e.target.value)}
                                            className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent"
                                            placeholder="Nhập tên hiển thị"
                                            disabled={savingNickname}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSaveNickname()}
                                        />
                                        <button
                                            onClick={handleSaveNickname}
                                            disabled={savingNickname}
                                            className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                                        >
                                            {savingNickname ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingNickname(false);
                                                setNewNickName(userData.username);
                                            }}
                                            disabled={savingNickname}
                                            className="text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <h1 className="text-3xl font-bold text-gray-800">{userData.username}</h1>
                                        <button
                                            onClick={() => {
                                                setNewNickName(userData.username);
                                                setIsEditingNickname(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                            title="Chỉnh sửa tên"
                                        >
                                            <FaEdit />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-center md:justify-start text-gray-600 space-x-2">
                                <FaCalendarAlt />
                                <span>Tham gia từ {formatDate(userData.joinDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<FaClock />}
                        title="Tổng thời gian học"
                        value={formatMinutes(userData.totalActiveTime)}
                        color="blue"
                    />
                    <StatCard
                        icon={<FaTrophy />}
                        title="Khóa học hoàn thành"
                        value={userData.coursesCompleted}
                        color="green"
                    />
                    <StatCard
                        icon={<FaChartLine />}
                        title="7 ngày qua"
                        value={formatMinutes(userData.last7Days)}
                        color="purple"
                    />
                    <StatCard
                        icon={<FaChartLine />}
                        title="30 ngày qua"
                        value={formatMinutes(userData.last30Days)}
                        color="orange"
                    />
                </div>

                {/* Practice Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaUser className="mr-2 text-blue-600" />
                        Thông tin luyện tập
                    </h2>

                    {practiceData ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-blue-600 font-medium">Điểm số</p>
                                <p className="text-2xl font-bold text-blue-800">{practiceData.score || 0}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-green-600 font-medium">Trạng thái</p>
                                <p className="text-lg font-semibold text-green-800">
                                    {practiceData.status || "Chưa có"}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-purple-600 font-medium">Điểm hoàn thành</p>
                                <p className="text-2xl font-bold text-purple-800">
                                    {practiceData.scoreFinish || 0}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">📊</div>
                            <p className="text-gray-500">Chưa có dữ liệu luyện tập</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Bắt đầu học để xem thống kê của bạn
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Avatar Upload Modal */}
            <AvatarUploadModal
                isOpen={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                onSave={handleSaveAvatar}
                loading={uploadingAvatar}
            />
        </div>
    );
};

export default Profile;