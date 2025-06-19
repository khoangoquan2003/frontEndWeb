import React, { useState } from "react";
import axios from "axios"; // Gọi trực tiếp axios
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8080/api/reset-password",
                null, // không gửi body
                {
                    params: { username, email },
                    // nếu backend không cần cookie/session thì có thể bỏ dòng dưới
                    withCredentials: true,
                }
            );

            console.log("Reset password response:", response.data);
            setSubmitted(true);
        } catch (error) {
            console.error("Reset password error:", error);
            alert(
                error?.response?.data?.message ||
                "Có lỗi xảy ra. Vui lòng kiểm tra lại tên đăng nhập và email."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setUsername("");
        setEmail("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main card */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            Quên mật khẩu?
                        </h2>
                        <p className="text-gray-600">Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại tài khoản</p>
                    </div>

                    {submitted ? (
                        <div className="text-center animate-fade-in">
                            {/* Success message */}
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg animate-bounce">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Email đã được gửi!</h3>
                                <p className="text-green-700 text-sm leading-relaxed">
                                    Nếu email <span className="font-semibold text-green-800">{email}</span> tồn tại trong hệ thống,
                                    chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến hộp thư của bạn.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleReset}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Gửi lại email khác
                                </button>
                                <button
                                    className="w-full text-gray-600 hover:text-gray-800 py-2 font-medium transition-colors duration-200"
                                    onClick={() => navigate('/login')}
                                >
                                    ← Quay lại đăng nhập
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700" htmlFor="username">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400"
                                    placeholder="Tên đăng nhập của bạn"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
                                    Địa chỉ email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400"
                                        placeholder="your.email@example.com"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email.trim() || !username.trim()}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang gửi...</span>
                                    </>
                                ) : (
                                    <span>Gửi hướng dẫn đặt lại mật khẩu</span>
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
                                    onClick={() => navigate('/login')}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    <span>Quay lại đăng nhập</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        Chưa có tài khoản?{" "}
                        <button
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký ngay
                        </button>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}

export default ForgotPassword;
