import React, { useState, useEffect } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

const reactions = {
    Like: "👍",
    Love: "❤️",
    Care: "🥰",
    Haha: "😄",
    Wow: "😮",
    Sad: "😢",
    Angry: "😠",
};

function CommentBox() {
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [replyToId, setReplyToId] = useState(null);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [hoverReactionFor, setHoverReactionFor] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [allReactions, setAllReactions] = useState({});

    const userId = 1;
    const courseId = 3;

    useEffect(() => {
        fetchComments();
        fetchAllReactions();
    }, [courseId]);

    async function fetchComments() {
        try {
            const res = await fetch(
                `http://localhost:8080/api/get-all-comment?courseId=${courseId}`
            );
            const data = await res.json();
            if (Array.isArray(data.result)) {
                const nested = buildNestedComments(data.result);
                setComments(nested);
                setCommentCount(data.result.length);
            } else {
                setComments([]);
                setCommentCount(0);
            }
        } catch (error) {
            console.error("Lỗi lấy bình luận:", error);
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

        return roots;
    }

    async function fetchAllReactions() {
        try {
            const res = await fetch(
                `http://localhost:8080/api/show-reaction?courseId=${courseId}`
            );
            const data = await res.json();
            const reactionMap = {};
            if (Array.isArray(data.result)) {
                data.result.forEach((item) => {
                    if (!reactionMap[item.commentId]) {
                        reactionMap[item.commentId] = [];
                    }
                    reactionMap[item.commentId].push({
                        userId: item.userId,
                        reaction: item.reaction,
                    });
                });
            }
            setAllReactions(reactionMap);
        } catch (error) {
            console.error("Lỗi lấy danh sách reaction:", error);
        }
    }

    async function handleSendReaction(commentId, reaction) {
        const { currentUserReaction } = getReactionSummary(commentId);
        if (currentUserReaction === reaction) {
            await axios.get(
                `http://localhost:8080/api/delete-reaction?commentId=${commentId}&userId=${userId}&reaction=${reaction}`
            );
        } else if (currentUserReaction) {
            await axios.post("http://localhost:8080/api/change-reaction", {
                commentId,
                userId,
                reaction,
            });
        } else {
            await axios.post("http://localhost:8080/api/reaction", {
                userId,
                commentId,
                courseId,
                reaction,
            });
        }
        fetchAllReactions();
        setHoverReactionFor(null);
    }

    async function handleSubmitComment() {
        if (!newComment.trim()) return alert("Vui lòng nhập nội dung bình luận");

        try {
            await axios.post("http://localhost:8080/api/comment", {
                content: newComment,
                userId,
                courseId,
                parentId: replyToId || null,
            });
            setNewComment("");
            setReplyToId(null);
            setEmojiPickerVisible(false);
            fetchComments();
        } catch (error) {
            console.error("Lỗi gửi bình luận:", error);
        }
    }

    function getReactionSummary(commentId) {
        const reactions = allReactions[commentId] || [];
        const countByType = {};
        let currentUserReaction = null;
        reactions.forEach((r) => {
            countByType[r.reaction] = (countByType[r.reaction] || 0) + 1;
            if (r.userId === userId) {
                currentUserReaction = r.reaction;
            }
        });
        return { countByType, currentUserReaction };
    }

    function onEmojiClick(emojiData) {
        setNewComment((prev) => prev + emojiData.emoji);
    }

    function renderComment(comment) {
        const { countByType, currentUserReaction } = getReactionSummary(comment.id);

        return (
            <div key={comment.id} className="ml-4 mb-4">
                <div className="flex space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                        {comment.user.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span className="font-semibold">{comment.user.userName}</span>
                            <span>{comment.user.createDate || "Vừa xong"}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>

                        <div className="flex gap-2 flex-wrap mt-2">
                            {Object.entries(countByType).map(([key, count]) => (
                                <div
                                    key={key}
                                    className={`text-sm px-2 py-1 rounded-full border ${
                                        currentUserReaction === key
                                            ? "bg-blue-100 border-blue-400"
                                            : "bg-gray-100"
                                    } cursor-pointer flex items-center gap-1`}
                                    onClick={() => handleSendReaction(comment.id, key)}
                                >
                                    <span>{reactions[key]}</span>
                                    <span>{count}</span>
                                </div>
                            ))}
                        </div>

                        <div
                            className="relative inline-block mt-2"
                            onMouseEnter={() => {
                                if (hoverTimeout) clearTimeout(hoverTimeout);
                                setHoverReactionFor(comment.id);
                            }}
                            onMouseLeave={() => {
                                const timeout = setTimeout(() => setHoverReactionFor(null), 300);
                                setHoverTimeout(timeout);
                            }}
                        >
                            <button className="text-sm px-3 py-1 border rounded hover:bg-gray-100 text-gray-600">
                                Chọn cảm xúc
                            </button>
                            {hoverReactionFor === comment.id && (
                                <div className="absolute bottom-full mb-2 left-0 flex gap-2 bg-white border rounded-lg p-2 shadow-lg z-20">
                                    {Object.entries(reactions).map(([key, emoji]) => (
                                        <span
                                            key={key}
                                            className="cursor-pointer text-2xl hover:scale-125 transition-transform"
                                            onClick={() => handleSendReaction(comment.id, key)}
                                            title={key}
                                        >
                      {emoji}
                    </span>
                                    ))}
                                </div>
                            )}
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
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập nội dung trả lời..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                                <div className="flex items-center gap-3 mt-2">
                                    <button
                                        onClick={() => setEmojiPickerVisible((v) => !v)}
                                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    >
                                        😀
                                    </button>
                                    <button
                                        onClick={handleSubmitComment}
                                        className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Gửi
                                    </button>
                                    <button
                                        onClick={() => {
                                            setReplyToId(null);
                                            setNewComment("");
                                            setEmojiPickerVisible(false);
                                        }}
                                        className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Hủy
                                    </button>
                                </div>
                                {emojiPickerVisible && (
                                    <div className="mt-2">
                                        <EmojiPicker onEmojiClick={onEmojiClick} />
                                    </div>
                                )}
                            </div>
                        )}

                        {comment.replies?.length > 0 && (
                            <div className="ml-6 border-l pl-4 mt-2">
                                {comment.replies.map((reply) => renderComment(reply))}
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
                <h3 className="font-semibold text-gray-800">
                    💬 Bình luận ({commentCount})
                </h3>
                <button
                    onClick={() => setIsCommentsOpen((open) => !open)}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {isCommentsOpen ? "Ẩn" : "Hiển thị"}
                </button>
            </div>

            {isCommentsOpen && (
                <div className="space-y-6">
                    {comments.map((comment) => renderComment(comment))}

                    {!replyToId && (
                        <div className="mt-4">
              <textarea
                  rows={3}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Viết bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
              />
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={() => setEmojiPickerVisible((v) => !v)}
                                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    😀
                                </button>
                                <button
                                    onClick={handleSubmitComment}
                                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Gửi
                                </button>
                            </div>
                            {emojiPickerVisible && (
                                <div className="mt-2">
                                    <EmojiPicker onEmojiClick={onEmojiClick} />
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
