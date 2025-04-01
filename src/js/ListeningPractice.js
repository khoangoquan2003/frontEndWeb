import React from "react";

const ListeningPractice = () => {
    return (
        <section className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-center">Các bước luyện nghe - chép chính tả</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bước 1 */}
                <div className="text-center">
                    <img src="https://via.placeholder.com/100" alt="Listen" className="mx-auto mb-2" />
                    <h4 className="font-bold text-lg">1. Nghe audio</h4>
                    <p className="text-gray-600">Lắng nghe thật kỹ để hiểu nội dung.</p>
                </div>
                {/* Bước 2 */}
                <div className="text-center">
                    <img src="https://via.placeholder.com/100" alt="Type" className="mx-auto mb-2" />
                    <h4 className="font-bold text-lg">2. Ghi lại những gì bạn nghe</h4>
                    <p className="text-gray-600">Gõ lại những gì bạn nghe được để kiểm tra chính tả.</p>
                </div>
                {/* Bước 3 */}
                <div className="text-center">
                    <img src="https://via.placeholder.com/100" alt="Check" className="mx-auto mb-2" />
                    <h4 className="font-bold text-lg">3. Kiểm tra & sửa lỗi</h4>
                    <p className="text-gray-600">So sánh với transcript để xem bạn sai ở đâu.</p>
                </div>
                {/* Bước 4 */}
                <div className="text-center">
                    <img src="https://via.placeholder.com/100" alt="Read" className="mx-auto mb-2" />
                    <h4 className="font-bold text-lg">4. Đọc lại thành tiếng</h4>
                    <p className="text-gray-600">Thực hành phát âm bằng cách đọc to nội dung đã nghe.</p>
                </div>
            </div>
        </section>
    );
};

export default ListeningPractice;
