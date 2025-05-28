import { useState, useEffect } from "react";

export default function TranslationBox({ translation = { en: "No translation available", vi: "Chưa có bản dịch" } }) {
    const [selectedLang, setSelectedLang] = useState("en");

    const languageLabels = {
        en: "English",
        vi: "Vietnamese",
    };

    const uiText = {
        title: {
            en: "🌐 Translations",
        },
        empty: {
            en: "There are no translations available.",
        },
    };

    useEffect(() => {
        console.log("New translation received: ", translation);
    }, [translation]);  // Khi translation thay đổi, nó sẽ re-render và log dữ liệu mới.

    return (
        <div className="border p-3 rounded bg-white shadow">
            <h2 className="text-lg font-semibold mb-2">{uiText.title["en"]}</h2>

            <div className="mb-2">
                <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="px-3 py-2 border rounded bg-white text-gray-700 w-full"
                >
                    <option value="en">{languageLabels["en"]}</option>
                    <option value="vi">{languageLabels["vi"]}</option>
                </select>
            </div>

            <div className="space-y-4">
                <div className="text-gray-800">
                    <div className="font-semibold cursor-pointer hover:text-blue-600">
                        {translation[selectedLang]}
                    </div>
                </div>
            </div>
        </div>
    );
}
