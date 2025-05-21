import React, { useState, useRef, useEffect } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import { http } from "../../api/Http"; // ✅ dùng http từ config của bạn

export default function Popup({ courseId = 1 }) {
    const [words, setWords] = useState([]); // Lưu tất cả các từ
    const [activeWordIndex, setActiveWordIndex] = useState(null); // Chỉ số của từ đang active
    const refs = useRef([]);

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

    useEffect(() => {
        if (activeWordIndex !== null && refs.current[activeWordIndex]) {
            floatingRefs.setReference(refs.current[activeWordIndex]);
            update();
        }
    }, [activeWordIndex, floatingRefs, update]);

    useEffect(() => {
        async function fetchCourseData() {
            try {
                const res = await http.get("/api/get-course", {
                    params: { courseId },
                });

                const { sentences } = res.data.result;

                // Tách từng câu thành từ riêng biệt
                const rawWords = sentences.flatMap((sentence) =>
                    sentence.split(" ").map((word) => word.toLowerCase())
                );

                // Fetch audio và pronunciation cho từng từ
                const wordData = await Promise.all(
                    rawWords.map(async (word) => {
                        try {
                            const dictRes = await fetch(
                                `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
                            );
                            const json = await dictRes.json();
                            const entry = json[0];
                            const phonetic =
                                entry.phonetics?.find((p) => p.audio)?.text || "";
                            const audioUrl =
                                entry.phonetics?.find((p) => p.audio)?.audio || "";

                            return { text: word, pronunciation: phonetic, audioUrl };
                        } catch {
                            return { text: word, pronunciation: "", audioUrl: "" }; // fallback
                        }
                    })
                );

                setWords(wordData); // Lưu các từ vào state
            } catch (error) {
                console.error("Lỗi gọi API get-course:", error);
            }
        }

        fetchCourseData();
    }, [courseId]);

    const handleClick = (index) => {
        setActiveWordIndex(index);
        const word = words[index];

        if (word.audioUrl) {
            const audio = new Audio(word.audioUrl);
            audio.play().catch((err) => console.error("Lỗi phát âm thanh:", err));
        } else {
            const utterance = new SpeechSynthesisUtterance(word.text);
            utterance.lang = "en-US";
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="p-6 relative">
            <div className="flex flex-wrap gap-2 text-xl">
                {words.map((word, index) => (
                    <span
                        key={index}
                        ref={(el) => (refs.current[index] = el)}
                        onClick={() => handleClick(index)} // Khi click vào từ, phát âm từ đó
                        className="cursor-pointer text-blue-700 hover:underline"
                    >
                        {word.text}
                    </span>
                ))}
            </div>

            {activeWordIndex !== null && (
                <div
                    ref={floatingRefs.setFloating}
                    style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
                    className="absolute bg-green-500 text-white p-2 rounded shadow-md z-50"
                >
                    <p className="font-semibold">{words[activeWordIndex].text}</p>
                    <p className="italic">{words[activeWordIndex].pronunciation}</p>
                    <button
                        className="text-xs mt-1 underline"
                        onClick={() => setActiveWordIndex(null)}
                    >
                        Đóng
                    </button>
                </div>
            )}
        </div>
    );
}
