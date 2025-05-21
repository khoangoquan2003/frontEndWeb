import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../api/Http"; // Đảm bảo import đúng file Http.js

const OAuthRedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOAuthData = async () => {
            try {
                // Gọi API backend để lấy dữ liệu người dùng sau khi đăng nhập OAuth
                const res = await http.get("/auth/success", { withCredentials: true });

                // Giả sử response chứa thông tin người dùng như name, email, picture, và token
                const { name, email, picture, token } = res.data;

                if (name && email && picture && token) {
                    // Lưu thông tin người dùng vào localStorage
                    localStorage.setItem("nickname", name);
                    localStorage.setItem("email", email);
                    localStorage.setItem("picture", picture);
                    localStorage.setItem("token", token); // Lưu token vào localStorage

                    // Sau khi lưu thông tin, chuyển hướng tới trang homepage
                    navigate("/homepage", { state: { loginSuccess: true } });
                } else {
                    console.error("Không tìm thấy thông tin người dùng từ OAuth!");
                    alert("Lỗi: Không nhận được thông tin người dùng. Vui lòng thử lại.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Lỗi xác thực OAuth:", error);
                alert("Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại sau.");
                navigate("/login");
            }
        };

        fetchOAuthData();

    }, [navigate]);

    return <p className="text-center mt-10">Đang xử lý đăng nhập...</p>;
};

export default OAuthRedirectHandler;
