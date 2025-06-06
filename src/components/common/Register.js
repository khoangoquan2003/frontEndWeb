import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [nickName, setNickName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const payload = {
            username: userName,
            password,
            email,
            nickName
        };

        console.log("Dữ liệu gửi lên:", payload);

        try {
            const response = await axios.post("http://localhost:8080/auth/register", payload);

            console.log("Response từ server:", response.data);

            setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');

            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error('Lỗi:', err.response || err);
            setError(err.response?.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Nickname"
                        className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Register
                    </button>
                </form>
                <div className="text-sm text-center mt-3">
                    Have an account?{' '}
                    <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/login')}>
                        Login now
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
