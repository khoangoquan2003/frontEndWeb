"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { X } from "lucide-react" // Import icon X cho nút đóng

// Component WordPopup hiển thị chi tiết khi người dùng nhấn vào từ
function WordPopup({ word, x, y, strategy, floatingRefs, closePopup }) {
    return (
        <Card
            ref={floatingRefs.setFloating}
            style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
            className="absolute bg-white text-black p-3 rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col items-start min-w-[150px]"
        >
            <p className="font-bold text-lg mb-1">{word.text}</p>
            <p className="italic text-sm text-gray-600 mb-2">{word.pronunciation}</p>
            <Button
                variant="ghost"
                size="sm"
                className="mt-auto self-end text-blue-600 hover:underline p-0 h-auto"
                onClick={closePopup}
            >
                <X className="h-4 w-4 mr-1" /> Đóng
            </Button>
        </Card>
    )
}

export default function PronunciationBox({ sentence, translation }) {
    const [activeWordIndex, setActiveWordIndex] = useState(null)
    const [words, setWords] = useState([])
    const [wordDetails, setWordDetails] = useState(null) // To store details of the clicked word
    const wordRefs = useRef([])
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
    })

    // Chia câu thành các từ và lưu chúng vào state
    useEffect(() => {
        if (sentence) {
            const rawWords = sentence.split(" ").map((word) => word.toLowerCase())
            setWords(rawWords)
        }
    }, [sentence])

    useEffect(() => {
        if (activeWordIndex !== null && wordRefs.current[activeWordIndex]) {
            floatingRefs.setReference(wordRefs.current[activeWordIndex])
            update()
        }
    }, [activeWordIndex, floatingRefs, update])

    // Xử lý khi người dùng click vào một từ
    const handleWordClick = async (index) => {
        setActiveWordIndex(index)
        const word = words[index]

        try {
            // Gọi API từ điển để lấy chi tiết từ
            const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            const dictData = await dictRes.json()
            const entry = dictData[0]
            const phonetic = entry.phonetics?.find((p) => p.audio)?.text || ""
            const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio || ""

            // Lưu thông tin chi tiết của từ
            setWordDetails({ text: word, pronunciation: phonetic, audioUrl })

            // Phát âm từ nếu có audio URL
            if (audioUrl) {
                const audio = new Audio(audioUrl)
                audio.play().catch((err) => console.error("Lỗi phát âm thanh:", err))
            } else {
                // Nếu không có audio, dùng SpeechSynthesis để phát âm
                const utterance = new SpeechSynthesisUtterance(word)
                utterance.lang = "en-US"
                speechSynthesis.speak(utterance)
            }
        } catch (error) {
            console.error("Lỗi khi gọi API từ điển:", error)
            // Optionally, set a default wordDetails or show an error message
            setWordDetails({ text: word, pronunciation: "Không tìm thấy phát âm", audioUrl: "" })
        }
    }

    // Đóng popup khi người dùng bấm nút "Đóng"
    const closePopup = useCallback(() => {
        setActiveWordIndex(null)
        setWordDetails(null)
    }, [])

    return (
        <Card className="p-4 border rounded-lg bg-white shadow-sm">
            <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">🔊 Phát âm câu</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {/* Hiển thị câu và tách các từ */}
                <div className="text-xl flex flex-wrap gap-2">
                    {words.map((word, index) => (
                        <Button
                            key={index}
                            ref={(el) => (wordRefs.current[index] = el)}
                            onClick={() => handleWordClick(index)} // Khi click vào từ, gọi handleWordClick
                            variant="link" // Sử dụng variant "link" của shadcn/ui
                            className="text-blue-700 hover:no-underline text-xl p-0 h-auto" // Điều chỉnh style để trông giống từ trong câu hơn
                        >
                            {word}
                        </Button>
                    ))}
                </div>

                {/* Hiển thị Popup nếu người dùng nhấn vào từ */}
                {wordDetails && (
                    <WordPopup
                        word={wordDetails}
                        x={x}
                        y={y}
                        strategy={strategy}
                        floatingRefs={floatingRefs}
                        closePopup={closePopup}
                    />
                )}

                {/* Hiển thị dịch câu nếu có */}
                {translation && <p className="mt-2 italic text-gray-600">Dịch: {translation}</p>}
            </CardContent>
        </Card>
    )
}
