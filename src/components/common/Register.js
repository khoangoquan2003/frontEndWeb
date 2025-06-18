import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import dlImage from '../../assets/img/1.jpg';

const Register = () => {
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        nickName: '',
        userName: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const currentPath = window.location.pathname;

        // Chỉ redirect nếu đang ở /register và có token
        if (token && currentPath === '/register') {
            console.log("Đã có token, chuyển hướng về homepage");
            navigate('/homepage', { replace: true });
        }
    }, [navigate]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear messages when user starts typing
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateForm = () => {
        const { nickName, userName, email, password } = formData;

        if (!nickName.trim()) {
            setError('Vui lòng nhập nickname');
            return false;
        }
        if (nickName.trim().length < 2) {
            setError('Nickname phải có ít nhất 2 ký tự');
            return false;
        }

        if (!userName.trim()) {
            setError('Vui lòng nhập username');
            return false;
        }
        if (userName.length < 3) {
            setError('Username phải có ít nhất 3 ký tự');
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
            setError('Username chỉ được chứa chữ cái, số và dấu gạch dưới');
            return false;
        }

        if (!email.trim()) {
            setError('Vui lòng nhập email');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Email không hợp lệ');
            return false;
        }

        if (!password) {
            setError('Vui lòng nhập mật khẩu');
            return false;
        }
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        const payload = {
            username: formData.userName.trim(),
            password: formData.password,
            email: formData.email.trim().toLowerCase(),
            nickName: formData.nickName.trim()
        };

        console.log("Dữ liệu gửi lên:", payload);

        try {
            const response = await axios.post("http://localhost:8080/auth/register", payload, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Response từ server:", response.data);

            setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');

            toast.success('🎉 Đăng ký thành công! Kiểm tra email để kích hoạt tài khoản.', {
                position: "top-right",
                autoClose: 5000,
            });

            // Clear form
            setFormData({
                nickName: '',
                userName: '',
                email: '',
                password: ''
            });

            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Đăng ký thành công! Vui lòng đăng nhập.',
                        email: formData.email
                    }
                });
            }, 3000);

        } catch (err) {
            console.error('Lỗi:', err.response || err);

            let errorMessage = 'Đăng ký thất bại! Vui lòng thử lại.';

            if (err.code === 'ECONNABORTED') {
                errorMessage = 'Kết nối timeout. Vui lòng thử lại.';
            } else if (err.response?.status === 409) {
                errorMessage = 'Username hoặc email đã tồn tại.';
            } else if (err.response?.status === 400) {
                errorMessage = err.response.data?.message || 'Thông tin đăng ký không hợp lệ.';
            } else if (err.response?.status >= 500) {
                errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
            } else {
                errorMessage = err.response?.data?.message || errorMessage;
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        sessionStorage.setItem('registerRedirect', '/homepage');
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            {/* Logo/Brand */}
            <div
                className="absolute top-6 left-6 flex items-center space-x-3 cursor-pointer group"
                onClick={() => navigate('/homepage')}
            >
                <img
                    src={dlImage || "/placeholder.svg"}
                    alt="Logo"
                    className="w-10 h-10 rounded-lg shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="text-xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                    Học Tiếng Anh
                </span>
            </div>

            {/* Register Form */}
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký</h1>
                        <p className="text-gray-600">Tạo tài khoản mới để bắt đầu học tập</p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            <div className="flex items-center">
                                <span className="mr-2">⚠️</span>
                                {error}
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            <div className="flex items-center">
                                <span className="mr-2">✅</span>
                                {success}
                            </div>
                        </div>
                    )}




                    {/* Register Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Nickname Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên hiển thị
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="nickName"
                                    placeholder="Nhập tên hiển thị"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    value={formData.nickName}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="userName"
                                    placeholder="Nhập tên đăng nhập"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Chỉ được chứa chữ cái, số và dấu gạch dưới
                            </p>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Nhập địa chỉ email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Tối thiểu 6 ký tự
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            Đã có tài khoản?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                                disabled={isLoading}
                            >
                                Đăng nhập ngay
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Bằng việc đăng ký, bạn đồng ý với{' '}
                        <a href="/terms" className="text-blue-600 hover:underline">Điều khoản sử dụng</a>
                        {' '}và{' '}
                        <a href="/privacy" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;