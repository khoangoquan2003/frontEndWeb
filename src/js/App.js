import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "../components/common/Login";
import Register from "../components/common/Register";
import HomePage from "../page/HomePage";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import BannerImage from "../components/layout/BannerImage";
import DictationPage from "../components/dictation/DictationPage";
import AudioPlayerPage from "../components/dictation/AudioPlayerPage";
import TopicList from "../components/dictation/TopicList";
import TopicDetails from "../components/dictation/TopicDetails";
import Oauth2RedirectHandler from "../page/OAuth2RedirectHandler";
import TopUsers from "../page/TopUsers";
import Profile from "../page/Profile";
import ChangePassword from "../page/ChangePasswordForm";
import ChangeEmail from "../page/ChangeEmailForm";
import Notifications from "../page/Notifications";
import Comments from "../page/Comments";
import Favourites from "../page/Favourites";
import DictationList from "../admin-dashboard/DictationList";
import AdminLayout from "../admin-dashboard/AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from '../admin-dashboard/Dashboard';
import UserManagement from '../admin-dashboard/UserManagement';  // Import thêm
import OAuthRedirectHandler from "../components/common/OAuthRedirectHandler";
import OAuthSuccess from '../components/common/OAuthSuccess';
import ForgotPassword from "../components/common/ForgotPassword";
import { Navigate } from "react-router-dom";
import CourseDetailPage from '../admin-dashboard/CourseDetailPage'; // THÊM DÒNG NÀY
import AdminRoute from "../admin-route/AdminRoute"; // 🔽 Import ở đầu file
import Settings from "../admin-dashboard/SystemSettingsForm";


const Layout = ({ children, nickname, onLogout }) => {
    const location = useLocation();

    // Trang không cần Header/Footer
    const hideHeaderFooter = ["/", "/login", "/register"].includes(location.pathname);

    // Trang không cần Banner
    const hideBanner =
        ["/", "/login", "/register", "/homepage","/forgot-password"].includes(location.pathname) ||
        location.pathname.startsWith("/admin");

    return (
        <div className="flex flex-col min-h-screen">
            {!hideHeaderFooter && <Header nickname={nickname} onLogout={onLogout} />}
            {!hideBanner && <BannerImage />}
            <main className="flex-grow">{children}</main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
};

function AppWrapper() {
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const storedNickname = localStorage.getItem("nickname");
        if (storedNickname) {
            setNickname(storedNickname);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("nickname"); // Xóa nickname khỏi localStorage
        setNickname(''); // Cập nhật lại nickname trong state để Header được re-render
    };

    return (
        <Router>
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Layout Pages */}
                <Route path="/admin" element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="dictations" element={<DictationList />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="course/:courseId" element={<CourseDetailPage />} />
                    </Route>
                </Route>




                {/* Default Layout Pages */}
                <Route
                    path="*"
                    element={
                        <Layout nickname={nickname} onLogout={handleLogout}>
                            <Routes>

                                <Route path="/oauth2/redirect" element={<OAuthRedirectHandler />} />
                                <Route path="/oauth-success" element={<OAuthSuccess />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/homepage" element={<HomePage />} />
                                <Route path="/dictation" element={<DictationPage />} />
                                <Route path="/dictation-page" element={<DictationPage />} />
                                <Route path="/audio-player" element={<AudioPlayerPage />} />
                                <Route path="/oauth2/redirect" element={<Oauth2RedirectHandler />} />
                                <Route path="/top-users" element={<TopUsers />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/changePassword" element={<ChangePassword />} />
                                <Route path="/changeMail" element={<ChangeEmail />} />
                                <Route path="/favourites" element={<Favourites />} />
                                <Route path="/notifications" element={<Notifications />} />
                                <Route path="/comments" element={<Comments />} />
                                <Route path="/topics" element={<TopicList />} />
                                <Route path="/topic-details" element={<TopicDetails />} />
                            </Routes>
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default AppWrapper;
