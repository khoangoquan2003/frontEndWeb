import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const CommentBox = () => {
    const [newComment, setNewComment] = useState("");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [isCommentVisible, setIsCommentVisible] = useState(false);

    const onEmojiClick = (emojiData) => {
        setNewComment((prev) => prev + emojiData.emoji);
    };

    const toggleEmojiPicker = () => {
        setIsEmojiPickerOpen(!isEmojiPickerOpen);
    };

    const handleCommentSubmit = () => {
        alert(`Bình luận đã được thêm bởi: Khoa Ngo Quan`);
        // Bạn có thể xử lý thêm bình luận ở đây (như gửi lên server hoặc lưu trữ)
    };

    return (
        <div className="bg-white border border-gray-400 p-4 rounded shadow-md max-w-md mx-auto mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">💬 Bình luận</h3>

            {/* Hiển thị tên người đăng cố định */}
            <div className="font-semibold text-gray-800 mb-4">
                <span>Đăng bởi: </span><strong>Khoa Ngo Quan</strong>
            </div>

            {/* Hiển thị hoặc ẩn phần bình luận */}
            {isCommentVisible && (
                <textarea
                    className="w-full p-3 border border-gray-500 rounded text-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận mới..."
                    rows={4}
                />
            )}

            {/* Nút và emoji picker */}
            <div className="flex items-center gap-3 mt-4">
                <button
                    onClick={toggleEmojiPicker}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    😀
                </button>

                <button
                    onClick={() => setIsCommentVisible(!isCommentVisible)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                >
                    {isCommentVisible ? "Ẩn Bình luận" : "Thêm Bình luận"}
                </button>
            </div>

            {/* Emoji Picker */}
            {isEmojiPickerOpen && (
                <div className="mt-4">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}

            {/* Nút gửi bình luận */}
            {isCommentVisible && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleCommentSubmit}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
Submit
                     </button>
                </div>
            )}
        </div>
    );
};

export default CommentBox;
