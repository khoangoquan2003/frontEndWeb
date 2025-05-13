import { useState, useEffect } from "react";
import { http } from "../../api/Http"; // Dùng http đã cấu hình trước đó

export default function TranslationBox({ courseId = 1 }) {
    const [translations, setTranslations] = useState({});  // Dữ liệu bản dịch
    const [selectedLang, setSelectedLang] = useState("vi");  // Ngôn ngữ mặc định
    const [loading, setLoading] = useState(false);

    const languageLabels = {
        en: "🇬🇧 English",
        vi: "🇻🇳 Tiếng Việt",
        fr: "🇫🇷 Français",
        es: "🇪🇸 Español",
        de: "🇩🇪 Deutsch",
        it: "🇮🇹 Italiano",
    };

    const apiKey = "";  // Thay bằng API key của bạn

    useEffect(() => {
        async function fetchCourseData() {
            try {
                const res = await http.get("/api/get-course", {
                    params: { courseId },
                });

                const { sentences } = res.data.result;

                // Dịch các câu qua Google Translate API
                const sentenceTranslations = {};

                for (const sentence of sentences) {
                    sentenceTranslations[sentence] = await translateSentence(sentence, selectedLang);
                }

                setTranslations(sentenceTranslations);  // Lưu bản dịch vào state
            } catch (error) {
                console.error("Lỗi khi gọi API get-course:", error);
            }
        }

        fetchCourseData();
    }, [courseId, selectedLang]);

    const translateSentence = async (sentence, lang) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        q: sentence,
                        target: lang,
                    }),
                }
            );

            const data = await response.json();
            return data.data.translations[0].translatedText;  // Trả về bản dịch
        } catch (error) {
            console.error("Lỗi dịch câu:", error);
            return "Không có bản dịch.";  // Nếu có lỗi thì hiển thị thông báo lỗi
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (e) => {
        setSelectedLang(e.target.value);
    };

    const sentences = Object.keys(translations);

    return (
        <div className="border p-3 rounded bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">🌐 Dịch nghĩa</h2>

            {/* Language Selector Dropdown */}
            <div className="mb-2">
                <select
                    value={selectedLang}
                    onChange={handleLanguageChange}
                    className="px-3 py-2 border rounded bg-white text-gray-700 w-full"
                >
                    {["en", "vi", "fr", "es", "de", "it"].map((lang) => (
                        <option key={lang} value={lang}>
                            {languageLabels[lang] || lang}
                        </option>
                    ))}
                </select>
            </div>

            {/* Hiển thị các câu và bản dịch */}
            <div className="space-y-4">
                {loading ? (
                    <div>Đang tải dữ liệu...</div>
                ) : sentences.length > 0 ? (
                    sentences.map((sentence, index) => (
                        <div key={index} className="text-gray-800">
                            <div className="font-semibold">{sentence}</div>
                            <div className="italic">
                                {translations[sentence] || "Không có bản dịch."}
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
