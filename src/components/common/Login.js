import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dlImage from '../../assets/img/1.jpg';

const Login = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message before each login attempt

        // Simple email validation check
        const isEmail = userName.includes('@');
        if (isEmail && !/\S+@\S+\.\S+/.test(userName)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/auth/test-log-in", {
                userName,
                password
            }, {
                headers: { "Content-Type": "application/json" }
            });

            const token = response.data?.result?.token;
            const nickname = response.data?.result?.nickName;
            const userId = response.data?.result?.userId;
            if (token) {
                // Store the user info in localStorage, including username
                localStorage.setItem("token", token);
                localStorage.setItem("nickname", nickname);
                localStorage.setItem("userId", userId);
                localStorage.setItem("userName", userName); // Save username

                // Navigate to the HomePage
                navigate("/homepage", { state: { loginSuccess: true, nickname } });
            } else {
                setError("Incorrect username or password.");
            }

        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Login failed!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
            <div
                className="absolute top-4 left-4 flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate('/homepage')}
            >
                <img src={dlImage} alt="Download" className="w-10 h-10" />
                <span className="text-lg font-bold text-gray-700">Học Tiếng Anh</span>
            </div>

            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <a
                    href="http://localhost:8080/oauth2/authorization/google"
                    className="w-full flex items-center justify-center py-2 border rounded-md shadow-sm bg-white hover:bg-gray-100 text-gray-700 mb-4"
                >
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" className="w-5 h-5 mr-2" />
                    Login with Google
                </a>

                <div className="text-gray-500 text-sm text-center mb-4">Or enter your username/email and password</div>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username or Email"
                        className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
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
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                        Submit
                    </button>
                </form>

                <div className="text-sm text-center mt-3">
                    <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot your password?</a>
                </div>
                <div className="text-sm text-center mt-1">
                    Haven't had an account?
                    <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/register')}>
                        Register here
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
