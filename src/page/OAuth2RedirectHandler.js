// src/pages/OAuth2RedirectHandler.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const nickname = params.get("nickname");

        if (token && nickname) {
            localStorage.setItem("token", token);
            localStorage.setItem("nickname", nickname);
            navigate("/homepage", { state: { loginSuccess: true } });
        } else {
            navigate("/login", { state: { error: "Đăng nhập với Google thất bại!" } });
        }
    }, [location, navigate]);

    return null;
};

export default OAuth2RedirectHandler;
