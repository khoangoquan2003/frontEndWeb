"use client"

import { useState, useRef, useEffect } from "react"
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react"
import { Button } from "../ui/button" // Import Button từ shadcn/ui
import { Card } from "../ui/card" // Import Card từ shadcn/ui
import { X } from "lucide-react" // Import icon X cho nút đóng

export default function WordPronunciationPopup({ words }) {
    const [activeIndex, setActiveIndex] = useState(null)
    const refs = useRef([])
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
    })

    useEffect(() => {
        if (activeIndex !== null && refs.current[activeIndex]) {
            floatingRefs.setReference(refs.current[activeIndex])
            update()
        }
    }, [activeIndex, floatingRefs, update])

    const handleClick = (index) => {
        setActiveIndex(index)
        const audio = new Audio(words[index].audioUrl)
        audio.play().catch((err) => {
            console.error("Error playing audio:", err)
        })
    }

    return (
        <div className="relative">
            <div className="flex flex-wrap gap-2 text-lg">
                {words.map((word, index) => (
                    <Button
                        key={index}
                        ref={(el) => (refs.current[index] = el)}
                        onClick={() => handleClick(index)}
                        variant="link" // Sử dụng variant "link" để trông giống văn bản
                        className="text-blue-700 hover:no-underline text-lg p-0 h-auto" // Điều chỉnh padding và chiều cao
                    >
                        {word.word}
                    </Button>
                ))}
            </div>

            {activeIndex !== null && (
                <Card
                    ref={floatingRefs.setFloating}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                    }}
                    className="absolute bg-green-600 text-white p-3 rounded-lg shadow-lg z-50 flex flex-col items-start"
                >
                    <p className="font-semibold text-lg mb-1">{words[activeIndex].word}</p>
                    <Button
                        variant="ghost" // Sử dụng variant "ghost" cho nút đóng
                        size="sm"
                        className="mt-auto self-end text-white hover:bg-green-700 hover:text-white p-0 h-auto" // Điều chỉnh màu sắc và hover
                        onClick={() => setActiveIndex(null)}
                    >
                        <X className="h-4 w-4 mr-1" /> Đóng
                    </Button>
                </Card>
            )}
        </div>
    )
}
