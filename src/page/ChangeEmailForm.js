import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FaEnvelope, FaSpinner, FaCheck, FaExclamationTriangle,
    FaShieldAlt, FaEdit, FaInfoCircle, FaArrowLeft
} from 'react-icons/fa';
import { http } from '../api/Http';

// Utility functions
const validateEmail = (email) => {
    const errors = [];

    if (!email) {
        errors.push('Email không được để trống');
        return errors;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push('Định dạng email không hợp lệ');
    }

    // Check for common email providers
    const commonProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && !commonProviders.includes(domain)) {
        // This is just a warning, not an error
    }

    return errors;
};

const isEmailSame = (email1, email2) => {
    return email1.toLowerCase().trim() === email2.toLowerCase().trim();
};

// Custom hook for authentication
const useAuth = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [currentEmail, setCurrentEmail] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('email') || '';

        if (!storedUserId) {
            toast.error('Vui lòng đăng nhập để thay đổi email');
            navigate('/login');
            return;
        }

        setUserId(storedUserId);
        setCurrentEmail(storedEmail);
    }, [navigate]);

    return { userId, currentEmail, setCurrentEmail };
};

// Sub-components
const EmailInput = ({ label, value, onChange, placeholder, errors = [], disabled = false }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
            {label}
            <span className="text-red-500 ml-1">*</span>
        </label>

        <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                type="email"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    disabled
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : errors.length > 0
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required={!disabled}
            />
        </div>

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

const SecurityNotice = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
            <FaShieldAlt className="text-amber-600 text-lg mt-0.5" />
            <div>
                <h3 className="font-medium text-amber-800 mb-2">Lưu ý bảo mật</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Email mới sẽ được sử dụng để đăng nhập và khôi phục tài khoản</li>
                    <li>• Bạn sẽ nhận được email xác nhận tại địa chỉ mới</li>
                    <li>• Hãy đảm bảo bạn có quyền truy cập vào email mới</li>
                    <li>• Thay đổi này có thể ảnh hưởng đến các dịch vụ liên kết</li>
                </ul>
            </div>
        </div>
    </div>
);

const EmailPreview = ({ currentEmail, newEmail }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-800 mb-3 flex items-center">
            <FaInfoCircle className="mr-2" />
            Xem trước thay đổi
        </h3>
        <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
                <span className="text-gray-600">Email hiện tại:</span>
                <span className="font-medium text-gray-800">{currentEmail || 'Chưa có'}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-600">Email mới:</span>
                <span className="font-medium text-blue-600">{newEmail || 'Chưa nhập'}</span>
            </div>
        </div>
    </div>
);

const ChangeEmailForm = () => {
    const { userId, currentEmail, setCurrentEmail } = useAuth();
    const navigate = useNavigate();

    // Form states
    const [newEmail, setNewEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState([]);
    const [showPreview, setShowPreview] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setNewEmail(value);

        // Clear errors when user starts typing
        if (errors.length > 0) {
            setErrors([]);
        }

        // Show preview when user types
        setShowPreview(value.trim().length > 0);
    };

    const validateForm = () => {
        const newErrors = [];

        // Email validation
        const emailErrors = validateEmail(newEmail);
        newErrors.push(...emailErrors);

        // Check if email is same as current
        if (currentEmail && newEmail && isEmailSame(currentEmail, newEmail)) {
            newErrors.push('Email mới phải khác email hiện tại');
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin email');
            return;
        }

        // Confirmation dialog
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn thay đổi email từ "${currentEmail}" thành "${newEmail}"?\n\n` +
            'Thay đổi này sẽ ảnh hưởng đến việc đăng nhập và khôi phục tài khoản.'
        );

        if (!confirmed) return;

        setIsSubmitting(true);

        try {
            await http.put('/api/change-gmail', null, {
                params: {
                    userId,
                    gmail: newEmail.trim().toLowerCase()
                }
            });

            toast.success('🎉 Cập nhật email thành công!');

            // Update local storage and state
            localStorage.setItem('email', newEmail.trim().toLowerCase());
            setCurrentEmail(newEmail.trim().toLowerCase());
            setNewEmail('');
            setShowPreview(false);

            // Optional: Redirect to profile
            setTimeout(() => {
                navigate('/profile');
            }, 2000);

        } catch (error) {
            console.error('Failed to change email:', error);

            let errorMessage = 'Không thể cập nhật email. Vui lòng thử lại.';

            if (error.response?.status === 400) {
                errorMessage = 'Email không hợp lệ hoặc đã được sử dụng';
            } else if (error.response?.status === 401) {
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response?.status === 409) {
                errorMessage = 'Email này đã được sử dụng bởi tài khoản khác';
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
                        <FaEdit className="text-2xl text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Thay đổi Email
                    </h1>
                    <p className="text-gray-600">
                        Cập nhật địa chỉ email cho tài khoản của bạn
                    </p>
                </div>

                {/* Security Notice */}
                <SecurityNotice />

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Email */}
                        <EmailInput
                            label="Email hiện tại"
                            value={currentEmail}
                            placeholder="Chưa có email"
                            disabled={true}
                        />

                        {/* New Email */}
                        <EmailInput
                            label="Email mới"
                            value={newEmail}
                            onChange={handleInputChange}
                            placeholder="Nhập địa chỉ email mới"
                            errors={errors}
                        />

                        {/* Preview */}
                        {showPreview && (
                            <EmailPreview
                                currentEmail={currentEmail}
                                newEmail={newEmail}
                            />
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !newEmail.trim()}
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
                                    Cập nhật Email
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors inline-flex items-center"
                        >
                            <FaArrowLeft className="mr-2" />
                            Quay lại trang cá nhân
                        </button>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Bạn sẽ nhận được email xác nhận tại địa chỉ mới sau khi cập nhật thành công
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChangeEmailForm;