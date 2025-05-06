import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { http } from "../../api/Http"; // ✅ Dùng http thay vì axios

export default function DictationPractice() {
    const [searchParams] = useSearchParams();
    const courseId = parseInt(searchParams.get("courseId") || "1");
    const audioRef = useRef(null);
    const [sentences, setSentences] = useState([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [revealedAnswer, setRevealedAnswer] = useState("");
    const [input, setInput] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [audioUrl, setAudioUrl] = useState("");

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // Load course data, sentences, and initial audio
    const loadCourseData = async () => {
        setLoading(true);
        try {
            const res = await http.get(`/api/get-course`, {
                params: { courseId }
            });

            const { sentences, sentenceAudios } = res.data.result;

            if (!sentences || !sentenceAudios || !sentenceAudios[0]) {
                console.error("Dữ liệu không đầy đủ: thiếu câu hoặc audio.");
                return;
            }

            setSentences(sentences.map((text, i) => ({
                correctAnswer: text,
                audioUrl: sentenceAudios[i] || ""
            })));
            setCurrentSentenceIndex(0);
            setCorrectAnswer(sentences[0]);
            setAudioUrl(sentenceAudios[0]);

            setInput("");
            setShowAnswer(false);
        } catch (err) {
            console.error("Lỗi khi tải khóa học:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error);
            });
        }
    };


    // Pause audio
    const handlePause = () => audioRef.current?.pause();

    // Seek to a specific point in the audio
    const handleSeek = (e) => {
        const newProgress = parseFloat(e.target.value);
        if (audioRef.current?.duration) {
            audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
        }
        setProgress(newProgress);
    };

    // Change playback speed
    const handleChangeSpeed = (rate) => {
        setPlaybackRate(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (!audioRef.current) return;
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        audioRef.current.volume = newMuted ? 0 : volume;
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        setIsMuted(vol === 0);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
    };

    // Check the user's input
    const handleCheck = async () => {
        setLoadingAnswer(true);

        try {
            const userInput = input.trim();
            if (!userInput) {
                setRevealedAnswer("Vui lòng nhập câu trả lời.");
                setShowAnswer(true);
                return;
            }

            console.log("📤 Gửi câu trả lời:", userInput);

            const res = await http.post(
                `/api/check-sentence?courseId=${courseId}`,
                userInput,
                {
                    headers: {
                        "Content-Type": "text/plain"
                    }
                }
            );

            const result = res.data;
            console.log("📥 Kết quả từ server:", result);

            if (result.trim().toLowerCase().startsWith("correct")) {
                setRevealedAnswer(result);
                setShowAnswer(true);
                await new Promise(resolve => setTimeout(resolve, 1500));
                loadNextSentence();
            } else {
                setRevealedAnswer(result);
                setShowAnswer(true);

            }



        } catch (error) {
            console.error("❌ Lỗi khi kiểm tra câu:", error);
            setRevealedAnswer("❌ Lỗi server! Không kiểm tra được câu trả lời.");
            setShowAnswer(true);
        } finally {
            setLoadingAnswer(false);
        }
    };

    // Load next sentence and its audio
    const loadNextSentence = () => {
        if (currentSentenceIndex < sentences.length - 1) {
            const nextIndex = currentSentenceIndex + 1;
            setCurrentSentenceIndex(nextIndex);
            setInput("");
            setShowAnswer(false);

            const next = sentences[nextIndex];
            setCorrectAnswer(next.correctAnswer);
            setAudioUrl(next.audioUrl);

            if (audioRef.current) {
                audioRef.current.src = next.audioUrl;
                audioRef.current.load();
            }
        } else {
            console.log("Đã hoàn thành khóa học này.");
        }
    };

    useEffect(() => {
        loadCourseData();
    }, [courseId]);

    useEffect(() => {
        console.log("Đã cập nhật audioUrl:", audioUrl);
    }, [audioUrl]);
    useEffect(() => {
        if (duration > 0) {
            setProgress((currentTime / duration) * 100);
        }
    }, [currentTime, duration]);




    return (
        <div className="max-w-xl mx-auto mt-10 p-4 space-y-4">
            <h1 className="text-2xl font-bold">🎧 Dictation Practice</h1>

            <audio
                ref={audioRef}
                src={audioUrl}
                preload="auto"
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            />

            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="flex-grow"
                />
                <span className="text-sm text-gray-600 w-12 text-right">{formatTime(duration)}</span>
            </div>

            <div className="space-x-2">
                <button onClick={handlePlay} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">▶️ Nghe</button>
                <button onClick={handlePause} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">⏸ Dừng</button>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
                {[1.0, 1.25, 1.5, 1.75, 2.0].map((rate) => (
                    <button
                        key={rate}
                        onClick={() => handleChangeSpeed(rate)}
                        className={`px-3 py-1 rounded border ${playbackRate === rate ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
                    >
                        {rate}x
                    </button>
                ))}
                <button onClick={toggleMute} className="text-xl ml-2">
                    {isMuted || volume === 0 ? "🔇" : "🔊"}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-28"
                />
            </div>

            <textarea
                rows={4}
                placeholder="Gõ lại đoạn bạn vừa nghe..."
                className="w-full p-2 border border-gray-300 rounded"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <div className="space-x-2 mt-2">
                <button
                    onClick={handleCheck}
                    className={`px-4 py-2 ${loadingAnswer ? "bg-gray-500 cursor-not-allowed" : "bg-green-600"} text-white rounded hover:bg-green-700`}
                    disabled={loadingAnswer}
                >
                    {loadingAnswer ? "Đang kiểm tra..." : "✔️ Kiểm tra"}
                </button>
            </div>

            {showAnswer && (
                <div className="bg-gray-100 p-3 rounded">
                    <p><strong>Phản hồi:</strong> {revealedAnswer}</p>
                </div>
            )}

            {loading && (
                <div className="text-center mt-4 text-blue-600">Đang tải câu tiếp theo...</div>
            )}
        </div>
    );
}
