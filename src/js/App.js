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

const Layout = ({ children, nickname }) => {
    const location = useLocation();
    const hideHeaderFooter = ["/", "/login", "/register"].includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {!hideHeaderFooter && <Header nickname={nickname} />}
            <div className="flex-grow">{children}</div>
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
            <Layout nickname={nickname}>
                <Routes>
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
