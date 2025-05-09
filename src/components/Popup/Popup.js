import React, { useState, useRef, useEffect } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";

const words = [
    { text: "Hello", pronunciation: "/həˈloʊ/", audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_us_1.mp3" },
    { text: "world", pronunciation: "/wɜːrld/", audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20200429/world--_us_1.mp3" },
    { text: "from", pronunciation: "/frʌm/", audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20200429/from--_us_1.mp3" },
    { text: "Floating", pronunciation: "/ˈfloʊ.tɪŋ/", audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20200429/floating--_us_1.mp3" },
    { text: "UI", pronunciation: "/ˌjuːˈaɪ/", audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20200429/ui--_us_1.mp3" }
];

export default function Popup() {
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
        placement: "bottom"
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
        <div className="p-6 relative">
            <div className="flex flex-wrap gap-2 text-xl">
                {words.map((word, index) => (
                    <span
                        key={index}
                        ref={(el) => (refs.current[index] = el)}
                        onClick={() => handleClick(index)}
                        className="cursor-pointer text-blue-700 hover:underline"
                    >
            {word.text}
          </span>
                ))}
            </div>

            {activeIndex !== null && (
                <div
                    ref={floatingRefs.setFloating}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0
                    }}
                    className="absolute bg-green-500 text-white p-2 rounded shadow-md z-50"
                >
                    <p className="font-semibold">{words[activeIndex].text}</p>
                    <p className="italic">{words[activeIndex].pronunciation}</p>
                    <button className="text-xs mt-1 underline" onClick={() => setActiveIndex(null)}>
                        Đóng
                    </button>
                </div>
            )}
        </div>
    );
}
