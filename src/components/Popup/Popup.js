"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { X } from "lucide-react" // Import icon cho nút đóng

// KEEPING ORIGINAL HTTP IMPORT - DO NOT MODIFY
import { http } from "../../api/Http" // Đảm bảo bạn có http từ config của bạn

export default function Popup({ courseId = 1 }) {
    const [words, setWords] = useState([]) // Lưu tất cả các từ
    const [activeWordIndex, setActiveWordIndex] = useState(null) // Chỉ số của từ đang active
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
        placement: "bottom",
    })

    useEffect(() => {
        if (activeWordIndex !== null && refs.current[activeWordIndex]) {
            floatingRefs.setReference(refs.current[activeWordIndex])
            update()
        }
    }, [activeWordIndex, floatingRefs, update])

    // KEEPING ORIGINAL fetchCourseData LOGIC - DO NOT MODIFY
    const fetchCourseData = useCallback(async () => {
        try {
            // Gọi API để lấy dữ liệu khóa học
            const res = await http.get("/api/get-course", {
                params: { courseId },
            })

            // Kiểm tra dữ liệu trả về từ API
            const { sentences } = res.data.result

            // Tách từng câu thành từ riêng biệt
            const rawWords = sentences.flatMap((sentence) => sentence.split(" ").map((word) => word.toLowerCase()))

            // Fetch audio và pronunciation cho từng từ
            const wordData = await Promise.all(
                rawWords.map(async (word) => {
                    try {
                        // Gọi API từ điển cho từng từ để lấy audio và phát âm
                        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                        const json = await dictRes.json()

                        const entry = json[0]
                        const phonetic = entry.phonetics?.find((p) => p.audio)?.text || ""
                        const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio || ""

                        return { text: word, pronunciation: phonetic, audioUrl }
                    } catch (err) {
                        // Nếu không tìm thấy thông tin từ điển, trả về dữ liệu mặc định
                        return { text: word, pronunciation: "", audioUrl: "" }
                    }
                }),
            )

            setWords(wordData) // Lưu các từ vào state
        } catch (error) {
            console.error("Lỗi khi gọi API get-course:", error)
        }
    }, [courseId])

    useEffect(() => {
        fetchCourseData() // Gọi API khi component mount
    }, [fetchCourseData])

    // KEEPING ORIGINAL handleClick LOGIC - DO NOT MODIFY
    // Khi nhấn vào từ, hiển thị chi tiết popup và phát âm
    const handleClick = (index) => {
        setActiveWordIndex(index)
        const word = words[index]

        // Phát âm từ nếu có audio URL
        if (word.audioUrl) {
            const audio = new Audio(word.audioUrl)
            audio.play().catch((err) => console.error("Lỗi phát âm thanh:", err))
        } else {
            // Nếu không có audio, dùng SpeechSynthesis để phát âm
            const utterance = new SpeechSynthesisUtterance(word.text)
            utterance.lang = "en-US"
            speechSynthesis.speak(utterance)
        }
    }

    return (
        <div className="p-6 relative">
            <Card className="p-6 border-none shadow-lg">
                <div className="flex flex-wrap gap-2 text-xl">
                    {/* Hiển thị các từ trong câu */}
                    {words.map((word, index) => (
                        <Button
                            key={index}
                            ref={(el) => (refs.current[index] = el)}
                            onClick={() => handleClick(index)} // Khi click vào từ, phát âm từ đó
                            variant="link" // Sử dụng variant "link" của shadcn/ui
                            className="text-blue-700 hover:no-underline text-xl p-0 h-auto" // Điều chỉnh style để trông giống từ trong câu hơn
                        >
                            {word.text}
                        </Button>
                    ))}
                </div>
            </Card>

            {/* Hiển thị phần chi tiết khi chọn một từ */}
            {activeWordIndex !== null && (
                <div
                    ref={floatingRefs.setFloating}
                    style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
                    className="absolute bg-white text-black p-4 rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col items-start min-w-[150px]"
                >
                    <p className="font-bold text-lg mb-1">{words[activeWordIndex].text}</p>
                    <p className="italic text-sm text-gray-600 mb-2">{words[activeWordIndex].pronunciation}</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-auto self-end text-blue-600 hover:underline p-0 h-auto"
                        onClick={() => setActiveWordIndex(null)}
                    >
                        <X className="h-4 w-4 mr-1" /> Đóng
                    </Button>
                </div>
            )}
        </div>
    )
}
