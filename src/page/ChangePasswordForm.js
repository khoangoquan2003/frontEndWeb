import React, { useState } from 'react';
import { http } from '../api/Http';  // giả sử bạn dùng axios instance ở đây
import { toast } from 'react-toastify';

const ChangePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match!");
            return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error("User not logged in.");
            return;
        }

        try {
            await http.put('/api/change-password', null, {
                params: {
                    userId,
                    password: currentPassword,
                    newPassword,
                }
            });

            toast.success("Password updated successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {
            console.error("Failed to change password:", error);
            toast.error(error.response?.data?.message || "Failed to update password.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-4 bg-white shadow rounded space-y-4 mb-10">
            <h2 className="text-xl font-bold text-center">🔑 Change Password</h2>

            <div>
                <label className="block mb-1 font-medium">Current Password</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Submit
            </button>
        </form>
    );
};

export default ChangePasswordForm;
