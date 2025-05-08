import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { http } from "../../api/Http";
import TranslationBox from './TranslationBox';
import PronunciationBox from './PronunciationBox';
import CommentBox from './CommentBox';
import Popup from "../Popup/Popup";
import AudioPlayerPage  from "./AudioPlayerPage";

export default function DictationPractice() {
    const [currentPage, setCurrentPage] = useState("dictation");

    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
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
    const [translation, setTranslation] = useState({ en: "", vi: "" });
    const [pronunciation, setPronunciation] = useState({
        sentence: "",
        words: []
    });
    const [comments, setComments] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing

    const handleDownload = (audioUrl) => {
        if (!audioUrl) {
            console.error("Không có URL âm thanh để tải về.");
            return;
        }

        // Tạo thẻ <a> để trigger việc tải file
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = audioUrl.split("/").pop(); // Đặt tên file tải về từ URL (hoặc bạn có thể đặt tên khác nếu cần)
        link.click();
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const loadCourseData = async () => {
        setLoading(true);
        try {
            const res = await http.get(`/api/get-course`, {
                params: { courseId }
            });

            const { sentences, sentenceAudios, sentencePronunciations } = res.data.result;

            if (!sentences || !sentenceAudios || !sentenceAudios[0]) {
                console.error("Dữ liệu không đầy đủ: thiếu câu hoặc audio.");
                return;
            }

            setSentences(sentences.map((text, i) => ({
                correctAnswer: text,
                audioUrl: sentenceAudios[i] || "",
                pronunciation: sentencePronunciations[i] || []
            })));

            const firstSentence = sentences[0];
            setCorrectAnswer(firstSentence);
            setAudioUrl(sentenceAudios[0]);

            // Set pronunciation for the first sentence
            setPronunciation({
                sentence: firstSentence,
                words: sentencePronunciations[0].map(word => ({
                    word: word.text,
                    audioUrl: word.audioUrl
                }))
            });

            setInput("");
            setShowAnswer(false);
        } catch (err) {
            console.error("Lỗi khi tải khóa học:", err);
        } finally {
            setLoading(false);
        }
    };

    // Play the audio
    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error);
            });
            setIsPlaying(true);
        }
    };

    // Pause the audio
    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (e) => {
        const newProgress = parseFloat(e.target.value);
        if (audioRef.current?.duration) {
            audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
        }
        setProgress(newProgress);
    };

    const handleChangeSpeed = (rate) => {
        setPlaybackRate(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        audioRef.current.volume = newMuted ? 0 : volume;
    };

    const handleVolumeChange = (e) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        setIsMuted(vol === 0);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
    };

    const handleCheck = async () => {
        setLoadingAnswer(true);

        try {
            const userInput = input.trim();
            if (!userInput) {
                setRevealedAnswer("Vui lòng nhập câu trả lời.");
                setShowAnswer(true);
                return;
            }

            const res = await http.post(
                `/api/check-sentence?courseId=${courseId}`,
                userInput,
                { headers: { "Content-Type": "text/plain" } }
            );

            const result = res.data;

            if (result.trim().toLowerCase().startsWith("correct")) {
                setRevealedAnswer("✅ Chính xác!");
                setShowAnswer(true);
                await new Promise(resolve => setTimeout(resolve, 1500));
                loadNextSentence();
            } else {
                setRevealedAnswer(`❌ Sai rồi! Đáp án đúng là: "${correctAnswer}"`);
                setShowAnswer(true);
                await http.post(`/api/reset-progress`);
            }

        } catch (error) {
            console.error("❌ Lỗi khi kiểm tra câu:", error);
            setRevealedAnswer("❌ Lỗi server! Không kiểm tra được câu trả lời.");
            setShowAnswer(true);
        } finally {
            setLoadingAnswer(false);
        }
    };

    const loadNextSentence = () => {
        if (currentSentenceIndex < sentences.length - 1) {
            const nextIndex = currentSentenceIndex + 1;
            setCurrentSentenceIndex(nextIndex);
            setInput("");
            setShowAnswer(false);

            const next = sentences[nextIndex];
            setCorrectAnswer(next.correctAnswer);
            setAudioUrl(next.audioUrl);

            // Set pronunciation for the next sentence
            setPronunciation({
                sentence: next.correctAnswer,
                words: next.pronunciation.map(word => ({
                    word: word.text,
                    audioUrl: word.audioUrl
                }))
            });

            if (audioRef.current) {
                audioRef.current.src = next.audioUrl;
                audioRef.current.load();
            }
        } else {
            console.log("Đã hoàn thành khóa học này.");
        }
    };

    const playWordPronunciation = (wordAudioUrl) => {
        const audio = new Audio(wordAudioUrl);
        audio.play().catch(error => {
            console.error("Error playing word pronunciation:", error);
        });
    };

    useEffect(() => {
        loadCourseData();
    }, [courseId]);

    useEffect(() => {
        if (duration > 0) {
            setProgress((currentTime / duration) * 100);
        }
    }, [currentTime, duration]);
    return (
        <>
            <div className="bg-white shadow-xl rounded-xl w-full max-w-[100%] mt-0 mb-[-2px] ml-[-4px] mr-[-4px] border-l-[2px] border-r-[2px] border-gray-300 pt-2 px-2">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 space-y-3">
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            preload="auto"
                            onLoadedMetadata={(e) => setDuration(e.target.duration)}
                            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                            className="mb-2" // Thêm khoảng cách dưới audio
                        />
                        <div className="flex items-center border p-1 rounded-full justify-between mb-2"> {/* Thêm margin-bottom cho khoảng cách giữa các phần */}
                            <div className="flex items-center gap-3 mr-2">
                                <button
                                    onClick={isPlaying ? handlePause : handlePlay}
                                    className="w-10 h-10 flex justify-center items-center border text-white rounded-full"
                                >
                                    {isPlaying ? "⏸" : "▶️"}
                                </button>
                            </div>

                            <div className="flex flex-1 items-center gap-1">
                                <span className="text-sm text-gray-600 w-10">{formatTime(currentTime)}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={handleSeek}
                                    className="flex-grow"
                                />
                                <span className="text-sm text-gray-600 w-10 text-right">{formatTime(duration)}</span>
                            </div>

                            {/* Volume control */}
                            <div className="mx-2 relative">
                                <button
                                    onClick={() => setShowVolumeSlider(prev => !prev)}
                                    className="px-3 py-2 bg-gray-300 rounded-full text-xl hover:bg-gray-400"
                                >
                                    {isMuted || volume === 0 ? "🔇" : "🔊"}
                                </button>
                                {showVolumeSlider && (
                                    <div className="absolute top-12 right-0 bg-white shadow-md rounded-md px-3 py-2 w-32">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={isMuted ? 0 : volume}
                                            onChange={handleVolumeChange}
                                            className="w-full"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* 3-dot menu for playback speed and Download */}
                            <div className="mx-2 relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="px-3 py-2 bg-gray-300 rounded-full text-xl hover:bg-gray-400"
                                >
                                    ⋮
                                </button>
                                {showMenu && (
                                    <div className="absolute top-12 right-0 bg-white shadow-md rounded-md w-32 p-2 space-y-2">
                                        {[1.0, 1.25, 1.5, 2.0].map(rate => (
                                            <button
                                                key={rate}
                                                onClick={() => handleChangeSpeed(rate)}
                                                className={`w-full text-left px-2 py-1 ${playbackRate === rate ? "bg-blue-500 text-white" : "text-gray-700"}`}
                                            >
                                                {rate}x
                                            </button>
                                        ))}
                                        {/* New Download button */}
                                        <button
                                            onClick={() => handleDownload(audioUrl)}
                                            className="w-full text-left px-2 py-1 text-gray-700 hover:bg-gray-200"
                                        >
                                            📥 Tải xuống
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <textarea
                            rows={4}
                            placeholder="Gõ lại đoạn bạn vừa nghe..."
                            className="w-full p-2 border border-gray-300 rounded mb-2"  // Thêm margin-bottom cho khoảng cách giữa textarea và các nút
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

                            <button
                                onClick={loadNextSentence}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                ⏭ Bỏ qua
                            </button>
                        </div>

                        {showAnswer && (
                            <div className="mt-4 p-3 border border-gray-300 bg-gray-50 rounded text-center font-medium">
                                {revealedAnswer}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 grid gap-4 w-full">
                        <TranslationBox translation={translation || { en: "No translation available" }} />
                        <div className="border p-3 rounded bg-white shadow mb-2">
                            <h2 className="text-lg font-semibold mb-2">🔊 Phát âm</h2>
                            <PronunciationBox
                                sentence={pronunciation.sentence}
                                wordPronunciations={pronunciation.words}
                                onWordClick={playWordPronunciation}
                            />
                            {/* Integrating Popup here */}
                            <Popup />
                        </div>

                        <div className="border p-3 rounded bg-white shadow">
                            <h2 className="text-lg font-semibold mb-2">💬 Bình luận</h2>
                            <CommentBox comments={comments.length > 0 ? comments : ["Không có bình luận."]} />
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="text-center mt-4 text-blue-600">Đang tải câu tiếp theo...</div>
                )}
            </div>

            {/* AudioPlayerPage nằm bên ngoài viền */}
        </>
    );



}
