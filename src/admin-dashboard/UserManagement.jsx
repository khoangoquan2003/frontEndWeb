import React, { useState, useEffect } from 'react';
import { http } from "../api/Http";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ id: null, username: '', email: '', role: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await http.get('/api/get-all-user');
            console.log('Raw API response:', response.data);

            if (response.data.code === 200) {
                const mappedUsers = response.data.result.map(user => ({
                    id: user.id,
                    username: user.userName || 'N/A',
                    email: user.gmail || 'N/A',
                    role: user.roles?.[0] || 'User',
                }));
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users!');
        }
    };

    const resetForm = () => {
        setFormData({ id: null, username: '', email: '', role: '' });
        setShowForm(false);
    };

    const handleSaveUser = () => {
        const { id, username, email, role } = formData;

        if (!username || !email || !role) {
            alert('Please fill all fields!');
            return;
        }

        if (id) {
            // Update user locally (replace with http.put if needed)
            setUsers(prevUsers =>
                prevUsers.map(user => user.id === id ? { id, username, email, role } : user)
            );
        } else {
            // Add user locally (replace with http.post if needed)
            const newUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                username,
                email,
                role
            };
            setUsers(prevUsers => [...prevUsers, newUser]);
        }

        resetForm();
    };

    const handleEditUser = (id) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setFormData({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });
            setShowForm(true);
        }
    };

    const handleDeleteUser = (id) => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    };

    return (
        <div style={{ padding: '20px', marginLeft: '16rem' }}>
            <div className="user-management-container">
                <div className="header flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">👥 User Management</h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white p-2 rounded-md"
                    >
                        + Add New User
                    </button>
                </div>

                <div className="user-list mt-6">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                        <tr>
                            <th className="border-b p-4 text-left">Username</th>
                            <th className="border-b p-4 text-left">Email</th>
                            <th className="border-b p-4 text-left">Role</th>
                            <th className="border-b p-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="border-b p-4">{user.username}</td>
                                    <td className="border-b p-4">{user.email}</td>
                                    <td className="border-b p-4">{user.role}</td>
                                    <td className="border-b p-4">
                                        <button
                                            onClick={() => handleEditUser(user.id)}
                                            className="text-blue-600 px-2 py-1 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 px-2 py-1"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center">No users found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <div className="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                        <div className="modal-content bg-white p-6 rounded-md w-1/3">
                            <h3 className="text-xl mb-4">
                                {formData.id ? 'Edit User' : 'Add New User'}
                            </h3>

                            <label className="block mb-2">Username:</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="border p-2 mb-4 w-full"
                            />

                            <label className="block mb-2">Email:</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="border p-2 mb-4 w-full"
                            />

                            <label className="block mb-2">Role:</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="border p-2 mb-4 w-full"
                            >
                                <option value="">Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>

                            <div className="modal-actions flex justify-end">
                                <button
                                    onClick={handleSaveUser}
                                    className="bg-blue-600 text-white p-2 rounded-md mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={resetForm}
                                    className="bg-gray-300 p-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
