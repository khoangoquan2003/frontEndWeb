import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { http } from "../../api/Http";

function CommentBox({ initialComments = [], courseId: propCourseId }) {
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [replyToId, setReplyToId] = useState(null);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [allReactions, setAllReactions] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const userId = parseInt(localStorage.getItem("userId"));
    console.log("UserId from localStorage:", userId);
    const userNickname = localStorage.getItem("nickname") || localStorage.getItem("userName") || "You";
    const courseId = propCourseId; // lấy courseId từ prop
    useEffect(() => {
        const storedUserId = parseInt(localStorage.getItem("userId"));
        console.log("UserId from localStorage on mount:", storedUserId);
    }, []);


    useEffect(() => {
        if (!userId || !userNickname) {
            alert("Bạn cần đăng nhập để bình luận!");
            // Optionally navigate to login page
        }
    }, []);

    useEffect(() => {
        fetchComments();
        fetchAllReactions();
    }, []);

    async function fetchComments() {
        try {
            const res = await http.get("/api/get-all-comment", { params: { courseId } });
            let data = res.data;

            if (!Array.isArray(data.result)) {
                data.result = [
                    { id: 1, content: "This course is very helpful!", user: { userName: "Alice" }, parentId: null, createDate: new Date().toISOString() },
                    { id: 2, content: "Thanks for the explanation!", user: { userName: "Bob" }, parentId: 1, createDate: new Date().toISOString() },
                    { id: 3, content: "I'm enjoying the course!", user: { userName: "Charlie" }, parentId: null, createDate: new Date().toISOString() },
                ];
            }

            const nestedComments = buildNestedComments(data.result);
            setComments(nestedComments);
            setCommentCount(data.result.length);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }

    function buildNestedComments(flatComments) {
        const map = {};
        const roots = [];

        flatComments.forEach((comment) => {
            map[comment.id] = { ...comment, replies: [] };
        });

        flatComments.forEach((comment) => {
            if (comment.parentId && map[comment.parentId]) {
                map[comment.parentId].replies.push(map[comment.id]);
            } else {
                roots.push(map[comment.id]);
            }
        });

        function sortByDate(arr) {
            arr.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
            arr.forEach((c) => {
                if (c.replies.length) sortByDate(c.replies);
            });
        }

        sortByDate(roots);
        return roots;
    }

    async function fetchAllReactions() {
        try {
            const res = await http.get("/api/show-reaction", { params: { courseId } });
            const data = res.data;
            const reactionMap = {};

            if (Array.isArray(data.result)) {
                data.result.forEach((item) => {
                    if (!reactionMap[item.commentId]) reactionMap[item.commentId] = [];
                    reactionMap[item.commentId].push({
                        userName: item.userName, // <-- thêm userName (đảm bảo API có trả về)
                        reaction: item.reaction,
                    });

                });
            }

            setAllReactions(reactionMap);
        } catch (error) {
            console.error("Error fetching reactions:", error);
        }
    }

    async function handleToggleLike(commentId) {
        try {
            const { currentUserReaction } = getReactionSummary(commentId);

            if (currentUserReaction === "Like") {
                await http.get("/api/delete-reaction", {
                    params: {
                        commentId,
                        userName: userNickname,
                        reaction: "Like"
                    }
                });

                // Xóa reaction ngay trong allReactions state
                setAllReactions((prev) => {
                    const updated = { ...prev };
                    updated[commentId] = (updated[commentId] || []).filter(r => r.userName !== userNickname);
                    return updated;
                });

            } else {
                await http.post("/api/reaction", {
                    userName: userNickname,
                    commentId,
                    courseId,
                    reaction: "Like"
                });

                // Thêm reaction mới ngay trong allReactions state
                setAllReactions((prev) => {
                    const updated = { ...prev };
                    if (!updated[commentId]) updated[commentId] = [];
                    updated[commentId].push({ userName: userNickname, reaction: "Like" });
                    return updated;
                });
            }

            // Có thể gọi fetchAllReactions() nếu muốn đồng bộ lại, hoặc bỏ đi nếu đã cập nhật trên state

        } catch (error) {
            console.error("Error toggling like:", error);
        }
    }

    async function handleSubmitComment() {
        if (!newComment.trim()) return alert("Please enter a comment");

        try {
            const res = await http.post("/api/comment", {
                content: newComment,
                userId,
                courseId,
                parentId: replyToId || null,
            });

            console.log("Submitted comment result:", res.data); // <-- log để kiểm tra

            // ✅ Gọi lại để lấy từ backend thay vì thêm thủ công
            await fetchComments();

            setNewComment("");
            setReplyToId(null);
            setEmojiPickerVisible(false);
            setEditingCommentId(null);
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    }



    function getReactionSummary(commentId) {
        const reactionsList = allReactions[commentId] || [];
        let currentUserReaction = null;

        reactionsList.forEach((r) => {
            if (r.userName === userNickname) {
                currentUserReaction = r.reaction;
            }
        });

        return { currentUserReaction };
    }


    function timeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} days ago`;
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths} months ago`;
        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} years ago`;
    }

    function startEditing(comment) {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
        setReplyToId(null);
        setEmojiPickerVisible(false);
    }

    async function handleSaveEdit(commentId) {
        if (!editContent.trim()) return alert("Content cannot be empty");

        try {
            await http.put("/api/update-comment", {
                commentId,
                content: editContent,
                userId
            });



            // Update trong state
            setComments((prev) => updateCommentContent(prev, commentId, editContent));
            setEditingCommentId(null);
            setEditContent("");
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    }

    function updateCommentContent(comments, commentId, newContent) {
        return comments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, content: newContent };
            }
            if (comment.replies?.length) {
                return { ...comment, replies: updateCommentContent(comment.replies, commentId, newContent) };
            }
            return comment;
        });
    }
    function getLikeCount(commentId) {
        return (allReactions[commentId] || []).filter(r => r.reaction === "Like").length;
    }

    function renderComment(comment, level = 0) {
        const { currentUserReaction } = getReactionSummary(comment.id);
        const indentClass = `ml-${Math.min(level * 4, 12)}`;

        // Lấy username thống nhất
        const username = comment.user?.userName || comment.userName || "Unknown";

        return (
            <div key={comment.id} className={`mb-4 ${indentClass}`}>
                <div className="flex space-x-3">
                    {/* Avatar chỉ 1 cái, lấy ký tự đầu của username */}
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                        {username.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 text-sm text-gray-600">
                        <div className="font-semibold">
                            {username}
                            <span className="text-gray-400 text-xs ml-2">({timeAgo(comment.createDate)})</span>
                        </div>

                        {editingCommentId === comment.id ? (
                            <div>
                            <textarea
                                rows={3}
                                className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Edit your comment..."
                                maxLength={500}
                                autoFocus
                            />
                                <div className="text-right text-xs text-gray-500 mt-1">
                                    {editContent.length} / 500
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleSaveEdit(comment.id)}
                                        className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-1 rounded"
                                        disabled={!editContent.trim()}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingCommentId(null);
                                            setEditContent("");
                                        }}
                                        className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-1 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-1">{comment.content}</p>
                        )}

                        {/* Like / Unlike */}
                        <div className="mt-2 flex items-center gap-4">
                            <button
                                onClick={() => handleToggleLike(comment.id)}
                                className={`flex items-center gap-1 px-3 py-1 rounded transition font-medium ${
                                    currentUserReaction === "Like"
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {currentUserReaction === "Like" ? "💙 Liked" : "👍 Like"}
                            </button>





                            {/* Reply */}
                            <button
                                className="text-blue-600 underline"
                                onClick={() => {
                                    setReplyToId(comment.id);
                                    setNewComment("");
                                    setEmojiPickerVisible(false);
                                    setEditingCommentId(null);
                                }}
                            >
                                Reply
                            </button>
                            {/* Edit */}
                            {(comment.user?.userId || comment.userId) === userId && (
                                <button
                                    className="text-green-600 underline"
                                    onClick={() => startEditing(comment)}
                                >
                                    Edit
                                </button>
                            )}

                            {/* Delete */}
                            {(comment.user?.userId || comment.userId) === userId && (
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-red-600 underline"
                                >
                                    Delete
                                </button>
                            )}




                        </div>

                        {replyToId === comment.id && editingCommentId === null && (
                            <div className="mt-2">
                            <textarea
                                rows={3}
                                className="w-full p-2 border rounded"
                                placeholder="Enter your reply..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                                <div className="flex items-center gap-3 mt-2">
                                    <button onClick={toggleEmojiPicker} className="bg-gray-600 text-white px-3 py-1 rounded">
                                        😀
                                    </button>
                                    <button onClick={handleSubmitComment} className="bg-green-600 text-white px-4 py-1 rounded">
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setReplyToId(null);
                                            setNewComment("");
                                            setEmojiPickerVisible(false);
                                        }}
                                        className="bg-red-600 text-white px-4 py-1 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {emojiPickerVisible && <EmojiPicker onEmojiClick={(e) => setNewComment((prev) => prev + e.emoji)} />}
                            </div>
                        )}

                        {comment.replies?.length > 0 && (
                            <div className="mt-3">
                                {comment.replies.map((reply) => renderComment(reply, level + 1))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }



    async function handleDeleteComment(commentId) {
        const userId = parseInt(localStorage.getItem("userId"));
        if (!userId) {
            alert("Bạn cần đăng nhập để xóa comment");
            return;
        }

        // Thêm xác nhận
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bình luận này và tất cả phản hồi của nó không?");
        if (!confirmDelete) return;

        try {
            await http.delete("/api/delete-comment", {
                params: { commentId, userId }  // gửi dưới dạng query param
            });
            setComments((prev) => deleteCommentById(prev, commentId));
            setCommentCount((prev) => prev - 1);
            alert("Xóa bình luận thành công!");
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Xóa bình luận thất bại");
        }
    }

    function deleteCommentById(comments, commentId) {
        return comments
            .filter((c) => c.id !== commentId)
            .map((c) => ({
                ...c,
                replies: deleteCommentById(c.replies || [], commentId),
            }));
    }

    function toggleEmojiPicker() {
        setEmojiPickerVisible((prev) => !prev);
    }

    return (
        <div className="max-w-xl mx-auto p-4 bg-white border rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">💬 Comments ({commentCount})</h3>
                <button
                    onClick={() => setIsCommentsOpen((prev) => !prev)}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
                >
                    {isCommentsOpen ? "Hide" : "Show"}
                </button>
            </div>

            {isCommentsOpen && (
                <div className="space-y-6">

                    {/* ✅ Form bình luận đặt trước danh sách comment */}
                    {!replyToId && editingCommentId === null && (
                        <div className="mt-4">
                <textarea
                    rows={3}
                    className="w-full p-2 border rounded"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                            <div className="flex items-center gap-3 mt-2">
                                <button onClick={toggleEmojiPicker} className="px-3 py-1 bg-gray-600 text-white rounded">
                                    😀
                                </button>
                                <button onClick={handleSubmitComment} className="px-4 py-1 bg-green-600 text-white rounded">
                                    Submit
                                </button>
                            </div>
                            {emojiPickerVisible && (
                                <div className="mt-2">
                                    <EmojiPicker onEmojiClick={(e) => setNewComment((prev) => prev + e.emoji)} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* ✅ Danh sách các bình luận */}
                    {comments.map(renderComment)}
                </div>
            )}

        </div>
    );
}

export default CommentBox;
