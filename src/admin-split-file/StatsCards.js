import { Card, CardContent } from "../components/ui/card"
import { BookOpen, Layers, PlayCircle } from "lucide-react"

export default function StatsCards({ topics, sections, courseCounts }) {
    const totalCourses = Object.values(courseCounts).reduce((sum, count) => sum + count, 0)

    return (
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
                            <p className="text-2xl font-bold text-purple-900">{totalCourses}</p>
                        </div>
                        <PlayCircle className="h-8 w-8 text-purple-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
