import React, { useState, useEffect } from 'react';
import { http } from '../api/Http';
import { toast } from 'react-toastify';

const ChangeEmailForm = () => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('email') || '';
        setCurrentEmail(storedEmail);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        if (!userId) {
            toast.error("User not logged in.");
            return;
        }

        try {
            await http.put(`/api/change-gmail`, null, {
                params: {
                    userId,
                    gmail: newEmail
                }
            });

            toast.success("Email updated successfully!");
            setCurrentEmail(newEmail);
            localStorage.setItem("email", newEmail);
            setNewEmail('');

        } catch (error) {
            console.error("Failed to change email:", error);
            toast.error("Failed to update email.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-6 p-4 bg-white shadow rounded space-y-4 mb-10"
        >
            <h2 className="text-xl font-bold text-center">✉️ Change Email</h2>
            <p className="text-sm text-gray-600">
                Current email: <span className="font-medium">{currentEmail || "Unknown"}</span>
            </p>
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
               Submit
            </button>
        </form>

    );
};

export default ChangeEmailForm;
