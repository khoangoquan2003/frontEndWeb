import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaGoogle, FaLock, FaUser, FaSpinner } from 'react-icons/fa';
import dlImage from '../../assets/img/1.jpg';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Form states
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const nickname = localStorage.getItem('nickname');

        if (token && nickname) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Check if token is still valid
                if (decoded.exp > currentTime) {
                    const role = decoded.scope || decoded.role || decoded.authorities?.[0];
                    if (role === "ADMIN") {
                        navigate("/admin", { replace: true });
                    } else {
                        navigate("/homepage", { replace: true });
                    }
                    return;
                }
            } catch (error) {
                // Token is invalid, clear storage
                localStorage.clear();
            }
        }

        // Load remembered credentials
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            setFormData(prev => ({ ...prev, userName: rememberedUser }));
            setRememberMe(true);
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.userName.trim()) {
            setError('Vui lòng nhập tên đăng nhập hoặc email');
            return false;
        }
        if (!formData.password) {
            setError('Vui lòng nhập mật khẩu');
            return false;
        }
        if (formData.password.length < 5) {
            setError('Mật khẩu phải có ít nhất 5 ký tự');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post("http://localhost:8080/auth/test-log-in", {
                userName: formData.userName.trim(),
                password: formData.password
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 10000 // 10 second timeout
            });

            const { token, nickName, userId } = response.data?.result || {};

            if (token && nickName && userId) {
                // Validate token before storing
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp <= currentTime) {
                        throw new Error('Token đã hết hạn');
                    }

                    // Store user data
                    localStorage.setItem("token", token);
                    localStorage.setItem("nickname", nickName);
                    localStorage.setItem("userId", userId.toString());
                    localStorage.setItem("userName", formData.userName.trim());
                    localStorage.setItem("loginTime", Date.now().toString());

                    // Handle remember me
                    if (rememberMe) {
                        localStorage.setItem("rememberedUser", formData.userName.trim());
                    } else {
                        localStorage.removeItem("rememberedUser");
                    }

                    const role = decoded.scope || decoded.role || decoded.authorities?.[0];

                    // Success toast
                    toast.success(
                        role === "ADMIN"
                            ? "Đăng nhập admin! 🎉" // Hiển thị cho Admin
                            : `Chào mừng ${nickName}! 🎉`, // Hiển thị cho người dùng bình thường
                        {
                            position: "top-right",
                            autoClose: 2000,
                        }
                    );

// Navigate based on role
                    setTimeout(() => {
                        if (role === "ADMIN") {
                            navigate("/admin", { replace: true });
                        } else {
                            // Check if there's a redirect path
                            const from = location.state?.from?.pathname || "/homepage";
                            navigate(from, {
                                state: { loginSuccess: true, nickname: nickName },
                                replace: true,
                            });
                        }
                    }, 1500);


                } catch (tokenError) {
                    console.error("Token validation error:", tokenError);
                    setError("Token không hợp lệ. Vui lòng thử lại.");
                }
            } else {
                setError("Thông tin đăng nhập không chính xác");
            }
        } catch (err) {
            console.error("Login Error:", err);

            if (err.code === 'ECONNABORTED') {
                setError("Kết nối timeout. Vui lòng thử lại.");
            } else if (err.response?.status === 401) {
                setError("Tên đăng nhập hoặc mật khẩu không chính xác");
            } else if (err.response?.status === 429) {
                setError("Quá nhiều lần thử. Vui lòng đợi một chút.");
            } else if (err.response?.status >= 500) {
                setError("Lỗi server. Vui lòng thử lại sau.");
            } else {
                setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Store current location for redirect after Google login
        sessionStorage.setItem('loginRedirect', location.state?.from?.pathname || '/homepage');
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleForgotPassword = () => {
        if (formData.userName.trim()) {
            navigate('/forgot-password', { state: { email: formData.userName.trim() } });
        } else {
            navigate('/forgot-password');
        }
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

            {/* Login Form */}
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
                        <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            <div className="flex items-center">
                                <span className="mr-2">⚠️</span>
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaGoogle className="text-red-500 mr-3" />
                        Đăng nhập với Google
                    </button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Hoặc đăng nhập bằng tài khoản</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username/Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập hoặc Email
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="userName"
                                    placeholder="Nhập tên đăng nhập hoặc email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    value={formData.userName}
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
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoading}
                                />
                                <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                disabled={isLoading}
                            >
                                Quên mật khẩu?
                            </button>
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
                                    Đang đăng nhập...
                                </>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            Chưa có tài khoản?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                disabled={isLoading}
                            >
                                Đăng ký ngay
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Bằng việc đăng nhập, bạn đồng ý với{' '}
                        <a href="/terms" className="text-blue-600 hover:underline">Điều khoản sử dụng</a>
                        {' '}và{' '}
                        <a href="/privacy" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;