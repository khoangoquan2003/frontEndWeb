import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheck,
    FaExclamationTriangle, FaShieldAlt, FaKey
} from 'react-icons/fa';
import { http } from '../api/Http';

// Utility functions
const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    }
    if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Phải có ít nhất 1 chữ thường');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Phải có ít nhất 1 chữ hoa');
    }
    if (!/(?=.*\d)/.test(password)) {
        errors.push('Phải có ít nhất 1 số');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
        errors.push('Phải có ít nhất 1 ký tự đặc biệt (@$!%*?&)');
    }

    return errors;
};

const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: 'gray' };

    let score = 0;

    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character types
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;

    if (score <= 2) return { strength: score, label: 'Yếu', color: 'red' };
    if (score <= 4) return { strength: score, label: 'Trung bình', color: 'yellow' };
    return { strength: score, label: 'Mạnh', color: 'green' };
};

// Custom hook for authentication
const useAuth = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            toast.error('Vui lòng đăng nhập để thay đổi mật khẩu');
            navigate('/login');
            return;
        }
        setUserId(storedUserId);
    }, [navigate]);

    return userId;
};

// Sub-components
const PasswordInput = ({
                           label,
                           value,
                           onChange,
                           placeholder,
                           showStrength = false,
                           errors = [],
                           required = true
                       }) => {
    const [showPassword, setShowPassword] = useState(false);
    const passwordStrength = showStrength ? getPasswordStrength(value) : null;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.length > 0
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required={required}
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            {/* Password Strength Indicator */}
            {showStrength && value && passwordStrength && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Độ mạnh mật khẩu:</span>
                        <span className={`font-medium text-${passwordStrength.color}-600`}>
                            {passwordStrength.label}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                            style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="space-y-1">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-center text-sm text-red-600">
                            <FaExclamationTriangle className="mr-2 text-xs" />
                            {error}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SecurityTips = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
            <FaShieldAlt className="text-blue-600 text-lg mt-0.5" />
            <div>
                <h3 className="font-medium text-blue-800 mb-2">Mẹo bảo mật</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Sử dụng mật khẩu duy nhất cho mỗi tài khoản</li>
                    <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                    <li>• Tránh sử dụng thông tin cá nhân trong mật khẩu</li>
                    <li>• Thay đổi mật khẩu định kỳ</li>
                </ul>
            </div>
        </div>
    </div>
);

const ChangePasswordForm = () => {
    const userId = useAuth();
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // UI states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSecurityTips, setShowSecurityTips] = useState(true);

    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear errors when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: []
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Current password validation
        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = ['Vui lòng nhập mật khẩu hiện tại'];
        }

        // New password validation
        const passwordErrors = validatePassword(formData.newPassword);
        if (passwordErrors.length > 0) {
            newErrors.newPassword = passwordErrors;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = ['Vui lòng xác nhận mật khẩu mới'];
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = ['Mật khẩu xác nhận không khớp'];
        }

        // Check if new password is same as current
        if (formData.currentPassword && formData.newPassword &&
            formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = ['Mật khẩu mới phải khác mật khẩu hiện tại'];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin');
            return;
        }

        setIsSubmitting(true);

        try {
            await http.put('/api/change-password', null, {
                params: {
                    userId,
                    password: formData.currentPassword,
                    newPassword: formData.newPassword,
                }
            });

            toast.success('🎉 Đổi mật khẩu thành công!');

            // Clear form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Optional: Redirect to profile or login
            setTimeout(() => {
                navigate('/profile');
            }, 2000);

        } catch (error) {
            console.error('Failed to change password:', error);

            let errorMessage = 'Không thể đổi mật khẩu. Vui lòng thử lại.';

            if (error.response?.status === 400) {
                errorMessage = 'Mật khẩu hiện tại không đúng';
            } else if (error.response?.status === 401) {
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!userId) {
        return (
            <div className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-2xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-md mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <FaKey className="text-2xl text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Đổi mật khẩu
                    </h1>
                    <p className="text-gray-600">
                        Cập nhật mật khẩu để bảo mật tài khoản của bạn
                    </p>
                </div>

                {/* Security Tips */}
                {showSecurityTips && (
                    <div className="relative">
                        <SecurityTips />
                        <button
                            onClick={() => setShowSecurityTips(false)}
                            className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 transition-colors"
                            title="Ẩn mẹo bảo mật"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password */}
                        <PasswordInput
                            label="Mật khẩu hiện tại"
                            value={formData.currentPassword}
                            onChange={handleInputChange('currentPassword')}
                            placeholder="Nhập mật khẩu hiện tại"
                            errors={errors.currentPassword || []}
                        />

                        {/* New Password */}
                        <PasswordInput
                            label="Mật khẩu mới"
                            value={formData.newPassword}
                            onChange={handleInputChange('newPassword')}
                            placeholder="Nhập mật khẩu mới"
                            showStrength={true}
                            errors={errors.newPassword || []}
                        />

                        {/* Confirm Password */}
                        <PasswordInput
                            label="Xác nhận mật khẩu mới"
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            placeholder="Nhập lại mật khẩu mới"
                            errors={errors.confirmPassword || []}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                <>
                                    <FaCheck className="mr-2" />
                                    Cập nhật mật khẩu
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            ← Quay lại trang cá nhân
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordForm;