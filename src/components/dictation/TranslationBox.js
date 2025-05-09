import { useState } from "react";

export default function TranslationBox({ translation }) {
    const [selectedLang, setSelectedLang] = useState("vi");

    const languageLabels = {
        en: "🇬🇧 English",
        vi: "🇻🇳 Tiếng Việt",
        fr: "🇫🇷 Français",  // Example: French
        es: "🇪🇸 Español",   // Example: Spanish
        de: "🇩🇪 Deutsch",   // Example: German
        it: "🇮🇹 Italiano",  // Example: Italian
    };

    const availableLanguages = Object.keys(translation);

    const handleLanguageChange = (e) => {
        setSelectedLang(e.target.value);
    };

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
                    {availableLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                            {languageLabels[lang] || lang}
                        </option>
                    ))}
                </select>
            </div>

            {/* Selected Translation */}
            <div className="text-gray-800 italic">
                {translation[selectedLang] || "Không có bản dịch."}
            </div>
        </div>
    );
}
