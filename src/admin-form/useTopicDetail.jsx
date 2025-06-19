"use client"

import { useState, useEffect } from "react"
import { http } from "../api/Http"

export function useTopicDetail(selectedTopic) {
    const [sections, setSections] = useState([])
    const [loadingSections, setLoadingSections] = useState(false)
    const [selectedSection, setSelectedSection] = useState(null)
    const [courses, setCourses] = useState([])
    const [loadingCourses, setLoadingCourses] = useState(false)
    const [courseCounts, setCourseCounts] = useState({})
    const [submittingSection, setSubmittingSection] = useState(false)
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false)

    useEffect(() => {
        if (selectedTopic) {
            fetchSections(selectedTopic.id)
        }
    }, [selectedTopic])

    async function fetchSections(topicId) {
        setLoadingSections(true)
        try {
            const res = await http.get("/api/show-all-section", { params: { topicId } })
            if (res.data.code === 200 && Array.isArray(res.data.result)) {
                const loadedSections = res.data.result
                setSections(loadedSections)

                // Fetch course counts for each section
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
            console.error("Error loading sections", error)
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
            console.error("Error loading courses:", error)
            setCourses([])
        }
        setLoadingCourses(false)
    }

    const onSelectSection = async (section) => {
        setSelectedSection(section)
        setCourses([])
        await fetchCourses(section.id)
    }

    const handleAutoCreateSection = async () => {
        if (!selectedTopic) return alert("Topic not selected!")
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

                alert("Section created successfully!")
            } else {
                alert("Failed to create section!")
            }
        } catch (err) {
            console.error("Error creating section:", err)
            alert("Error creating section!")
        }
        setSubmittingSection(false)
    }

    const handleDeleteSection = async (e, sectionId) => {
        e.stopPropagation()
        if (!window.confirm("Are you sure you want to delete this section?")) return

        try {
            await http.delete(`/api/delete-section/${sectionId}`)
            alert("Section deleted successfully!")
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
            console.error("Error deleting section:", error)
            alert("Failed to delete section!")
        }
    }

    // New function to handle course deletion
    const handleDeleteCourse = async (e, courseId, sectionId) => {
        e.stopPropagation()
        if (!window.confirm("Are you sure you want to delete this course?")) return

        try {
            await http.delete(`/api/delete-course/${courseId}`)
            alert("Course deleted successfully!")

            // Update courses list after deleting
            setCourses((prev) => prev.filter((course) => course.id !== courseId))

            // Update course count for the section
            setCourseCounts((prev) => {
                const updated = { ...prev }
                updated[sectionId] = updated[sectionId] ? updated[sectionId] - 1 : 0
                return updated
            })
        } catch (error) {
            console.error("Error deleting course:", error)
            alert("Failed to delete course!")
        }
    }

    return {
        sections,
        loadingSections,
        selectedSection,
        courses,
        loadingCourses,
        courseCounts,
        submittingSection,
        isAddCourseModalOpen,
        setIsAddCourseModalOpen,
        onSelectSection,
        handleAutoCreateSection,
        handleDeleteSection,
        handleDeleteCourse, // Expose handleDeleteCourse
        fetchCourses,
    }
}
