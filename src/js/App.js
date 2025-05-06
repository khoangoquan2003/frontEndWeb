import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "../components/common/Login";
import HomePage from "../page/HomePage";
import Register from "../components/common/Register";
import DictationPractice from "../components/dictation/DictationPractice";
import Footer from "../components/layout/Footer";
import TopicList from '../components/dictation/TopicList';
import Header from '../components/layout/Header';
import TopicDetails from "../components/dictation/TopicDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DictationPage from "../components/dictation/DictationPage";
import Oauth2RedirectHandler from "../page/OAuth2RedirectHandler";
import TopUsers from "../page/TopUsers";
import Profile from '../page/Profile'; // đường dẫn tùy nơi bạn đặt
import ChangePassword from '../page/ChangePasswordForm'; // đường dẫn tùy nơi bạn đặt
import ChangeEmail from '../page/ChangeEmailForm'; // đường dẫn tùy nơi bạn đặt
import Notifications from "../page/Notifications";
import Comments from "../page/Comments";
import Favourites from "../page/Favourites";





const Layout = ({ children, nickname }) => {
    const location = useLocation();
    const hideHeaderFooter = ["/dictation", "/login", "/register"].includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {!hideHeaderFooter && <Header nickname={nickname} />}

            <main className="flex-grow">
                {children}
            </main>

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
            {/* Toast dùng toàn app */}
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

            <Layout nickname={nickname}>
                <Routes>
                    <Route path="/changePassword" element={<ChangePassword />} />
                    <Route path="/changeMail" element={<ChangeEmail />} />
                    <Route path="/favourites" element={<Favourites />} />

                    <Route path="/dictation" element={<DictationPage />} />
                    <Route path="/oauth2/redirect" element={<Oauth2RedirectHandler />} />
                    <Route path="/top-users" element={<TopUsers />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/comments" element={<Comments />} />
                    <Route path="/topic-details" element={<TopicDetails />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/homepage" element={<HomePage />} />
                    <Route path="/topics" element={<TopicList />} />
                    <Route path="/dictation" element={<DictationPractice />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default AppWrapper;
