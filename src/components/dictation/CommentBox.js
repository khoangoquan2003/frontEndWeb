"use client"

import { useState, useEffect } from "react"
import EmojiPicker from "emoji-picker-react"
import { http } from "../../api/Http" // Đảm bảo bạn có http từ config của bạn
import { toast } from "react-toastify" // Giữ nguyên toastify
import { ThumbsUp, MessageSquare, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react" // Sử dụng lucide-react icons
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback } from "../ui/avatar"

function CommentBox({ initialComments = [], courseId: propCourseId }) {
    const [comments, setComments] = useState([])
    const [commentCount, setCommentCount] = useState(0)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [replyToId, setReplyToId] = useState(null)
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
    const [allReactions, setAllReactions] = useState({})
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editContent, setEditContent] = useState("")
    const [isProcessing, setIsProcessing] = useState(false) // Trạng thái xử lý
    const [expandedComments, setExpandedComments] = useState({})

    const userId = Number.parseInt(localStorage.getItem("userId") || "0")
    const userNickname = localStorage.getItem("nickname") || localStorage.getItem("userName") || "You"
    const courseId = propCourseId // lấy courseId từ prop

    useEffect(() => {
        const storedUserId = Number.parseInt(localStorage.getItem("userId") || "0")
        console.log("UserId from localStorage on mount:", storedUserId)
    }, [])

    useEffect(() => {
        if (!userId || !userNickname) {
            toast.warn("⚠️ Bạn cần đăng nhập để bình luận!")
            // Optionally navigate to login page
        }
    }, [userId, userNickname])

    useEffect(() => {
        fetchComments() // Lấy các bình luận
        fetchAllReactions() // Lấy tất cả reactions (like/unlike)
    }, [courseId]) // Đảm bảo fetch lại khi courseId thay đổi

    const toggleChildComments = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }))
    }

    const handleToggleLike = async (commentId) => {
        if (isProcessing) return
        setIsProcessing(true)

        try {
            const currentReactions = allReactions[commentId] || []
            const alreadyLiked = currentReactions.some((r) => r.userId === userId)

            const requestData = {
                userId,
                commentId,
                courseId,
                reaction: alreadyLiked ? "Unlike" : "Like",
            }

            await http.post("/api/reaction", requestData)

            // ✅ Cập nhật state allReactions ngay tại chỗ:
            const updatedReactions = alreadyLiked
                ? currentReactions.filter((r) => r.userId !== userId) // Xóa like
                : [...currentReactions, { userId, commentId, courseId, reaction: "Like" }] // Thêm like

            setAllReactions((prev) => ({
                ...prev,
                [commentId]: updatedReactions,
            }))
        } catch (error) {
            console.error("❌ Error toggling reaction:", error)
            toast.error("Đã xảy ra lỗi khi cập nhật trạng thái thích.")
        } finally {
            setIsProcessing(false)
        }
    }

    async function fetchComments() {
        try {
            const res = await http.get("/api/get-all-comment", { params: { courseId } })
            const data = res.data

            const nestedComments = buildNestedComments(data.result)
            setComments(nestedComments)
            setCommentCount(data.result.length)
        } catch (error) {
            console.error("Error fetching comments:", error)
            // Optionally set comments to empty array or show error message
            setComments([])
            setCommentCount(0)
        }
    }

    function buildNestedComments(flatComments) {
        const map = {}
        const roots = []

        flatComments.forEach((comment) => {
            map[comment.id] = { ...comment, replies: [] }
        })

        flatComments.forEach((comment) => {
            if (comment.parentId && map[comment.parentId]) {
                map[comment.parentId].replies.push(map[comment.id])
            } else {
                roots.push(map[comment.id])
            }
        })

        function sortByDate(arr) {
            arr.sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
            arr.forEach((c) => {
                if (c.replies.length) sortByDate(c.replies)
            })
        }

        sortByDate(roots)
        return roots
    }

    const fetchAllReactions = async () => {
        try {
            const res = await http.get(`/api/show-reaction?courseId=${courseId}`)
            console.log("🎯 Reaction data from API:", res.data.result)

            const reactionsByComment = {}
            res.data.result.forEach((r) => {
                if (!reactionsByComment[r.commentId]) {
                    reactionsByComment[r.commentId] = []
                }
                reactionsByComment[r.commentId].push(r)
            })

            setAllReactions(reactionsByComment)
        } catch (error) {
            console.error("❌ Failed to fetch reactions", error)
        }
    }

    async function handleSubmitComment() {
        if (!newComment.trim()) return toast.warn("Vui lòng nhập bình luận!")

        try {
            await http.post("/api/comment", {
                content: newComment,
                userId,
                courseId,
                parentId: replyToId || null,
            })

            await fetchComments()

            // ✅ Nếu đang reply, mở rộng replies cho comment cha
            if (replyToId) {
                setExpandedComments((prev) => ({
                    ...prev,
                    [replyToId]: true,
                }))
            }

            setNewComment("")
            setReplyToId(null)
            setEmojiPickerVisible(false)
            setEditingCommentId(null)
            toast.success("Bình luận đã được gửi!")
        } catch (error) {
            console.error("Error submitting comment:", error)
            toast.error("Đã xảy ra lỗi khi gửi bình luận.")
        }
    }

    function getReactionSummary(commentId) {
        const reactions = allReactions[commentId] || []
        const currentUserReaction = reactions.find((reaction) => Number(reaction.userId) === Number(userId))

        return {
            currentUserReaction: currentUserReaction || null,
            likeCount: reactions.filter((reaction) => reaction.reaction === "Like").length,
        }
    }

    function timeAgo(date) {
        const now = new Date()
        const diffInSeconds = Math.floor((now - new Date(date)) / 1000)

        if (diffInSeconds < 60) return `${diffInSeconds} giây trước`
        const diffInMinutes = Math.floor(diffInSeconds / 60)
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) return `${diffInHours} giờ trước`
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 30) return `${diffInDays} ngày trước`
        const diffInMonths = Math.floor(diffInDays / 30)
        if (diffInMonths < 12) return `${diffInMonths} tháng trước`
        const diffInYears = Math.floor(diffInMonths / 12)
        return `${diffInYears} năm trước`
    }

    function startEditing(comment) {
        setEditingCommentId(comment.id)
        setEditContent(comment.content)
        setReplyToId(null)
        setEmojiPickerVisible(false)
    }

    async function handleSaveEdit(commentId) {
        if (!editContent.trim()) return toast.warn("Nội dung không được để trống!")

        try {
            await http.put("/api/update-comment", {
                commentId,
                content: editContent,
                userId,
            })

            // Update trong state
            setComments((prev) => updateCommentContent(prev, commentId, editContent))
            setEditingCommentId(null)
            setEditContent("")
            toast.success("Bình luận đã được cập nhật!")
        } catch (error) {
            console.error("Error editing comment:", error)
            toast.error("Đã xảy ra lỗi khi chỉnh sửa bình luận.")
        }
    }

    function updateCommentContent(comments, commentId, newContent) {
        return comments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, content: newContent }
            }
            if (comment.replies?.length) {
                return { ...comment, replies: updateCommentContent(comment.replies, commentId, newContent) }
            }
            return comment
        })
    }

    function renderComment(comment, level = 0) {
        const { currentUserReaction, likeCount } = getReactionSummary(comment.id) // Lấy trạng thái like của người dùng
        const indentClass = `ml-${Math.min(level * 4, 12)}`

        // Lấy username thống nhất
        const username = comment.user?.userName || comment.userName || "Người dùng ẩn danh"

        return (
            <div key={comment.id} className={`mb-4 ${indentClass}`}>
                <div className="flex space-x-3">
                    {/* Avatar */}
                    <Avatar className="w-10 h-10">
                        <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-sm text-gray-600">
                        <div className="font-semibold text-gray-800">
                            {username}
                            <span className="text-gray-500 text-xs ml-2">({timeAgo(comment.createDate)})</span>
                        </div>

                        {editingCommentId === comment.id ? (
                            <div className="mt-1">
                                <Textarea
                                    rows={3}
                                    className="w-full p-2 border rounded-md resize-none focus-visible:ring-blue-500"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder="Chỉnh sửa bình luận của bạn..."
                                    maxLength={500}
                                    autoFocus
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">{editContent.length} / 500</div>
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        onClick={() => handleSaveEdit(comment.id)}
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={!editContent.trim()}
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setEditingCommentId(null)
                                            setEditContent("")
                                        }}
                                        variant="outline"
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-1 text-gray-700">{comment.content}</p>
                        )}

                        {/* Actions: Like / Reply / Edit / Delete */}
                        <div className="mt-2 flex items-center gap-4 text-xs">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleLike(comment.id)}
                                className={`flex items-center gap-1 h-auto p-1 ${
                                    currentUserReaction?.reaction === "Like" ? "text-blue-600" : "text-gray-600"
                                }`}
                                disabled={isProcessing}
                            >
                                <ThumbsUp className={`h-4 w-4 ${currentUserReaction?.reaction === "Like" ? "fill-current" : ""}`} />
                                {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
                                <span className="sr-only">Thích</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-gray-600"
                                onClick={() => {
                                    setReplyToId(comment.id)
                                    setNewComment("")
                                    setEmojiPickerVisible(false)
                                    setEditingCommentId(null)
                                }}
                            >
                                <MessageSquare className="h-4 w-4 mr-1" /> Trả lời
                            </Button>

                            {/* Edit */}
                            {(comment.user?.userId || comment.userId) === userId && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-1 text-gray-600"
                                    onClick={() => startEditing(comment)}
                                >
                                    <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa
                                </Button>
                            )}

                            {/* Delete */}
                            {(comment.user?.userId || comment.userId) === userId && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-1 text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteComment(comment.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" /> Xóa
                                </Button>
                            )}
                        </div>

                        {replyToId === comment.id && editingCommentId === null && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <Textarea
                                    rows={3}
                                    className="w-full p-2 border rounded-md focus-visible:ring-blue-500"
                                    placeholder="Nhập phản hồi của bạn..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <div className="flex items-center gap-3 mt-2">
                                    <Button onClick={toggleEmojiPicker} variant="outline" size="icon">
                                        😀
                                    </Button>
                                    <Button onClick={handleSubmitComment} className="bg-green-600 hover:bg-green-700">
                                        Gửi
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setReplyToId(null)
                                            setNewComment("")
                                            setEmojiPickerVisible(false)
                                        }}
                                        variant="secondary"
                                    >
                                        Hủy
                                    </Button>
                                </div>
                                {emojiPickerVisible && (
                                    <div className="mt-2">
                                        <EmojiPicker onEmojiClick={(e) => setNewComment((prev) => prev + e.emoji)} />
                                    </div>
                                )}
                            </div>
                        )}

                        {comment.replies?.length > 0 && (
                            <div className="mt-3">
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-blue-500 h-auto p-0"
                                    onClick={() => toggleChildComments(comment.id)}
                                >
                                    {expandedComments[comment.id] ? (
                                        <>
                                            <ChevronUp className="h-4 w-4 mr-1" /> Ẩn phản hồi
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4 mr-1" /> Hiển thị {comment.replies.length} phản hồi
                                        </>
                                    )}
                                </Button>

                                {expandedComments[comment.id] && comment.replies.map((reply) => renderComment(reply, level + 1))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    function showConfirmToast(message, onConfirm) {
        const toastId = toast.info(
            ({ closeToast }) => (
                <div>
                    <div className="font-medium mb-2">{message}</div>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                onConfirm()
                                closeToast()
                            }}
                        >
                            Xóa
                        </Button>
                        <Button variant="outline" size="sm" onClick={closeToast}>
                            Hủy
                        </Button>
                    </div>
                </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            },
        )
    }

    async function handleDeleteComment(commentId) {
        const userId = Number.parseInt(localStorage.getItem("userId") || "0")
        if (!userId) {
            toast.warn("⚠️ Bạn cần đăng nhập để xóa comment")
            return
        }

        showConfirmToast("Bạn có chắc chắn muốn xóa bình luận này và tất cả phản hồi của nó không?", async () => {
            try {
                await http.delete("/api/delete-comment", {
                    params: { commentId, userId },
                })

                setComments((prev) => deleteCommentById(prev, commentId))
                setCommentCount((prev) => prev - 1)
                toast.success("🗑️ Xóa bình luận thành công!")
            } catch (error) {
                console.error("Error deleting comment:", error)
                toast.error("❌ Xóa bình luận thất bại")
            }
        })
    }

    function deleteCommentById(comments, commentId) {
        return comments
            .filter((c) => c.id !== commentId)
            .map((c) => ({
                ...c,
                replies: deleteCommentById(c.replies || [], commentId),
            }))
    }

    function toggleEmojiPicker() {
        setEmojiPickerVisible((prev) => !prev)
    }

    return (
        <Card className="max-w-xl mx-auto p-4 shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center p-0 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">💬 Bình luận ({commentCount})</CardTitle>
                <Button onClick={() => setIsCommentsOpen((prev) => !prev)} variant="outline" size="sm">
                    {isCommentsOpen ? "Ẩn" : "Hiển thị"}
                </Button>
            </CardHeader>

            {isCommentsOpen && (
                <CardContent className="p-0 pt-4 space-y-6">
                    {/* ✅ Form bình luận đặt trước danh sách comment */}
                    {!replyToId && editingCommentId === null && (
                        <div className="mt-4">
                            <Textarea
                                rows={3}
                                className="w-full p-2 border rounded-md focus-visible:ring-blue-500"
                                placeholder="Viết bình luận..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex items-center gap-3 mt-2">
                                <Button onClick={toggleEmojiPicker} variant="outline" size="icon">
                                    😀
                                </Button>
                                <Button onClick={handleSubmitComment} className="bg-green-600 hover:bg-green-700">
                                    Gửi
                                </Button>
                            </div>
                            {emojiPickerVisible && (
                                <div className="mt-2">
                                    <EmojiPicker onEmojiClick={(e) => setNewComment((prev) => prev + e.emoji)} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* ✅ Danh sách các bình luận */}
                    {comments.map((comment) => renderComment(comment))}
                </CardContent>
            )}
        </Card>
    )
}
export default CommentBox;
