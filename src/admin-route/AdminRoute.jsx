import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
    const token = localStorage.getItem("token");

    if (!token) {

        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const role = decoded.scope || decoded.role || decoded.authorities?.[0];
        console.log("Role: ", role);
        console.log("decoded: ", decoded);

        if (role === "ADMIN") {
            return <Outlet />;
        } else {
            return <Navigate to="/homepage" replace />;
        }
    } catch (error) {
        console.error("Token decode error:", error);
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;
