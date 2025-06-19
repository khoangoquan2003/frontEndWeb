"use client"

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Plus, GraduationCap } from "lucide-react";
import StatsCards from "../admin-split-file/StatsCards";
import TopicGrid from "../admin-split-file/TopicGrid";  // Import TopicGrid component
import AddTopicForm from "../admin-form/AddTopicForm";
import EditTopicForm from "../admin-form/EditTopicForm";  // Import EditTopicForm component
import TopicDetailModal from "../admin-form/TopicDetailModal";
import { useDictationData } from "../admin-form/useDictationData";
import { http } from "../api/Http";

export default function DictationList() {
    const { topics, loadingTopics, sections, courseCounts, loadTopics, handleDeleteTopic } = useDictationData();

    const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
    const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [newTopic, setNewTopic] = useState({
        type: "",
        level: "",
        countTopic: "",
        image: null,
    });
    const [submittingTopic, setSubmittingTopic] = useState(false);
    const [editedTopic, setEditedTopic] = useState(null);  // Đảm bảo có giá trị topic được chỉnh sửa

    // Mở modal xem chi tiết
    const openDetailModal = (topic) => {
        setSelectedTopic(topic);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedTopic(null);
    };

    // Mở modal chỉnh sửa
    const openEditModal = (topic) => {
        setEditedTopic(topic);  // Cập nhật topic cần chỉnh sửa
        setIsEditTopicModalOpen(true);  // Mở modal chỉnh sửa
    };

    const closeEditModal = () => {
        setIsEditTopicModalOpen(false);  // Đóng modal chỉnh sửa
        setEditedTopic(null);  // Xóa topic đang chỉnh sửa
    };

    // Handle changes in new topic form
    const onNewTopicChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setNewTopic((prev) => ({ ...prev, image: files[0] }));
        } else {
            setNewTopic((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle changes in edit topic form
    const onEditedTopicChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setEditedTopic((prev) => ({ ...prev, image: files[0] }));
        } else {
            setEditedTopic((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Submit new topic
    const submitNewTopic = async (e) => {
        e.preventDefault();
        setSubmittingTopic(true);
        if (!newTopic.image) {
            alert("Vui lòng chọn một ảnh.");
            setSubmittingTopic(false);
            return;
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (newTopic.image.size > maxSize) {
            alert("Ảnh quá lớn, vui lòng chọn ảnh có kích thước dưới 5MB.");
            setSubmittingTopic(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("type", newTopic.type);
            formData.append("level", newTopic.level);
            formData.append("countTopic", newTopic.countTopic);
            formData.append("img", newTopic.image);

            const res = await http.post("/api/create-topic", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data?.result) {
                loadTopics();
                setIsAddTopicModalOpen(false);
                setNewTopic({ type: "", level: "", countTopic: "", image: null });
            } else {
                alert("Tạo topic thất bại!");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi khi gửi form!");
        }
        setSubmittingTopic(false);
    };


// Submit edited topic
    const submitEditedTopic = async (e) => {
        e.preventDefault();
        setSubmittingTopic(true);

        try {
            const formData = new FormData();
            formData.append("type", editedTopic.type);
            formData.append("level", editedTopic.level);
            formData.append("countTopic", editedTopic.countTopic);

            // Nếu không có ảnh mới, gửi lại ảnh cũ như một MultipartFile
            if (editedTopic.image) {
                formData.append("img", editedTopic.image);
            } else {
                // Tạo một file giả từ URL nếu không thay đổi ảnh
                const img = await fetch(editedTopic.img);
                const imgBlob = await img.blob();
                const imgFile = new File([imgBlob], "old_image.jpg", { type: "image/jpeg" });
                formData.append("img", imgFile);
            }

            const res = await http.put(`/api/update-topic/${editedTopic.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data?.result) {
                loadTopics();
                setIsEditTopicModalOpen(false);
                setEditedTopic(null);
            } else {
                alert("Sửa topic thất bại!");
            }
        } catch (error) {
            console.error("Error response:", error.response);
            alert("Lỗi khi gửi form!");
        }

        setSubmittingTopic(false);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6" style={{ marginLeft: "16rem" }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">DailyDict Admin</h1>
                        <p className="text-gray-600">Quản lý khóa học và nội dung học tập</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsAddTopicModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Topic Mới
                </Button>
            </div>

            <StatsCards topics={topics} sections={sections} courseCounts={courseCounts} />

            <TopicGrid
                topics={topics}
                loadingTopics={loadingTopics}
                onTopicClick={openDetailModal}
                onDeleteTopic={handleDeleteTopic}
                onEditTopic={openEditModal}  // Truyền hàm mở modal chỉnh sửa
            />

            {/* Add Topic Modal */}
            {isAddTopicModalOpen && (
                <AddTopicForm
                    newTopic={newTopic}
                    onNewTopicChange={onNewTopicChange}
                    submitNewTopic={submitNewTopic}
                    submittingTopic={submittingTopic}
                    onCancel={() => setIsAddTopicModalOpen(false)}
                />
            )}

            {/* Edit Topic Modal */}
            {isEditTopicModalOpen && editedTopic && (  // Kiểm tra xem editedTopic có tồn tại
                <EditTopicForm
                    editedTopic={editedTopic}
                    onEditedTopicChange={onEditedTopicChange}
                    submitEditedTopic={submitEditedTopic}
                    submittingTopic={submittingTopic}
                    onCancel={() => setIsEditTopicModalOpen(false)}
                />
            )}

            {/* Detail Modal */}
            {isDetailModalOpen && selectedTopic && (
                <TopicDetailModal selectedTopic={selectedTopic} isOpen={isDetailModalOpen} onClose={closeDetailModal} />
            )}
        </div>
    );
}
