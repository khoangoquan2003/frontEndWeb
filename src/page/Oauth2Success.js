// src/pages/Oauth2Success.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Oauth2Success = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const name = params.get("name");
        const email = params.get("email");
        const picture = params.get("picture");

        if (name && email && picture) {
            localStorage.setItem("nickname", name);
            localStorage.setItem("email", email);
            localStorage.setItem("avatar", picture);
            navigate("/homepage");
        } else {
            navigate("/login");
        }
    }, [location, navigate]);

    return <p>🔄 Đang đăng nhập với Google...</p>;
};

export default Oauth2Success;
