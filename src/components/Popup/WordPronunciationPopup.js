// src/components/WordPronunciationPopup.js
import { useState, useRef, useEffect } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";

export default function WordPronunciationPopup({ words }) {
    const [activeIndex, setActiveIndex] = useState(null);
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
        placement: "top",
    });

    useEffect(() => {
        if (activeIndex !== null && refs.current[activeIndex]) {
            floatingRefs.setReference(refs.current[activeIndex]);
            update();
        }
    }, [activeIndex, floatingRefs, update]);

    const handleClick = (index) => {
        setActiveIndex(index);
        const audio = new Audio(words[index].audioUrl);
        audio.play().catch((err) => {
            console.error("Error playing audio:", err);
        });
    };

    return (
        <div className="relative">
            <div className="flex flex-wrap gap-2 text-lg">
                {words.map((word, index) => (
                    <span
                        key={index}
                        ref={(el) => (refs.current[index] = el)}
                        onClick={() => handleClick(index)}
                        className="cursor-pointer text-blue-700 hover:underline"
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
                    className="absolute bg-green-600 text-white p-2 rounded shadow-md z-50"
                >
                    <p className="font-semibold">{words[activeIndex].word}</p>
                    <button
                        className="text-xs mt-1 underline"
                        onClick={() => setActiveIndex(null)}
                    >
                        Đóng
                    </button>
                </div>
            )}
        </div>
    );
}
