import React, { useState, useRef, useEffect } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";

// Component Popup hiển thị chi tiết khi người dùng nhấn vào từ
function Popup({ word, x, y, strategy, floatingRefs, closePopup }) {
    return (
        <div
            ref={floatingRefs.setFloating}
            style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
            className="absolute bg-white text-black p-2 rounded shadow-md z-50"
        >
            <p className="font-semibold">{word.text}</p>
            <p className="italic">{word.pronunciation}</p>
            <button
                className="text-xs mt-1 underline text-blue-600"
                onClick={closePopup}
            >
                Đóng
            </button>
        </div>
    );
}

export default function PronunciationBox({ sentence, translation }) {
    const [activeWordIndex, setActiveWordIndex] = useState(null);
    const [words, setWords] = useState([]);
    const [wordDetails, setWordDetails] = useState(null); // To store details of the clicked word
    const wordRefs = useRef([]);
    const {
        x,
        y,
        strategy,
        refs: floatingRefs,
        update,
    } = useFloating({
        middleware: [offset(6), flip(), shift()],
        whileElementsMounted: autoUpdate,
        placement: "bottom",
    });

    // Chia câu thành các từ và lưu chúng vào state
    useEffect(() => {
        if (sentence) {
            const rawWords = sentence.split(" ").map(word => word.toLowerCase());
            setWords(rawWords);
        }
    }, [sentence]);

    useEffect(() => {
        if (activeWordIndex !== null && wordRefs.current[activeWordIndex]) {
            floatingRefs.setReference(wordRefs.current[activeWordIndex]);
            update();
        }
    }, [activeWordIndex, floatingRefs, update]);

    // Xử lý khi người dùng click vào một từ
    const handleWordClick = async (index) => {
        setActiveWordIndex(index);
        const word = words[index];

        try {
            // Gọi API từ điển để lấy chi tiết từ
            const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const dictData = await dictRes.json();
            const entry = dictData[0];
            const phonetic = entry.phonetics?.find((p) => p.audio)?.text || "";
            const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio || "";

            // Lưu thông tin chi tiết của từ
            setWordDetails({ text: word, pronunciation: phonetic, audioUrl });

            // Phát âm từ nếu có audio URL
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play().catch((err) => console.error("Lỗi phát âm thanh:", err));
            } else {
                // Nếu không có audio, dùng SpeechSynthesis để phát âm
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.lang = "en-US";
                speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API từ điển:", error);
        }
    };

    // Đóng popup khi người dùng bấm nút "Đóng"
    const closePopup = () => {
        setActiveWordIndex(null);
        setWordDetails(null);
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">🔊 Phát âm câu</h2>
            {/* Hiển thị câu và tách các từ */}
            <div className="text-xl flex flex-wrap gap-2">
                {words.map((word, index) => (
                    <span
                        key={index}
                        ref={(el) => (wordRefs.current[index] = el)}
                        onClick={() => handleWordClick(index)} // Khi click vào từ, gọi handleWordClick
                        className="cursor-pointer text-blue-700 hover:underline"
                    >
                        {word}
                    </span>
                ))}
            </div>

            {/* Hiển thị Popup nếu người dùng nhấn vào từ */}
            {wordDetails && (
                <Popup
                    word={wordDetails}
                    x={x}
                    y={y}
                    strategy={strategy}
                    floatingRefs={floatingRefs}
                    closePopup={closePopup}
                />
            )}

            {/* Hiển thị dịch câu nếu có */}
            {translation && (
                <p className="mt-2 italic text-gray-600">Dịch: {translation}</p>
            )}
        </div>
    );
}
