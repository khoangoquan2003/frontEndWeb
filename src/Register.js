import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        console.log('User Registered:', { name, email, password });
        // Thực hiện đăng ký (Gửi dữ liệu lên backend...)
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Đăng Ký</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Tên"
                        className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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