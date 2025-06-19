import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Edit, Trash2, ChevronRight } from "lucide-react";
import { getLevelColor } from "./helpers";
import { http } from "../api/Http";  // Import http từ Http.js
import { toast } from "react-toastify";

export default function TopicCard({ topic, onClick, onDelete, onEdit }) {
    // Handler cho nút "Sửa"
    const handleEdit = async (e) => {
        e.stopPropagation();  // Ngăn chặn click lên card
        console.log("Nút Sửa đã được nhấn cho topic", topic);  // Log debug

        // Kiểm tra trước khi gọi onEdit
        if (onEdit) {
            // Gọi callback onEdit từ component cha để mở form chỉnh sửa
            onEdit(topic);  // Truyền topic để có thể chỉnh sửa
        }
    };

    // Handler cho nút "Xóa"
    const handleDelete = (e) => {
        e.stopPropagation(); // ngăn click lan ra card
        if (onDelete) {
            onDelete(e, topic.id); // gọi callback, truyền event và id topic
        }
    };


    return (
        <Card
            className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
            onClick={onClick}
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
                            onClick={handleEdit}
                            className="hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700"
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Sửa
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
