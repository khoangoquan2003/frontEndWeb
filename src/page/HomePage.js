import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListeningPractice from "../components/dictation/ListeningPractice";
import dlImage from "../assets/img/1.jpg";
import { toast } from "react-toastify";

const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");

    useEffect(() => {
        if (location.state?.loginSuccess) {
            toast.success("🎉 Đăng nhập thành công!", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // ✅ Xóa state sau khi toast để không hiện lại khi F5
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);


    useEffect(() => {
        const name = localStorage.getItem("nickname");
        if (name) setNickname(name);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        toast.info("👋 Bạn đã đăng xuất", {
            position: "top-right",
            autoClose: 2000,
        });
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <img src={dlImage} alt="Download" className="w-10 h-10" />
                    <h1 className="text-xl font-bold">Học Tiếng Anh</h1>
                </div>
                <div className="space-x-4">
                    {nickname ? (
                        <>
                            <span className="text-gray-700 font-semibold">👋 Xin chào, {nickname}!</span>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập</Link>
                            <Link to="/register" className="text-blue-500 hover:underline">Đăng ký</Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="text-center py-16 bg-blue-500 text-white">
                <h1 className="text-4xl font-bold mb-4">
                    Luyện tập tiếng Anh mỗi ngày với bài tập nghe - chép chính tả
                </h1>
                <p className="text-lg mb-6">
                    Cách nhanh nhất để nâng cao kỹ năng nghe và phát âm của bạn!
                </p>
                <Link to="/topics">
                    <button className="bg-white text-blue-500 px-6 py-3 rounded-md font-bold hover:bg-gray-200">
                        Bắt đầu ngay
                    </button>
                </Link>
            </section>

            {/* Lợi ích của phương pháp */}
            <section className="p-8 bg-white shadow mt-6 text-center">
                <h3 className="text-2xl font-bold mb-4">Tại sao nên luyện nghe - chép chính tả?</h3>
                <p className="text-gray-700 max-w-2xl mx-auto">
                    Khi luyện tập trên trang web này, bạn sẽ được tiếp cận với phương pháp học nghe hiện đại, giúp bạn cải thiện kỹ năng nghe, phát âm, chính tả và từ vựng.
                </p>
            </section>

            {/* Các bước luyện nghe */}
            <ListeningPractice />

            {/* CTA */}
            <section className="text-center py-12 bg-gray-100">
                <h2 className="text-3xl font-bold mb-4">Sẵn sàng cải thiện kỹ năng tiếng Anh của bạn?</h2>
                <Link to="/dictation">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-600">
                        Bắt đầu học ngay
                    </button>
                </Link>
            </section>
            {/* Section: Practice Categories */}
            <section className="py-12 bg-white px-4 md:px-12">
                <h2 className="text-3xl font-bold text-center mb-8">Các chủ đề luyện nghe</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1: Short Stories */}
                    <div className="bg-gray-50 p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">Short Stories</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            A collection of audio articles introducing culture, people, places, historical events and daily life in English-speaking countries, especially Canada and America.
                        </p>
                        <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                            <li>First snowfall</li>
                            <li>Jessica's first day of school</li>
                            <li>My flower garden</li>
                            <li>Going camping</li>
                            <li>My house</li>
                        </ul>
                        <Link to="/short-stories" className="text-blue-500 hover:underline text-sm">View all</Link>
                    </div>

                    {/* Card 2: Daily Conversations */}
                    <div className="bg-gray-50 p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">Daily Conversations</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Short and fun English conversations in common situations you may experience in daily life.
                        </p>
                        <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                            <li>At home (1)</li>
                            <li>At home (2)</li>
                            <li>My Favorite Photographs (1)</li>
                            <li>Location</li>
                            <li>Location (2)</li>
                        </ul>
                        <Link to="/daily-conversations" className="text-blue-500 hover:underline text-sm">View all</Link>
                    </div>

                    {/* Card 3: TOEIC Listening */}
                    <div className="bg-gray-50 p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">TOEIC Listening</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Conversations and short talks in everyday life and at work. Let's improve your English communication skills!
                        </p>
                        <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                            <li>Conversation 1 - 4</li>
                            <li>Short Talk 1 - 4</li>
                        </ul>
                        <Link to="/toeic-listening" className="text-blue-500 hover:underline text-sm">View all</Link>
                    </div>

                    {/* Card 4: YouTube */}
                    <div className="bg-gray-50 p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">YouTube</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Learn real English from YouTube videos that native speakers watch and enjoy!
                        </p>
                        <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                            <li>The Egg</li>
                            <li>The Art of Balancing Stones</li>
                            <li>Why Boredom is Good For You</li>
                            <li>Wolf Pack Hunts A Hare</li>
                            <li>Leonardo da Vinci</li>
                        </ul>
                        <Link to="/youtube" className="text-blue-500 hover:underline text-sm">View all</Link>
                    </div>

                    {/* Card 5: IELTS Listening */}
                    <div className="bg-gray-50 p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">IELTS Listening</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Practice with everyday conversations & academic talks in British and Australian accents.
                        </p>
                        <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                            <li>CAM 19 - Test 1 - Part 1–4</li>
                            <li>CAM 19 - Test 2 - Part 1–4</li>
                        </ul>
                        <Link to="/ielts-listening" className="text-blue-500 hover:underline text-sm">View all</Link>
                    </div>

                    {/* Card 6: TOEFL Listening */}
                    <div className="bg-gray-50 p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">TOEFL Listening</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Academic conversations & lectures in American English to help you prepare for studying abroad.
                        </p>
                        <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                            <li>Conversation 1–4</li>
                            <li>Lecture 1–4</li>
                        </ul>
                        <Link to="/toefl-listening" className="text-blue-500 hover:underline text-sm">View all</Link>
                    </div>

                    {/* Card 7: Spelling Names */}
                    <div className="bg-gray-50 p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">Spelling Names</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Learn the English alphabet by spelling common English names and animals.
                        </p>
                        <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                            <li>Female Names</li>
                            <li>Male Names</li>
                            <li>Last Names</li>
                            <li>Animal Names</li>
                        </ul>
                        <Link to="/spelling-names" className="text-blue-500 hover:underline text-sm">View all</Link>
                    </div>

                    {/* Card 8: Numbers */}
                    <div className="bg-gray-50 p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">Numbers</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Practice understanding English numbers spoken quickly in American accents.
                        </p>
                        <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
                            <li>Phone numbers</li>
                            <li>Numbers (1–4)</li>
                        </ul>
                        <Link to="/numbers" className="text-blue-500 hover:underline text-sm">View all</Link>
                    </div>
                </div>
            </section>
            {/* FAQs Section */}
            <section className="py-12 bg-gray-100 px-4 md:px-12">
                {/* Dòng 1: Tiêu đề */}
                <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

                {/* Dòng 2 & 3: Grid 2 cột */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-gray-800">
                    {/* Câu hỏi 1 */}
                    <div>
                        <h4 className="font-semibold text-lg mb-1">Is this program free?</h4>
                        <p className="text-sm">Yes, it's 100% FREE!</p>
                    </div>

                    {/* Câu hỏi 2 */}
                    <div>
                        <h4 className="font-semibold text-lg mb-1">Is this website for beginners?</h4>
                        <p className="text-sm">
                            As long as you can understand this page, you're good to go! But it's better if you know basic English pronunciation,
                            if you don't, watch this YouTube series.
                        </p>
                    </div>

                    {/* Câu hỏi 3 */}
                    <div>
                        <h4 className="font-semibold text-lg mb-1">How long will it take to become fluent with this website?</h4>
                        <p className="text-sm">
                            It depends on many things (such as your current level, how many hours you will spend each day).
                            I can only say that your English will improve very quickly with this method.
                        </p>
                    </div>

                    {/* Câu hỏi 4 */}
                    <div>
                        <h4 className="font-semibold text-lg mb-1">Will my speaking skills improve using this method?</h4>
                        <p className="text-sm">
                            Speaking and listening skills are related together, once you have better listening skills, it's much easier and faster to improve your speaking skills.
                            Also, you can try to read out loud what you hear, your skills will improve really quickly!
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
