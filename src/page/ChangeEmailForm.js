import React, { useState, useEffect } from 'react';

const ChangeEmailForm = () => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        // Giả định email hiện tại từ localStorage
        const storedEmail = localStorage.getItem('email') || 'user@example.com';
        setCurrentEmail(storedEmail);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New Email:", newEmail);
        // Gọi API đổi email tại đây
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-4 bg-white shadow rounded space-y-4">
            <h2 className="text-xl font-bold text-center">✉️ Change Email</h2>
            <p className="text-sm text-gray-600">Current email: <span className="font-medium">{currentEmail}</span></p>
            <div>
                <label className="block mb-1 font-medium">New Email</label>
                <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
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

export default ChangeEmailForm;
