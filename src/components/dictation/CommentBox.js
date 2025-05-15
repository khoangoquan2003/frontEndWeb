import { useEffect, useState } from "react";

const CommentBox = () => {
    const [comments, setComments] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentCount, setCommentCount] = useState(0); // Thêm trạng thái số lượng bình luận

    const userId = 1;
    const courseId = 1;

    const fetchComments = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/get-all-comment?courseId=${courseId}`
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Lỗi chi tiết từ server:", errorText);
                throw new Error("Lỗi khi tải bình luận");
            }

            const data = await response.json();

            if (Array.isArray(data.result)) {
                setComments(data.result);
                setCommentCount(data.result.length); // Cập nhật số lượng bình luận
            } else {
                console.error("Phản hồi không hợp lệ:", data);
                setComments([]);
                setCommentCount(0);
            }
        } catch (error) {
            console.error("Lỗi khi lấy bình luận:", error.message);
        }
    };

    // Gọi fetchComments khi component được render lần đầu tiên
    useEffect(() => {
        fetchComments();
    }, []);

    const toggleComments = async () => {
        const nextState = !isOpen;
        setIsOpen(nextState);

        if (nextState) {
            await fetchComments(); // Lấy lại bình luận và số lượng khi mở
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await fetch("http://localhost:8080/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment, userId, courseId }),
            });

            if (!response.ok) throw new Error("Lỗi khi gửi bình luận");

            await response.json();
            setNewComment("");
            await fetchComments(); // Gọi lại API để load bình luận mới
        } catch (error) {
            console.error("Lỗi khi gửi:", error.message);
        }
    };

    return (
        <div className="bg-gray-50 p-4 border rounded-md">
            <h3 className="font-bold text-gray-700 mb-3">💬 Bình luận</h3>
            <p className="text-gray-500 mb-3">Số lượng bình luận: {commentCount}</p> {/* Hiển thị số lượng bình luận */}

            <button
                onClick={toggleComments}
                className="text-blue-600 underline mb-4"
            >
                {isOpen ? "Ẩn bình luận mới" : "Xem bình luận mới"}
            </button>

            {isOpen && (
                <div>
                    <div className="space-y-4">
                        {comments.map((c, i) => (
                            <div key={i} className="flex space-x-3 items-start">
                                <div className="w-10 h-10 bg-gray-300 text-white flex items-center justify-center rounded">
                                    {c.userName?.[0]?.toUpperCase() || "U"}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">
                                            {c.userName || "Người dùng"}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {c.createDate || "Vừa xong"}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{c.content}</p>

                                    <div className="flex items-center space-x-4 mt-1 text-gray-500 text-sm">
                                        <span>👍</span>
                                        <span>👎</span>
                                        <span className="cursor-pointer hover:underline">
                                            Reply
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <textarea
                            className="w-full p-2 border rounded"
                            rows="3"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận..."
                        />
                        <button
                            onClick={handleAddComment}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Thêm bình luận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentBox;
