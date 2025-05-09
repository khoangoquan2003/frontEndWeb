import { useState, useRef, useEffect } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";

export default function PronunciationBox({ sentence, wordPronunciations }) {
    const [activeIndex, setActiveIndex] = useState(null);
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

    useEffect(() => {
        if (activeIndex !== null && wordRefs.current[activeIndex]) {
            floatingRefs.setReference(wordRefs.current[activeIndex]);
            update();
        }
    }, [activeIndex, floatingRefs, update]);

    const handleWordClick = (index) => {
        setActiveIndex(index);
        const audio = new Audio(wordPronunciations[index].audioUrl);
        audio.play().catch((err) => {
            console.error("Error playing audio:", err);
        });
    };

    return (
        <div className="relative">
            <div className="text-lg flex flex-wrap gap-2">
                {wordPronunciations.map((word, index) => (
                    <span
                        key={index}
                        ref={(el) => (wordRefs.current[index] = el)}
                        onClick={() => handleWordClick(index)}
                        className="text-blue-700 cursor-pointer hover:underline"
                    >
                        {word.word}
                    </span>
                ))}
            </div>

            {activeIndex !== null && (
                <div
                    ref={floatingRefs.setFloating}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                    }}
                    className="absolute bg-white border border-gray-300 p-3 rounded shadow-md z-50 w-64"
                >
                    <div className="text-sm space-y-1">
                        <p className="font-semibold text-black">{wordPronunciations[activeIndex].word}</p>
                        {wordPronunciations[activeIndex].pronunciation && (
                            <p className="italic text-gray-600">{wordPronunciations[activeIndex].pronunciation}</p>
                        )}
                        {wordPronunciations[activeIndex].example && (
                            <p className="text-gray-800">📘 Ví dụ: {wordPronunciations[activeIndex].example}</p>
                        )}
                        <button
                            onClick={() => setActiveIndex(null)}
                            className="text-xs text-blue-600 hover:underline mt-2"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
