import { useState, useEffect } from "react";

export default function TranslationBox({ courseId = 1 }) {
    const [translations, setTranslations] = useState({});
    const [selectedLang, setSelectedLang] = useState("vi");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Thêm state để xử lý lỗi

    const languageLabels = {
        en: "English",
        vi: "Tiếng Việt",
        fr: "Français",
        es: "Español",
        de: "Deutsch",
        it: "Italiano",
    };

    // Hàm lấy dữ liệu khóa học
    useEffect(() => {
        async function fetchCourseData() {
            setLoading(true);
            setError(null); // Reset lỗi trước khi bắt đầu
            try {
                // Lấy dữ liệu khóa học từ API backend (hoặc từ một nguồn khác)
                const res = await fetch(`/api/get-course?courseId=${courseId}`);
                if (!res.ok) {
                    throw new Error("Không thể tải dữ liệu khóa học.");
                }
                const data = await res.json();
                const { sentences } = data.result;

                // Ở đây chúng ta chỉ lưu lại câu gốc mà không dịch
                const sentenceTranslations = {};
                sentences.forEach((sentence) => {
                    sentenceTranslations[sentence] = sentence; // Chỉ lưu lại câu gốc
                });

                setTranslations(sentenceTranslations);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                setError("Đã xảy ra lỗi khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        }

        fetchCourseData();
    }, [courseId, selectedLang]);

    // Hàm dịch văn bản sử dụng API LibreTranslate
    const translateSentence = async (sentence, lang) => {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${sentence}`);
            if (!response.ok) {
                throw new Error("Word not found");
            }
            const data = await response.json();
            return data.meaning; // Assuming it returns a definition.
        } catch (error) {
            console.error("Error:", error);
            return sentence; // Fallback to returning the original word if error occurs.
        }
    };
    const handleLanguageChange = (e) => {
        setSelectedLang(e.target.value);
    };

    const sentences = Object.keys(translations);

    return (
        <div className="border p-3 rounded bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">🌐 Dịch nghĩa</h2>

            <div className="mb-2">
                <select
                    value={selectedLang}
                    onChange={handleLanguageChange}
                    className="px-3 py-2 border rounded bg-white text-gray-700 w-full"
                >
                    {Object.keys(languageLabels).map((lang) => (
                        <option key={lang} value={lang}>
                            {languageLabels[lang]}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="text-red-500">{error}</div>} {/* Hiển thị thông báo lỗi */}

            <div className="space-y-4">
                {loading ? (
                    <div>Đang tải dữ liệu...</div>
                ) : sentences.length > 0 ? (
                    sentences.map((sentence, index) => (
                        <div key={index} className="text-gray-800">
                            <div className="font-semibold">{sentence}</div>
                            <div className="italic">
                                {translations[sentence]} {/* Hiển thị câu gốc mà không dịch */}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>Không có câu để dịch.</div>
                )}
            </div>
        </div>
    );
}
