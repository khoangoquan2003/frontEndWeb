import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { BookOpen, Info, Layers, PlayCircle } from "lucide-react";
import TopicInfoTab from "../admin-split-file/TopicInfoTab";
import SectionsTab from "../admin-split-file/SectionsTab";
import CoursesTab from "../admin-split-file/CoursesTab";
import { useTopicDetail } from "./useTopicDetail";
import { http } from "../api/Http"; // Assuming you have an http utility for API requests

export default function TopicDetailModal({ selectedTopic, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("info");
    const {
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
        fetchCourses,
    } = useTopicDetail(selectedTopic);

    // API call to delete course
    const handleDeleteCourse = async (courseId, sectionId) => {
        try {
            // Making the API call to delete the course
            const response = await http.delete(`/api/delete-course?courseId=${courseId}`);

            if (response?.message === "Course deleted successfully!") {
                // Successfully deleted, now refresh courses list
                fetchCourses(sectionId);
            } else {
                // Handle any unexpected response or error message
                console.error("Error deleting course:", response?.message);
            }
        } catch (error) {
            // Handle network or server errors
            console.error("Error deleting course:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                            <TabsContent value="info">
                                <TopicInfoTab selectedTopic={selectedTopic} sections={sections} />
                            </TabsContent>

                            <TabsContent value="sections">
                                <SectionsTab
                                    sections={sections}
                                    loadingSections={loadingSections}
                                    courseCounts={courseCounts}
                                    selectedSection={selectedSection}
                                    submittingSection={submittingSection}
                                    onSelectSection={onSelectSection}
                                    onCreateSection={handleAutoCreateSection}
                                    onDeleteSection={handleDeleteSection}
                                />
                            </TabsContent>

                            <TabsContent value="courses">
                                <CoursesTab
                                    selectedSection={selectedSection}
                                    courses={courses}
                                    loadingCourses={loadingCourses}
                                    isAddCourseModalOpen={isAddCourseModalOpen}
                                    setIsAddCourseModalOpen={setIsAddCourseModalOpen}
                                    onCoursesUpdate={() => fetchCourses(selectedSection.id)}
                                    handleDeleteCourse={handleDeleteCourse}  // Pass the delete function to CoursesTab
                                />
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
