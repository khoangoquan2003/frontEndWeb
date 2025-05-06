import { useState } from "react";

const CommentBox = ({ comments }) => {
    const [isOpen, setIsOpen] = useState(false); // Trạng thái để điều khiển xem bình luận mới
    const [newComment, setNewComment] = useState(""); // Dữ liệu của bình luận mới

    // Hàm để mở/đóng phần bình luận mới
    const toggleComments = () => {
        setIsOpen(!isOpen);
    };

    // Hàm xử lý việc thêm bình luận mới
    const handleAddComment = () => {
        if (newComment.trim()) {
            comments.push(newComment); // Thêm bình luận mới vào mảng (sẽ cần refactor trong ứng dụng thực tế)
            setNewComment(""); // Xóa hộp nhập
        }
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h3 className="font-semibold text-yellow-700 mb-2">💬 Ghi chú</h3>

            {/* Hiển thị các bình luận hiện có */}
            <ul className="list-disc list-inside text-gray-800 space-y-1">
                {comments.map((c, i) => (
                    <li key={i}>{c}</li>
                ))}
            </ul>

            {/* Nút để mở/đóng phần bình luận mới */}
            <button
                onClick={toggleComments}
                className="text-blue-600 mt-2 underline"
            >
                {isOpen ? "Ẩn bình luận mới" : "Xem bình luận mới"}
            </button>

            {/* Hiển thị phần nhập bình luận mới */}
            {isOpen && (
                <div className="mt-3">
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận mới..."
                    />
                    <button
                        onClick={handleAddComment}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Thêm bình luận
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentBox;
