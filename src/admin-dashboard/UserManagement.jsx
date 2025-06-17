import React, { useState, useEffect } from 'react';
import { http } from "../api/Http";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    // Thêm avatarFile và avatarPreview (hiển thị preview ảnh trong form)
    const [formData, setFormData] = useState({ id: null, username: '', email: '', role: '', avatarFile: null, avatarPreview: '' });

    const currentUserId = parseInt(localStorage.getItem("userId"));

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await http.get('/api/get-all-user');
            if (response.data.code === 200) {
                const mappedUsers = response.data.result.map(user => ({
                    id: user.id,
                    username: user.userName || 'N/A',
                    email: user.gmail || 'N/A',
                    role: user.roles?.[0] || 'User',
                    img: user.img || ''
                }));
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users!');
        }
    };

    const resetForm = () => {
        setFormData({ id: null, username: '', email: '', role: '', avatarFile: null, avatarPreview: '' });
        setShowForm(false);
    };

    const handleSaveUser = async () => {
        const { id, username, email, role, avatarFile } = formData;

        if (!username || !email || !role) {
            alert('Please fill all fields!');
            return;
        }

        try {
            const formDataToSend = new FormData();

            const data = {
                userId: id,
                userName: username,
                gmail: email,
                role: role.toUpperCase(),
            };

            formDataToSend.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

            if (avatarFile) {
                formDataToSend.append("avatar", avatarFile);
            }

            const response = await http.put('/api/edit-user', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.code === 200) {
                alert("User updated successfully!");

                const updatedUser = response.data.result;
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === updatedUser.id
                            ? {
                                id: updatedUser.id,
                                username: updatedUser.userName,
                                email: updatedUser.gmail || 'N/A',
                                role: updatedUser.roles?.[0] || 'USER',
                                img: updatedUser.img || '',
                            }
                            : user
                    )
                );
                resetForm();
            } else {
                alert("Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error updating user");
        }
    };

    const handleEditUser = (id) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setFormData({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatarFile: null,          // Mặc định chưa chọn file mới
                avatarPreview: user.img,   // Hiển thị avatar hiện tại
            });
            setShowForm(true);
        }
    };

    async function handleDeleteUser(id) {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            // Gửi request xóa user
            await http.delete('/api/delete-user', { params: { userId: id } });

            // Cập nhật state users loại bỏ user đã xóa
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));

            alert('User deleted successfully!');
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Error deleting user.');
        }
    }


    return (
        <div style={{ padding: '20px', marginLeft: '16rem' }}>
            <div className="user-management-container">
                <div className="header flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">👥 User Management</h2>
                    {/*<button*/}
                    {/*    onClick={() => setShowForm(true)}*/}
                    {/*    className="bg-blue-600 text-white p-2 rounded-md"*/}
                    {/*>*/}
                    {/*    + Add New User*/}
                    {/*</button>*/}
                </div>

                <div className="user-list mt-6">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                        <tr>
                            <th className="border-b p-4 text-left">Avatar</th>
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
                                    <td className="border-b p-4">
                                        {user.img ? (
                                            <img src={user.img} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 italic">No Image</span>
                                        )}
                                    </td>
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
                                        {/* Ẩn nút Delete nếu là chính user đang đăng nhập */}
                                        {user.id !== currentUserId && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 px-2 py-1"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-4 text-center">No users found</td>
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

                            {/* Avatar upload */}
                            <label className="block mb-2">Avatar:</label>

                            {formData.avatarPreview ? (
                                <img
                                    src={formData.avatarPreview}
                                    alt="avatar preview"
                                    className="w-20 h-20 rounded-full object-cover mb-2"
                                />
                            ) : (
                                <span className="text-gray-400 italic mb-2 block">No Image</span>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setFormData(prev => ({
                                            ...prev,
                                            avatarFile: file,
                                            avatarPreview: URL.createObjectURL(file),
                                        }));
                                    }
                                }}
                                className="mb-4"
                            />

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