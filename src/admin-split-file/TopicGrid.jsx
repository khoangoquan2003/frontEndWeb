import { Loader2 } from "lucide-react";
import TopicCard from "./TopicCard";

export default function TopicGrid({ topics, loadingTopics, onTopicClick, onDeleteTopic, onEditTopic }) {
    if (loadingTopics) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Đang tải danh sách khóa học...</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topics.map((topic) => (
                <TopicCard
                    key={topic.id}
                    topic={topic}
                    onClick={() => onTopicClick(topic)}  // Gọi khi nhấn vào card
                    onEdit={() => onEditTopic(topic)}  // Truyền hàm chỉnh sửa từ DictationList
                    onDelete={() => onDeleteTopic(topic.id)}  // Truyền hàm xóa từ DictationList
                />
            ))}
        </div>
    );
}
