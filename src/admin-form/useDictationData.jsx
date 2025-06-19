"use client"

import { useEffect, useState } from "react"
import { http } from "../api/Http"

export function useDictationData() {
    const [topics, setTopics] = useState([])
    const [loadingTopics, setLoadingTopics] = useState(false)
    const [sections, setSections] = useState([])
    const [courseCounts, setCourseCounts] = useState({})

    useEffect(() => {
        loadTopics()
    }, [])

    async function loadTopics() {
        setLoadingTopics(true)
        try {
            const res = await http.get("/api/show-all-topic")
            if (res.data.code === 200 && Array.isArray(res.data.result)) {
                setTopics(res.data.result)
            } else {
                console.warn("API trả về dữ liệu không đúng", res.data)
            }
        } catch (error) {
            console.error("Lỗi tải danh sách topics", error)
        }
        setLoadingTopics(false)
    }

    const handleDeleteTopic = async (e, topicId) => {
        e.stopPropagation();

        if (!window.confirm("Bạn có chắc chắn muốn xoá topic này?")) return;

        try {
            await http.delete(`/api/delete-topic/${topicId}`);
            alert("Xoá topic thành công!");

            // Cập nhật state topics, lọc ra topic vừa xóa
            setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId));
        } catch (error) {
            alert("Xoá topic thất bại!");
        }
    };

    return {
        topics,
        loadingTopics,
        sections,
        courseCounts,
        loadTopics,
        handleDeleteTopic,
    }
}
