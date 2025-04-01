import React from 'react';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <img src="https://via.placeholder.com/40" alt="Logo" className="w-10 h-10" />
                    <h1 className="text-xl font-bold">Luyện Nghe Tiếng Anh</h1>
                </div>
                <div className="space-x-4">
                    <a href="#" className="text-blue-500 hover:underline">Đăng nhập</a>
                    <a href="#" className="text-blue-500 hover:underline">Đăng ký</a>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-8">
                <h2 className="text-3xl font-bold mb-4">Luyện tập tiếng Anh với bài tập nghe - chép chính tả</h2>
                <p className="text-gray-700 mb-4">
                    Chép chính tả là một phương pháp học ngôn ngữ bằng cách nghe và viết lại những gì bạn nghe được. Đây là một phương pháp cực kỳ hiệu quả!
                </p>
                <p className="text-gray-700 mb-6">
                    Trang web này chứa hàng ngàn bản ghi âm và video giúp người học tiếng Anh luyện tập dễ dàng và cải thiện nhanh chóng.
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Bắt đầu ngay</button>
            </main>

            {/* How It Helps */}
            <section className="p-8 bg-white shadow mt-6">
                <h3 className="text-2xl font-bold mb-4">Lợi ích của việc luyện nghe - chép chính tả?</h3>
                <p className="text-gray-700">
                    Khi luyện tập trên trang web này, bạn sẽ trải qua 4 bước chính, tất cả đều quan trọng như nhau!
                </p>
            </section>
        </div>
    );
};

export default HomePage;
