import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { http } from "../../api/Http";
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa'; // Thêm thư viện react-icons
import { toast } from 'react-toastify';

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
    const [isProcessing, setIsProcessing] = useState(false); // Trạng thái xử lý
    const [expandedComments, setExpandedComments] = useState({});

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
            toast.warn("⚠️ Bạn cần đăng nhập để bình luận!");
            // Optionally navigate to login page
        }
    }, []);

    useEffect(() => {
        fetchComments();  // Lấy các bình luận
        fetchAllReactions();  // Lấy tất cả reactions (like/unlike)
    }, [courseId]); // Đảm bảo fetch lại khi courseId thay

    const toggleChildComments = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };


    const handleToggleLike = async (commentId) => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            const currentReactions = allReactions[commentId] || [];
            const alreadyLiked = currentReactions.some(r => r.userId === userId);

            const requestData = {
                userId,
                commentId,
                courseId,
                reaction: alreadyLiked ? "Like" : "Like"
            };

            await http.post("/api/reaction", requestData);

            // ✅ Cập nhật state allReactions ngay tại chỗ:
            const updatedReactions = alreadyLiked
                ? currentReactions.filter(r => r.userId !== userId) // Xóa like
                : [...currentReactions, { userId, commentId, courseId, reaction: "Like" }]; // Thêm like

            setAllReactions(prev => ({
                ...prev,
                [commentId]: updatedReactions
            }));
        } catch (error) {
            console.error("❌ Error toggling reaction:", error);
            toast.info("💬 Please enter a comment");
        } finally {
            setIsProcessing(false);
        }
    };

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

    const fetchAllReactions = async () => {
        try {
            const res = await http.get(`/api/show-reaction?courseId=${courseId}`);
            console.log("🎯 Reaction data from API:", res.data.result);

            const reactionsByComment = {};
            res.data.result.forEach(r => {
                if (!reactionsByComment[r.commentId]) {
                    reactionsByComment[r.commentId] = [];
                }
                reactionsByComment[r.commentId].push(r);
            });

            setAllReactions(reactionsByComment);
        } catch (error) {
            console.error("❌ Failed to fetch reactions", error);
        }
    };

    async function handleSubmitComment() {
        if (!newComment.trim()) return toast.warn("Please enter a comment");

        try {
            const res = await http.post("/api/comment", {
                content: newComment,
                userId,
                courseId,
                parentId: replyToId || null,
            });

            await fetchComments();

            // ✅ Nếu đang reply, mở rộng replies cho comment cha
            if (replyToId) {
                setExpandedComments(prev => ({
                    ...prev,
                    [replyToId]: true,
                }));
            }

            setNewComment("");
            setReplyToId(null);
            setEmojiPickerVisible(false);
            setEditingCommentId(null);
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    }

    function getReactionSummary(commentId) {
        const reactions = allReactions[commentId] || [];
        const currentUserReaction = reactions.find(
            reaction => Number(reaction.userId) === Number(userId)
        );
        console.log("🧪 Checking reactions for", commentId, reactions);
        console.log("👉 Current user ID:", userId);

        return {
            currentUserReaction: currentUserReaction || null,
            likeCount: reactions.filter(reaction => reaction.reaction === "Like").length
        };
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
        if (!editContent.trim()) return toast.warn("Content cannot be empty");

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

    function renderComment(comment, level = 0) {
        const { currentUserReaction } = getReactionSummary(comment.id);  // Lấy trạng thái like của người dùng
        const indentClass = `comment-container ml-${Math.min(level * 4, 12)}`;

        // Lấy username thống nhất
        const username = comment.user?.userName || comment.userName || "Unknown";

        // Đếm tổng số lượt like cho bình luận này
        const totalLikes = (allReactions[comment.id] || []).filter(reaction => reaction.reaction === "Like").length;

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
                                className={`flex items-center gap-1 transition-all duration-200 ${
                                    currentUserReaction?.reaction === "Like"
                                        ? "text-blue-600 scale-110"
                                        : "text-gray-600"
                                }`}
                            >
                                {currentUserReaction?.reaction === "Like" ? (
                                    <FaThumbsUp />
                                ) : (
                                    <FaRegThumbsUp />
                                )}
                                {currentUserReaction?.reaction === "Like" ? "Like" : "Like"}
                            </button>



                            <span>{totalLikes} Likes</span>  {/* Hiển thị tổng số lượt like */}

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
                                <button
                                    onClick={() => toggleChildComments(comment.id)}
                                    className="text-sm text-blue-500 underline mb-2"
                                >
                                    {expandedComments[comment.id] ? "Hide replies" : `Show ${comment.replies.length} replies`}
                                </button>

                                {expandedComments[comment.id] &&
                                    comment.replies.map((reply) => renderComment(reply, level + 1))}
                            </div>

                        )}
                    </div>
                </div>
            </div>
        );
    }


    function showConfirmToast(message, onConfirm) {
        const toastId = toast.info(
            ({ closeToast }) => (
                <div>
                    <div className="font-medium mb-2">{message}</div>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 bg-red-600 text-white rounded"
                            onClick={() => {
                                onConfirm();
                                closeToast();
                            }}
                        >
                            Xóa
                        </button>
                        <button
                            className="px-3 py-1 bg-gray-300 text-black rounded"
                            onClick={closeToast}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        );
    }


    async function handleDeleteComment(commentId) {
        const userId = parseInt(localStorage.getItem("userId"));
        if (!userId) {
            toast.warn("⚠️ Bạn cần đăng nhập để xóa comment");
            return;
        }

        showConfirmToast("Bạn có chắc chắn muốn xóa bình luận này và tất cả phản hồi của nó không?", async () => {
            try {
                await http.delete("/api/delete-comment", {
                    params: { commentId, userId }
                });

                setComments((prev) => deleteCommentById(prev, commentId));
                setCommentCount((prev) => prev - 1);
                toast.success("🗑️ Xóa bình luận thành công!");
            } catch (error) {
                console.error("Error deleting comment:", error);
                toast.error("❌ Xóa bình luận thất bại");
            }
        });
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
