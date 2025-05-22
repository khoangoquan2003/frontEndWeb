import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { http } from "../../api/Http"; // Đường dẫn API của bạn

const reactions = {
    Like: "👍",
    Love: "❤️",
    Care: "🥰",
    Haha: "😄",
    Wow: "😮",
    Sad: "😢",
    Angry: "😠",
};

function CommentBox({ initialComments = [], courseId: propCourseId }) {
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [isCommentsOpen, setIsCommentsOpen] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [replyToId, setReplyToId] = useState(null);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [hoverReactionFor, setHoverReactionFor] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [allReactions, setAllReactions] = useState({});

    const userId = 1; // Giả lập ID người dùng
    const courseId = 3; // Giả lập ID khóa học

    useEffect(() => {
        fetchComments();
        fetchAllReactions();
        setIsCommentsOpen(true);
    }, []);

    async function fetchComments() {
        try {
            const res = await http.get("/api/get-all-comment", { params: { courseId } });
            let data = res.data;

            // Nếu không có dữ liệu thì tạo mẫu bình luận mặc định
            if (!Array.isArray(data.result)) {
                data.result = [
                    {
                        id: 1,
                        content: "This course is very helpful!",
                        user: { userName: "Alice" },
                        parentId: null,
                        createDate: new Date().toISOString(),
                    },
                    {
                        id: 2,
                        content: "Thanks for the explanation!",
                        user: { userName: "Bob" },
                        parentId: 1,
                        createDate: new Date().toISOString(),
                    },
                    {
                        id: 3,
                        content: "I'm enjoying the course!",
                        user: { userName: "Charlie" },
                        parentId: null,
                        createDate: new Date().toISOString(),
                    },
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
            arr.sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
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
                        userId: item.userId,
                        reaction: item.reaction,
                    });
                });
            }

            setAllReactions(reactionMap);
        } catch (error) {
            console.error("Error fetching reactions:", error);
        }
    }

    async function handleSendReaction(commentId, reaction) {
        try {
            const { currentUserReaction } = getReactionSummary(commentId);

            if (currentUserReaction === reaction) {
                await http.get("/api/delete-reaction", { params: { commentId, userId, reaction } });
            } else if (currentUserReaction) {
                await http.post("/api/change-reaction", { commentId, userId, reaction });
            } else {
                await http.post("/api/reaction", { userId, commentId, courseId, reaction });
            }

            fetchAllReactions();
            setHoverReactionFor(null);
        } catch (error) {
            console.error("Error handling reaction:", error);
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

            const createdComment = {
                id: res.data?.result?.id || Date.now(),
                content: newComment,
                user: { userName: "You" },
                parentId: replyToId || null,
                replies: [],
                createDate: new Date().toISOString(),
            };

            setComments((prev) => {
                if (replyToId) {
                    return updateReplies(prev, replyToId, createdComment);
                }
                return [createdComment, ...prev];
            });

            setNewComment("");
            setReplyToId(null);
            setEmojiPickerVisible(false);
            setCommentCount((prev) => prev + 1);
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    }

    function updateReplies(comments, parentId, reply) {
        return comments.map((comment) => {
            if (comment.id === parentId) {
                return { ...comment, replies: [...comment.replies, reply] };
            }
            if (comment.replies?.length) {
                return { ...comment, replies: updateReplies(comment.replies, parentId, reply) };
            }
            return comment;
        });
    }

    function getReactionSummary(commentId) {
        const reactionsList = allReactions[commentId] || [];
        const countByType = {};
        let currentUserReaction = null;

        reactionsList.forEach((r) => {
            countByType[r.reaction] = (countByType[r.reaction] || 0) + 1;
            if (r.userId === userId) {
                currentUserReaction = r.reaction;
            }
        });

        return { countByType, currentUserReaction };
    }

    function handleEmojiClick(emojiData) {
        setNewComment((prev) => prev + emojiData.emoji);
    }

    function toggleEmojiPicker() {
        setEmojiPickerVisible((prev) => !prev);
    }

    async function handleDeleteComment(commentId) {
        try {
            await http.delete(`/api/comment/${commentId}`, { params: { userId, courseId } });

            setComments((prev) => deleteCommentById(prev, commentId));
            setCommentCount((prev) => prev - 1);
        } catch (error) {
            console.error("Error deleting comment:", error);
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

    function renderComment(comment, level = 0) {
        const { countByType, currentUserReaction } = getReactionSummary(comment.id);
        const indentClass = `ml-${Math.min(level * 4, 12)}`;

        return (
            <div key={comment.id} className={`mb-4 ${indentClass}`}>
                <div className="flex space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                        {comment.user.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 text-sm text-gray-600">
                        <div className="font-semibold">
                            {comment.user.userName}{" "}
                            <span className="text-gray-400 text-xs">({timeAgo(comment.createDate)})</span>
                        </div>
                        <p className="mt-1">{comment.content}</p>

                        <div className="flex gap-2 mt-2 flex-wrap">
                            {Object.entries(countByType).map(([key, count]) => (
                                <div
                                    key={key}
                                    onClick={() => handleSendReaction(comment.id, key)}
                                    className={`text-sm px-2 py-1 border rounded-full cursor-pointer flex items-center gap-1 ${
                                        currentUserReaction === key ? "bg-blue-100 border-blue-400" : "bg-gray-100"
                                    }`}
                                >
                                    <span>{reactions[key]}</span>
                                    <span>{count}</span>
                                </div>
                            ))}
                        </div>

                        <div
                            className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline"
                            onClick={() => {
                                setReplyToId(comment.id);
                                setNewComment("");
                                setEmojiPickerVisible(false);
                            }}
                        >
                            Reply
                        </div>

                        {replyToId === comment.id && (
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
                                        Send
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
                                {emojiPickerVisible && <EmojiPicker onEmojiClick={handleEmojiClick} />}
                            </div>
                        )}

                        <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 text-sm mt-2 cursor-pointer hover:underline"
                        >
                            Delete
                        </button>

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
                    {comments.map(renderComment)}

                    {!replyToId && (
                        <div className="mt-4">
                            <textarea
                                rows={3}
                                className="w-full p-2 border rounded"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={toggleEmojiPicker}
                                    className="px-3 py-1 bg-gray-600 text-white rounded"
                                >
                                    😀
                                </button>
                                <button
                                    onClick={handleSubmitComment}
                                    className="px-4 py-1 bg-green-600 text-white rounded"
                                >
                                    Send
                                </button>
                            </div>
                            {emojiPickerVisible && (
                                <div className="mt-2">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentBox;
