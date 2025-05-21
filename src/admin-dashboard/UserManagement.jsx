import React, { useState } from 'react';

const sampleUsers = [
    { id: 1, username: 'john_doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, username: 'jane_doe', email: 'jane@example.com', role: 'User' },
];

export default function UserManagement() {
    const [users, setUsers] = useState(sampleUsers);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', role: '' });

    const handleAddUser = () => {
        if (!formData.username || !formData.email || !formData.role) {
            alert('Please fill all fields!');
            return;
        }
        const newUser = {
            id: users.length + 1,
            ...formData
        };
        setUsers([...users, newUser]);
        setFormData({ username: '', email: '', role: '' });
        setShowForm(false);
    };

    const handleDeleteUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const handleEditUser = (id) => {
        const userToEdit = users.find(user => user.id === id);
        setFormData(userToEdit);
        setShowForm(true);
    };

    return (
        <div style={{ padding: '20px', marginLeft: '16rem' }}> {/* Thêm margin-left để tránh bị che khuất bởi sidebar */}
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
                        {users.map(user => (
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
                        ))}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <div className="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                        <div className="modal-content bg-white p-6 rounded-md w-1/3">
                            <h3 className="text-xl mb-4">{formData.id ? 'Edit User' : 'Add New User'}</h3>
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
                                    onClick={handleAddUser}
                                    className="bg-blue-600 text-white p-2 rounded-md mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
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
