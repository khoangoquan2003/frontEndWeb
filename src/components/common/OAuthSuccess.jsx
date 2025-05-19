import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const name = params.get('name');
        const email = params.get('email');
        const picture = params.get('picture');

        setUserData({ token, name, email, picture });

        if (token && name) {
            localStorage.setItem('token', token);
            localStorage.setItem('nickname', name);
            localStorage.setItem('email', email);
            localStorage.setItem('picture', picture);

            setTimeout(() => {
                navigate('/homepage');
            }, 15000); // chờ 3s để xem UI
        } else {
            navigate('/homepage');
        }
    }, [navigate]);

    return (
        <div className="text-center mt-10 text-gray-600">
            <h2>Logging in with Google...</h2>
            {userData && (
                <div className="mt-4 text-left inline-block text-sm bg-gray-100 p-4 rounded">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Token:</strong> {userData.token?.slice(0, 20)}...</p>
                    <img src={userData.picture} alt="Google Avatar" className="mt-2 w-16 h-16 rounded-full" />
                </div>
            )}
        </div>
    );
};

export default OAuthSuccess;
