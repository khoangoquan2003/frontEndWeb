import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PlayCircle, Plus, ChevronRight, Layers, Loader2, Trash } from "lucide-react";
import AddCourseForm from "../admin-form/AddCourseForm";

export default function CoursesTab({
                                       selectedSection,
                                       courses,
                                       loadingCourses,
                                       isAddCourseModalOpen,
                                       setIsAddCourseModalOpen,
                                       onCoursesUpdate,
                                       handleDeleteCourse, // This comes from the parent component
                                   }) {
    const navigate = useNavigate();

    // Handle the delete action
    const onDeleteCourse = async (e, courseId) => {
        e.stopPropagation(); // Prevent triggering the card click
        try {
            // Call the parent `handleDeleteCourse` function to delete the course
            await handleDeleteCourse(courseId, selectedSection.id);

            // Optionally, refresh courses after deletion
            onCoursesUpdate();
        } catch (error) {
            console.error("Error deleting course:", error);
            // Handle error (optional)
        }
    };

    if (!selectedSection) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Vui lòng chọn một section trong tab Sections trước.</p>
                </CardContent>
            </Card>
        );
    }

    return (
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
                                            <div className="flex items-center space-x-2">
                                                {/* Delete Button */}
                                                <Button
                                                    variant="destructive"
                                                    onClick={(e) => onDeleteCourse(e, course.id)}
                                                    className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                                                >
                                                    <Trash className="h-5 w-5 text-white" />
                                                </Button>
                                                <ChevronRight className="h-5 w-5 text-gray-400" />
                                            </div>
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
                    onSuccess={onCoursesUpdate}
                    onCancel={() => setIsAddCourseModalOpen(false)}
                />
            )}
        </>
    );
}
