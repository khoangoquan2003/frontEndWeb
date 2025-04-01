import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [nickName, setNickName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        console.log("Dữ liệu gửi lên:", { nickName, userName, password });

        try {
            const response = await axios.post("http://localhost:8080/api/create-user", {
                nickName,
                userName,
                password
            });

            console.log("Response từ server:", response.data);

            if (response.data.result) {
                setSuccess('Đăng ký thành công!');

                // Chuyển ngay sang trang Login sau 1 giây
                setTimeout(() => navigate('/login'), 1000);
            } else {
                setError(response.data.message || 'Đăng ký thất bại! Vui lòng thử lại.');
            }
        } catch (err) {
            console.error('Lỗi:', err.response || err);
            setError(err.response?.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Đăng Ký</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Tên hiển thị"
                        className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Đăng Ký
                    </button>
                </form>
                <div className="text-sm text-center mt-3">
                    Đã có tài khoản?
                    <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/login')}>
                        Đăng nhập ngay
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
