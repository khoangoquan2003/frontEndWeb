// pages/AdminDashboard/CourseDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../api/Http';

export default function CourseDetailPage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourse() {
            try {
                const res = await http.get('/api/get-course', { params: { courseId } });
                if (res.data.code === 200) {
                    setCourse(res.data.result);
                } else {
                    console.error('Lỗi dữ liệu:', res.data);
                }
            } catch (error) {
                console.error('Lỗi fetch course:', error);
            }
            setLoading(false);
        }
        fetchCourse();
    }, [courseId]);

    if (loading) return <p className="ml-64 mt-10">Đang tải chi tiết khóa học...</p>;

    if (!course) return <p className="ml-64 mt-10 text-red-600">Không tìm thấy khóa học.</p>;

    return (
        <div className="p-6 ml-64">
            <h1 className="text-2xl font-bold mb-4">{course.name}</h1>
            <p><strong>Level:</strong> {course.level}</p>
            <p><strong>Số câu:</strong> {course.countOfSentence}</p>

            <audio controls className="my-4">
                <source src={course.mainAudio} type="audio/mpeg" />
                Trình duyệt không hỗ trợ audio.
            </audio>

            <div className="mt-4">
                <h3 className="font-semibold">Transcript:</h3>
                <pre className="bg-gray-100 p-3 rounded">{course.transcript}</pre>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold mb-2">Sentences:</h3>
                {course.sentences.map((sentence, index) => (
                    <div key={index} className="mb-2 p-2 border rounded bg-white shadow-sm">
                        <p><strong>{sentence}</strong></p>
                        {course.sentenceAudios[index] && (
                            <audio controls className="mt-1">
                                <source src={course.sentenceAudios[index]} type="audio/mpeg" />
                            </audio>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
