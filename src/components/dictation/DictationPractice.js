import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { http } from "../../api/Http";
import TranslationBox from './TranslationBox';
import PronunciationBox from './PronunciationBox';
import CommentBox from './CommentBox';
import Popup from "../Popup/Popup";

export default function DictationPractice() {
    const [canProceed, setCanProceed] = useState(false);
    const [showExtras, setShowExtras] = useState(false);
    const userId = parseInt(localStorage.getItem("userId"));
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
        words: [],
    });
    const [comments, setComments] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSkipped, setIsSkipped] = useState(false);  // Trạng thái "bỏ qua"

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const loadCourseData = async () => {
        setLoading(true);
        try {
            // Gửi yêu cầu API để lấy khóa học
            const res = await http.get("/api/get-course", {
                params: { courseId },
            });

            // Trích xuất dữ liệu từ kết quả trả về
            const { sentences, sentenceAudios, comments, transcript } = res.data.result;

            // In ra console để kiểm tra dữ liệu
            console.log("Dữ liệu trả về từ API:");
            console.log("Sentences:", sentences);
            console.log("Sentence Audios:", sentenceAudios);
            console.log("Comments:", comments);
            console.log("Transcript:", transcript);

            // Kiểm tra dữ liệu cơ bản
            if (!sentences || !sentenceAudios || sentenceAudios.length === 0) {
                console.error("Dữ liệu không đầy đủ: thiếu câu hoặc audio.");
                return;
            }

            // Cập nhật lại danh sách câu và audio
            setSentences(
                sentences.map((text, i) => ({
                    correctAnswer: text,
                    audioUrl: sentenceAudios[i] || "",
                }))
            );

            // Cập nhật thông tin câu đầu tiên
            const firstSentence = sentences[0];
            setCorrectAnswer(firstSentence);
            setAudioUrl(sentenceAudios[0]);

            // Cập nhật phát âm cho câu đầu tiên (nếu có)
            setPronunciation({
                sentence: firstSentence,
                words: [], // Bạn có thể cập nhật phần phát âm của từ nếu có
            });

            // Cập nhật bình luận
            setComments(comments || []);

            // Cập nhật bản dịch (nếu có)
            setTranslation({ en: firstSentence, vi: "Chưa có bản dịch" });

            // Reset các trường input, câu trả lời
            setInput("");
            setShowAnswer(false);

            // Tạo mảng câu và audio cho các câu sau
            setSentences(sentences.map((sentence, index) => ({
                sentence,
                audioUrl: sentenceAudios[index],
            })));

        } catch (err) {
            // In lỗi ra console nếu có
            console.error("Lỗi khi tải khóa học:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (audioUrl) => {
        if (!audioUrl) {
            console.error("Không có URL âm thanh để tải về.");
            return;
        }
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = audioUrl.split("/").pop();
        link.click();
    };

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => console.error("Error playing audio:", error));
            setIsPlaying(true);
        }
    };

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
            const rawInput = input ? input.trim() : "";
            if (!rawInput) {
                setRevealedAnswer("⚠️ Vui lòng nhập câu trả lời.");
                setShowAnswer(true);
                return;
            }

            if (!courseId) {
                console.error("⚠️ courseId không hợp lệ.");
                setRevealedAnswer("❌ Không thể xác định khóa học.");
                setShowAnswer(true);
                return;
            }

            const normalize = (str) => str ? str.trim().toLowerCase() : "";
            if (!correctAnswer) {
                throw new Error("Đáp án đúng không có giá trị.");
            }

            const isCorrect = normalize(rawInput) === normalize(correctAnswer);
            if (isCorrect) {
                setRevealedAnswer(`✅ Chính xác! Đáp án là: "${correctAnswer}"`);
                setCanProceed(true);
                setShowExtras(true); // Hiển thị thông tin extra khi đúng
            } else {
                const correctWords = correctAnswer.split(" ");
                const inputWords = rawInput.split(" ");
                const result = correctWords.map((word, index) => {
                    return normalize(inputWords[index]) === normalize(word)
                        ? word
                        : "*".repeat(word.length);
                }).join(" ");

                setRevealedAnswer(`❌ Không đúng.\n${result}`);
                setCanProceed(false);
            }

            setShowAnswer(true);
        } catch (error) {
            console.error("❌ Lỗi khi kiểm tra câu:", error);
        } finally {
            setLoadingAnswer(false);
        }
    };

