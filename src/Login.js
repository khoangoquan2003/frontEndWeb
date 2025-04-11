import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
            {/* Tên trang và logo ở góc trái */}
            <div
                className="absolute top-4 left-4 flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate('/homepage')}
            >
                <img src="../src/img/dl.png" alt="Logo" className="w-10 h-10" />
                <span className="text-lg font-bold text-gray-700">Học Tiếng Anh</span>
            </div>

            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <button className="w-full flex items-center justify-center py-2 border rounded-md shadow-sm bg-white hover:bg-gray-100 text-gray-700 mb-4">
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" className="w-5 h-5 mr-2" />
                    Login with google
                </button>

                <div className="text-gray-500 text-sm text-center mb-4">Or enter your password</div>

                <input type="text" placeholder="Username or Email" className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300" />
                <input type="password" placeholder="Password" className="w-full p-2
                 rounded-md mb-3 focus:outline-none focus:ring focus:ring-blue-300" />

                <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">Submit</button>

                <div className="text-sm text-center mt-3">
                    <a href="#" className="text-blue-500 hover:underline">Forgot your password?</a>
                </div>
                <div className="text-sm text-center mt-1">
                    Haven't had an account?
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => navigate('/register')}
                    >
                        Register here
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
