import { useState, useEffect } from "react";
import { http } from "../../api/Http";

export default function TranslationBox({ courseId = 1 }) {
    const [sentences, setSentences] = useState([]);
    const [translations, setTranslations] = useState({});
    const [selectedLang, setSelectedLang] = useState("vi");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [userInputText, setUserInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");

    const languageLabels = {
        en: "English",
        vi: "Tiếng Việt",
    };

    const uiText = {
        title: {
            en: "🌐 Translations",
            vi: "🌐 Dịch nghĩa",
        },
        loading: {
            en: "Loading data...",
            vi: "Đang tải dữ liệu...",
        },
        error: {
            en: "An error occurred while loading the data.",
            vi: "Đã xảy ra lỗi khi tải dữ liệu.",
        },
        empty: {
            en: "There are no sentences to translate.",
            vi: "Không có câu để dịch.",
        },
    };

    const translateSentence = async (sentence, targetLang) => {
        if (!sentence) return "";
        try {
            const res = await fetch("https://libretranslate.de/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    q: sentence,
                    source: "en",
                    target: targetLang,
                    format: "text",
                }),
            });
            const data = await res.json();
            return data?.translatedText || sentence;
        } catch (err) {
            console.error("Translation error:", err);
            return sentence;
        }
    };

    useEffect(() => {
        async function fetchCourseData() {
            setLoading(true);
            setError(null);
            try {
                const { data } = await http.get(`/api/get-course?courseId=${courseId}`);
                const { sentences } = data.result;
                setSentences(sentences);
            } catch (error) {
                console.error("Error loading course data:", error);
                setError(uiText.error[selectedLang] || uiText.error["en"]);
            } finally {
                setLoading(false);
            }
        }

        fetchCourseData();
    }, [courseId]);

    useEffect(() => {
        async function translateAllSentences() {
            setLoading(true);
            const sentenceTranslations = {};

            for (const sentence of sentences) {
                const translated = await translateSentence(sentence, selectedLang);
                sentenceTranslations[sentence] = translated;
            }

            setTranslations(sentenceTranslations);
            setLoading(false);
        }

        if (sentences.length > 0) {
            translateAllSentences();
        }
    }, [sentences, selectedLang]);

    const handleTranslateCustomText = async () => {
        if (!userInputText.trim()) return;
        setLoading(true);
        try {
            const translated = await translateSentence(userInputText, selectedLang);
            setTranslatedText(translated);
        } catch (err) {
            console.error("Error translating custom text:", err);
            setTranslatedText(uiText.error[selectedLang] || uiText.error["en"]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border p-3 rounded bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">{uiText.title[selectedLang]}</h2>

            <div className="mb-2">
                <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="px-3 py-2 border rounded bg-white text-gray-700 w-full"
                >
                    {Object.keys(languageLabels).map((lang) => (
                        <option key={lang} value={lang}>
                            {languageLabels[lang]}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="space-y-4">
                {loading ? (
                    <div>{uiText.loading[selectedLang]}</div>
                ) : sentences.length > 0 ? (
                    sentences.map((sentence, index) => (
                        <div key={index} className="text-gray-800">
                            <div
                                className="font-semibold cursor-pointer hover:text-blue-600"
                                onClick={() => setUserInputText(sentence)}
                            >
                                {sentence}
                            </div>
                            <div className="italic text-green-700">
                                {translations[sentence] || "..."}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>{uiText.empty[selectedLang]}</div>
                )}
            </div>

        </div>
    );
}
