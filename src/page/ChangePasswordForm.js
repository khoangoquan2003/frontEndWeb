
import React, { useState } from 'react';

const ChangePasswordForm = () => {
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New Password:", newPassword);
        // Gọi API đổi mật khẩu tại đây
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-4 bg-white shadow rounded space-y-4">
            <h2 className="text-xl font-bold text-center">🔑 Change Password</h2>
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
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Save
            </button>
        </form>
    );
};

export default ChangePasswordForm;