// Sau khi tải dữ liệu câu mới, bạn sẽ cập nhật state của dịch cho câu tiếp theo
    const loadNextSentence = async () => {
        if (isSkipped) {
            setIsSkipped(false);  // Reset trạng thái bỏ qua khi tải câu mới
        }

        if (currentSentenceIndex < sentences.length - 1) {
            const nextIndex = currentSentenceIndex + 1;
            setCurrentSentenceIndex(nextIndex); // Chuyển đến câu tiếp theo
            setInput(""); // Reset input
            setShowAnswer(false); // Ẩn câu trả lời
            setShowExtras(false); // Ẩn phần phụ (translate, pronunciation, comment) khi chuyển sang câu mới

            try {
                // Gửi yêu cầu API để lấy câu tiếp theo
                const res = await http.get("/api/get-course", {
                    params: { courseId, sentenceIndex: nextIndex },
                });

                if (res.data && res.data.result) {
                    const { sentences, sentenceAudios, translations } = res.data.result;

                    if (sentences && sentences.length > 0) {
                        const sentenceText = sentences[nextIndex] || 'Không có câu trả về từ API';
                        setCorrectAnswer(sentenceText);  // Cập nhật câu đúng
                    } else {
                        console.log("Không có câu trả về từ API.");
                        return;  // Thoát ra nếu không có câu
                    }

                    const audioUrl = sentenceAudios?.[nextIndex];
                    if (audioUrl && audioUrl.endsWith('.mp3')) {
                        setAudioUrl(audioUrl);  // Cập nhật URL âm thanh nếu hợp lệ
                    } else {
                        console.error("Không phải tệp âm thanh:", audioUrl);
                        setAudioUrl("");  // Đặt lại URL nếu không hợp lệ
                    }

                    setPronunciation({
                        sentence: sentences[nextIndex] || 'Không có câu phát âm',
                        words: [],  // Giả sử không có từ phát âm
                    });

                    // Cập nhật phần dịch cho câu tiếp theo
                    const translation = translations?.[nextIndex];

                    // Nếu không có bản dịch, chỉ dùng câu tiếp theo
                    const updatedTranslation = translation || {
                        en: sentences[nextIndex],
                        vi: sentences[nextIndex]
                    };

                    setTranslation(updatedTranslation);  // Truyền vào dữ liệu dịch

                    console.log("Updated translation:", updatedTranslation);  // Log lại dịch để kiểm tra

                    // Cập nhật lại âm thanh
                    if (audioRef.current && audioUrl) {
                        audioRef.current.src = audioUrl;
                        audioRef.current.load();
                    }
                } else {
                    console.log("Không có dữ liệu câu trong API.");
                }
            } catch (error) {
                console.error("Lỗi khi tải câu tiếp theo:", error);
            }
        } else {
            console.log("Đã hoàn thành khóa học này.");
        }
    };

    const playWordPronunciation = (wordAudioUrl) => {
        const audio = new Audio(wordAudioUrl);
        audio.play().catch((error) => console.error("Error playing word pronunciation:", error));
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
        <div className="bg-white shadow-xl rounded-xl w-full max-w-[100%] mt-0 mb-[-2px] ml-[-4px] mr-[-4px] border-l-[2px] border-r-[2px] border-gray-300 pt-2 px-2">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 space-y-3">
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        preload="auto"
                        onLoadedMetadata={(e) => setDuration(e.target.duration)}
                        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                        className="mb-2"
                    />
                    {/* Controls */}
                    <div className="flex items-center border p-1 rounded-full justify-between mb-2">
                        <div className="flex items-center gap-3 mr-2">
                            <button
                                onClick={isPlaying ? handlePause : handlePlay}
                                className="w-8 h-8 flex justify-center items-center rounded-sm bg-white hover:bg-gray-100 transition-colors duration-150"
                            >
                                {isPlaying ? (
                                    // Pause
                                    <div className="flex gap-[2px]">
                                        <div className="w-[3px] h-4 bg-black" />
                                        <div className="w-[3px] h-4 bg-black" />
                                    </div>
                                ) : (
                                    // Play
                                    <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-black ml-[2px]" />
                                )}
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
                                onClick={() => setShowVolumeSlider((prev) => !prev)}
                                className="w-8 h-8 flex justify-center items-center text-black bg-white hover:bg-gray-100 rounded-sm transition-colors duration-150 text-lg"
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
                        {/* Menu for playback speed and download */}
                        <div className="mx-2 relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="px-3 py-2  text-xl hover:bg-gray-400"
                            >
                                ⋮
                            </button>
                            {showMenu && (
                                <div className="absolute top-12 right-0 bg-white border border-black rounded-sm w-32 p-2 space-y-2 shadow-none">
                                    {[1.0, 1.25, 1.5, 2.0].map((rate) => (
                                        <button
                                            key={rate}
                                            onClick={() => handleChangeSpeed(rate)}
                                            className={`w-full text-left px-2 py-1 text-sm rounded-sm transition-colors duration-150 ${playbackRate === rate ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"}`}
                                        >
                                            {rate}x
                                        </button>

                                    ))}
                                    <button
                                        onClick={() => handleDownload(audioUrl)}
                                        className="w-full text-left px-2 py-1 text-sm rounded-sm bg-white text-black hover:bg-black hover:text-white transition-colors duration-150"
                                    >
                                        📥 Tải xuống
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input and Check buttons */}
                    <textarea
                        rows={4}
                        placeholder="Gõ lại đoạn bạn vừa nghe..."
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="space-x-2 mt-2">
                        {/* Nếu câu đã được kiểm tra hoặc bỏ qua thì hiển thị nút "Câu tiếp theo" */}
                        {!canProceed ? (
                            <button
                                onClick={handleCheck}
                                className={`px-4 py-2 ${loadingAnswer ? "bg-gray-500 cursor-not-allowed" : "bg-green-600"} text-white rounded hover:bg-green-700`}
                                disabled={loadingAnswer}
                            >
                                {loadingAnswer ? "Đang kiểm tra..." : "Kiểm tra"}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    loadNextSentence();
                                    setCanProceed(false); // Cập nhật canProceed để hiển thị lại nút "Kiểm tra"
                                    setShowExtras(false); // Ẩn các phần phụ khi chuyển câu mới
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Câu tiếp theo
                            </button>


                        )}

                        {/* Nút bỏ qua */}
                        <button
                            onClick={() => {
                                setIsSkipped(true); // Đánh dấu là đã bỏ qua
                                setShowExtras(true); // Hiển thị thêm thông tin khi bỏ qua
                                setShowAnswer(true); // Hiển thị câu trả lời ngay lập tức khi bỏ qua

                                // Cập nhật đáp án đúng khi bỏ qua
                                setRevealedAnswer(`Đáp án đúng là: "${correctAnswer}"`);
                                setCanProceed(true); // Đặt canProceed thành true khi đã bỏ qua
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Bỏ qua
                        </button>
                    </div>

                    {showAnswer && (
                        <div className="mt-4 p-3 border border-gray-300 bg-gray-50 rounded text-center font-medium">
                            {revealedAnswer}
                        </div>
                    )}
                </div>

                <div
                    className="border rounded bg-white shadow p-4 flex flex-col gap-6 flex-1"
                    style={{ minHeight: 450, width: "100%" }}
                >
                    <div style={{ display: showExtras ? "block" : "none", flexGrow: 1, overflowY: "auto" }}>
                        <TranslationBox translation={translation} />

                        <div className="border p-3 rounded bg-white shadow mt-4">
                            <PronunciationBox
                                sentence={pronunciation.sentence}
                                wordPronunciations={pronunciation.words}
                                onWordClick={playWordPronunciation}
                            />
                        </div>
                        <div className="border p-3 rounded bg-white shadow mt-4">
                            <h2 className="text-lg font-semibold mb-2">💬 Bình luận</h2>
                            <CommentBox initialComments={comments} courseId={courseId} userId={userId} />
                        </div>
                    </div>
                </div>
            </div>

            {loading && <div className="text-center mt-4 text-blue-600">Đang tải câu tiếp theo...</div>}
        </div>
    );
}
