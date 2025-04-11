import React from "react";
import { Link } from "react-router-dom"; // Import Link
import ListeningPractice from "./ListeningPractice";
import dlImage from "../img/1.jpg";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <img src={dlImage} alt="Download" className="w-10 h-10" />
                    <h1 className="text-xl font-bold">Luyện Nghe Tiếng Anh</h1>
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập</Link>
                    <Link to="/register" className="text-blue-500 hover:underline">Đăng ký</Link>
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
                <Link to="/register">
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
                <Link to="/register">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-600">
                        Bắt đầu học ngay
                    </button>
                </Link>
            </section>
        </div>
    );
};

export default HomePage;
