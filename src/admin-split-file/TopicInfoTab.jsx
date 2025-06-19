import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { getLevelColor } from "./helpers"

export default function TopicInfoTab({ selectedTopic, sections }) {
    return (
        <div className="space-y-4">
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
                                    <Badge className={getLevelColor(selectedTopic?.level)}>{selectedTopic?.level || "Không có"}</Badge>
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
        </div>
    )
}
