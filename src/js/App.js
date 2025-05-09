import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "../components/common/Login";
import HomePage from "../page/HomePage";
import Register from "../components/common/Register";
// import DictationPractice from "../components/dictation/DictationPractice";
import Footer from "../components/layout/Footer";
import TopicList from '../components/dictation/TopicList';
import Header from '../components/layout/Header';
import TopicDetails from "../components/dictation/TopicDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DictationPage from "../components/dictation/DictationPage";
import Oauth2RedirectHandler from "../page/OAuth2RedirectHandler";
import TopUsers from "../page/TopUsers";
import Profile from '../page/Profile';
import ChangePassword from '../page/ChangePasswordForm';
import ChangeEmail from '../page/ChangeEmailForm';
import Notifications from "../page/Notifications";
import Comments from "../page/Comments";
import Favourites from "../page/Favourites";
import AudioPlayerPage from "../components/dictation/AudioPlayerPage"; // Import mới
import BannerImage from '../components/layout/BannerImage'; // 👈 Thêm import

const Layout = ({ children, nickname }) => {
    const location = useLocation();

    // Các trang không hiển thị Header/Footer
    const hideHeaderFooter = ["/", "/login", "/register"].includes(location.pathname);

    // Các trang không hiển thị Banner
    const hideBanner = ["/", "/login", "/register", "/homepage"].includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {!hideHeaderFooter && <Header nickname={nickname} />}
            {!hideBanner && <BannerImage />} {/* 👈 Chỉ ẩn banner nếu nằm trong danh sách */}
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
                {/* Routes that do not need Header/Footer */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Routes that have Header/Footer */}
                <Route
                    path="*"
                    element={
                        <Layout nickname={nickname}>
                            <Routes>
                                <Route path="/homepage" element={<HomePage />} />

                                {/* Both dictation routes pointing to the same component */}
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
