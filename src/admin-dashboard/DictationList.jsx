"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"
import {
    Plus,
    Edit,
    Trash2,
    BookOpen,
    GraduationCap,
    FolderOpen,
    ChevronRight,
    Info,
    Layers,
    PlayCircle,
    Loader2,
} from "lucide-react"
import { http } from "../api/Http"
import AddTopicForm from "../admin-form/AddTopicForm"
import AddCourseForm from "../admin-form/AddCourseForm"

export default function DictationList() {
    // === State chính ===
    const [topics, setTopics] = useState([])
    const [loadingTopics, setLoadingTopics] = useState(false)
    const navigate = useNavigate()
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false)

    // Modal tạo topic mới
    const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false)
    const [newTopic, setNewTopic] = useState({
        type: "",
        level: "",
        countTopic: "",
        image: null,
    })
    const [submittingTopic, setSubmittingTopic] = useState(false)
    const [courseCounts, setCourseCounts] = useState({})

    // Modal chi tiết topic
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [activeTab, setActiveTab] = useState("info")

    // Data Sections và Courses trong modal detail
    const [sections, setSections] = useState([])
    const [loadingSections, setLoadingSections] = useState(false)
    const [selectedSection, setSelectedSection] = useState(null)
    const [courses, setCourses] = useState([])
    const [loadingCourses, setLoadingCourses] = useState(false)

    // Thêm section mới cho topic đang chọn
    const [submittingSection, setSubmittingSection] = useState(false)

    // === Fetch topics khi component mount ===
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

    // === Modal Detail Topic ===
    const openDetailModal = (topic) => {
        setSelectedTopic(topic)
        setActiveTab("info")
        setSelectedSection(null)
        setCourses([])
        fetchSections(topic.id)
        setIsDetailModalOpen(true)
    }

    const closeDetailModal = () => {
        setIsDetailModalOpen(false)
        setSelectedTopic(null)
        setSections([])
        setSelectedSection(null)
        setCourses([])
    }

    async function fetchSections(topicId) {
        setLoadingSections(true)
        try {
            const res = await http.get("/api/show-all-section", { params: { topicId } })
            if (res.data.code === 200 && Array.isArray(res.data.result)) {
                const loadedSections = res.data.result
                setSections(loadedSections)

                // Gọi API đếm course cho từng section
                const counts = {}
                await Promise.all(
                    loadedSections.map(async (section) => {
                        try {
                            const resCourse = await http.get("/api/show-all-course", { params: { sectionId: section.id } })
                            counts[section.id] = Array.isArray(resCourse.data.result) ? resCourse.data.result.length : 0
                        } catch {
                            counts[section.id] = 0
                        }
                    }),
                )
                setCourseCounts(counts)
            } else {
                setSections([])
            }
        } catch (error) {
            console.error("Lỗi tải sections", error)
            setSections([])
        }
        setLoadingSections(false)
    }

    async function fetchCourses(sectionId) {
        setLoadingCourses(true)
        try {
            const res = await http.get("/api/show-all-course", {
                params: { sectionId },
            })

            if (res.data.code === 200 && Array.isArray(res.data.result)) {
                setCourses(res.data.result)
            } else {
                setCourses([])
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách course:", error)
            setCourses([])
        }
        setLoadingCourses(false)
    }

    const onSelectSection = async (section) => {
        setSelectedSection(section)
        setCourses([])
        setLoadingCourses(true)
        try {
            const res = await http.get("/api/show-all-course", { params: { sectionId: section.id } })
            if (res.data.code === 200 && Array.isArray(res.data.result)) {
                setCourses(res.data.result)
            } else {
                setCourses([])
            }
        } catch (err) {
            console.error("Lỗi tải courses:", err)
            setCourses([])
        }
        setLoadingCourses(false)
        setActiveTab("courses")
    }

    const onNewTopicChange = (e) => {
        const { name, value, files } = e.target
        if (name === "image") {
            setNewTopic((prev) => ({ ...prev, image: files[0] }))
        } else {
            setNewTopic((prev) => ({ ...prev, [name]: value }))
        }
    }

    const submitNewTopic = async (e) => {
        e.preventDefault()
        setSubmittingTopic(true)

        try {
            const formData = new FormData()
            formData.append("type", newTopic.type)
            formData.append("level", newTopic.level)
            formData.append("countTopic", newTopic.countTopic)
            formData.append("image", newTopic.image)

            const res = await http.post("/api/create-topic", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if (res.data?.result) {
                loadTopics()
                setIsAddTopicModalOpen(false)
                setNewTopic({ type: "", level: "", countTopic: "", image: null })
            } else {
                alert("Tạo khóa học thất bại!")
            }
        } catch (error) {
            console.error(error)
            alert("Lỗi khi gửi form!")
        }

        setSubmittingTopic(false)
    }

    const handleAutoCreateSection = async () => {
        if (!selectedTopic) return alert("Chưa chọn topic!")
        setSubmittingSection(true)
        try {
            const nextNumber = sections.length + 1
            const payload = {
                name: `Section ${nextNumber}`,
                countOfCourse: 0,
                topicId: selectedTopic.id,
            }
            const res = await http.post("/api/create-section", payload)
            if (res.data?.result) {
                const newSec = res.data.result
                setSections((prev) => [...prev, newSec])

                try {
                    const resCourses = await http.get("/api/show-all-course", {
                        params: { sectionId: newSec.id },
                    })
                    const count = Array.isArray(resCourses.data.result) ? resCourses.data.result.length : 0
                    setCourseCounts((prev) => ({ ...prev, [newSec.id]: count }))
                } catch {
                    setCourseCounts((prev) => ({ ...prev, [newSec.id]: 0 }))
                }

                alert("Tạo section thành công!")
            } else {
                alert("Tạo section thất bại!")
            }
        } catch (err) {
            console.error("Lỗi khi tạo section:", err)
            alert("Lỗi khi tạo section!")
        }
        setSubmittingSection(false)
    }

    const handleDeleteTopic = async (e, topicId) => {
        e.stopPropagation()

        if (!window.confirm("Bạn có chắc chắn muốn xoá topic này?")) return

        try {
            await http.delete(`/api/delete-topic/${topicId}`)
            alert("Xoá topic thành công!")
            loadTopics()
        } catch (error) {
            console.error("Lỗi khi xoá topic:", error)
            alert("Xoá topic thất bại!")
        }
    }

    const handleDeleteSection = async (e, sectionId) => {
        e.stopPropagation()
        if (!window.confirm("Bạn có chắc chắn muốn xoá section này?")) return

        try {
            await http.delete(`/api/delete-section/${sectionId}`)
            alert("Xoá section thành công!")
            setSections((prev) => prev.filter((section) => section.id !== sectionId))
            setCourseCounts((prev) => {
                const updated = { ...prev }
                delete updated[sectionId]
                return updated
            })
            if (selectedSection?.id === sectionId) {
                setSelectedSection(null)
                setCourses([])
            }
        } catch (error) {
            console.error("Lỗi khi xoá section:", error)
            alert("Xoá section thất bại!")
        }
    }

    const getLevelColor = (level) => {
        switch (level?.toLowerCase()) {
            case "beginner":
                return "bg-green-100 text-green-800"
            case "intermediate":
                return "bg-yellow-100 text-yellow-800"
            case "advanced":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Tổng Topics</p>
                                <p className="text-2xl font-bold text-blue-900">{topics.length}</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-green-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Tổng Sections</p>
                                <p className="text-2xl font-bold text-green-900">{sections.length}</p>
                            </div>
                            <Layers className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-purple-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium">Tổng Courses</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {Object.values(courseCounts).reduce((sum, count) => sum + count, 0)}
                                </p>
                            </div>
                            <PlayCircle className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Danh sách topic */}
            {loadingTopics ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-600">Đang tải danh sách khóa học...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {topics.map((topic) => (
                        <Card
                            key={topic.id}
                            className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
                            onClick={() => openDetailModal(topic)}
                        >
                            <CardContent className="p-0">
                                {topic.img && (
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <img
                                            src={topic.img || "/placeholder.svg"}
                                            alt={topic.title || `Topic #${topic.id}`}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {topic.type || topic.title || `Topic #${topic.id}`}
                                        </h3>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>

                                    {topic.level && <Badge className={`mb-3 ${getLevelColor(topic.level)}`}>{topic.level}</Badge>}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                alert("Edit feature coming soon")
                                            }}
                                            className="hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700"
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => handleDeleteTopic(e, topic.id)}
                                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

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

            {/* Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={closeDetailModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold flex items-center">
                            <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
                            {selectedTopic?.type || selectedTopic?.title || `Topic #${selectedTopic?.id}`}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="info" className="flex items-center">
                                    <Info className="h-4 w-4 mr-2" />
                                    Thông tin
                                </TabsTrigger>
                                <TabsTrigger value="sections" className="flex items-center">
                                    <Layers className="h-4 w-4 mr-2" />
                                    Sections
                                </TabsTrigger>
                                <TabsTrigger value="courses" className="flex items-center" disabled={!selectedSection}>
                                    <PlayCircle className="h-4 w-4 mr-2" />
                                    Courses
                                </TabsTrigger>
                            </TabsList>

                            <ScrollArea className="h-[60vh] mt-4">
                                <TabsContent value="info" className="space-y-4">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Loại khóa học</label>
                                                        <p className="text-lg font-semibold">{selectedTopic?.type || "Không có"}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Trình độ</label>
                                                        <div className="mt-1">
                                                            <Badge className={getLevelColor(selectedTopic?.level)}>
                                                                {selectedTopic?.level || "Không có"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Số lượng section</label>
                                                        <p className="text-lg font-semibold">{sections.length}</p>
                                                    </div>
                                                </div>
                                                {selectedTopic?.img && (
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Hình ảnh</label>
                                                        <img
                                                            src={selectedTopic.img || "/placeholder.svg"}
                                                            alt="Topic"
                                                            className="w-full h-48 object-cover rounded-lg mt-2 shadow-md"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="sections" className="space-y-4">
                                    {loadingSections ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                            <span className="ml-2">Đang tải sections...</span>
                                        </div>
                                    ) : sections.length === 0 ? (
                                        <Card>
                                            <CardContent className="p-8 text-center">
                                                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">Không có section nào cho topic này.</p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="space-y-3">
                                            {sections.map((section) => (
                                                <Card
                                                    key={section.id}
                                                    className={`cursor-pointer transition-all duration-200 ${
                                                        selectedSection?.id === section.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                                                    }`}
                                                    onClick={() => onSelectSection(section)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                                    <Layers className="h-4 w-4 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">{section.name}</h4>
                                                                    <p className="text-sm text-gray-500">{courseCounts[section.id] ?? "..."} khóa học</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => handleDeleteSection(e, section.id)}
                                                                className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleAutoCreateSection}
                                        disabled={submittingSection}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                    >
                                        {submittingSection ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Đang tạo...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Thêm Section mới
                                            </>
                                        )}
                                    </Button>
                                </TabsContent>

                                <TabsContent value="courses" className="space-y-4">
                                    {selectedSection ? (
                                        <>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center">
                                                        <PlayCircle className="h-5 w-5 mr-2 text-blue-500" />
                                                        Courses của Section: {selectedSection.name}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    {loadingCourses ? (
                                                        <div className="flex items-center justify-center py-8">
                                                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                                            <span className="ml-2">Đang tải courses...</span>
                                                        </div>
                                                    ) : courses.length === 0 ? (
                                                        <div className="text-center py-8">
                                                            <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                            <p className="text-gray-500">Không có course nào cho section này.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {courses.map((course) => (
                                                                <Card
                                                                    key={course.id}
                                                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                                                    onClick={() => navigate(`/admin/course/${course.id}`)}
                                                                >
                                                                    <CardContent className="p-4">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-3">
                                                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                                                    <PlayCircle className="h-4 w-4 text-purple-600" />
                                                                                </div>
                                                                                <div>
                                                                                    <h5 className="font-semibold text-gray-900">{course.name}</h5>
                                                                                    <p className="text-sm text-gray-500">Level: {course.level}</p>
                                                                                </div>
                                                                            </div>
                                                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>

                                            <Button
                                                onClick={() => setIsAddCourseModalOpen(true)}
                                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Thêm Course mới
                                            </Button>

                                            {isAddCourseModalOpen && (
                                                <AddCourseForm
                                                    sectionId={selectedSection.id}
                                                    onSuccess={() => {
                                                        fetchCourses(selectedSection.id)
                                                        setCourseCounts((prev) => ({
                                                            ...prev,
                                                            [selectedSection.id]: (prev[selectedSection.id] || 0) + 1,
                                                        }))
                                                    }}
                                                    onCancel={() => setIsAddCourseModalOpen(false)}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <Card>
                                            <CardContent className="p-8 text-center">
                                                <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">Vui lòng chọn một section trong tab Sections trước.</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>
                            </ScrollArea>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
