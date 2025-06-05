import { useState, useRef, useEffect } from "react";
import DictationPractice from "./DictationPractice";
import AudioPlayer from "./AudioPlayerPage";
import { useSearchParams } from "react-router-dom";
import { http } from "../../api/Http";

export default function DictationPage() {
    const [currentPage, setCurrentPage] = useState("dictation");
    const audioRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [transcriptData, setTranscriptData] = useState([]);

    const [searchParams] = useSearchParams();
    const courseId = parseInt(searchParams.get("courseId"));
    const courseName = searchParams.get("courseName") || "";

    // State quản lý yêu thích
    const [isFavorite, setIsFavorite] = useState(false);

    // Kiểm tra trạng thái yêu thích khi courseId hoặc userId thay đổi
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            const userId = parseInt(localStorage.getItem("userId")); // ✅ convert string to number
            if (!userId || !courseId) return;

            try {
                const response = await http.get("/api/check-favorite", {
                    params: {courseId, userId },
                });
                setIsFavorite(response.data.isFavorite);
            } catch (error) {
                console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
            }
        };

        checkFavoriteStatus();
    }, [courseId]);

    // Lấy transcript khi component mount hoặc courseId thay đổi
    useEffect(() => {
        if (!courseId) return;

        const fetchTranscript = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/get-transcript?courseId=${courseId}`
                );
                const transcriptText = await response.text();
                const lines = transcriptText
                    .split("\n")
                    .map((line) => ({ text: line.trim() }));
                setTranscriptData(lines);
            } catch (error) {
                console.error("Error fetching transcript:", error);
                setTranscriptData([]);
            }
        };

        fetchTranscript();
    }, [courseId]);

    // Phát / tạm dừng audio, lấy URL audio nếu chưa có
    const handlePlayPause = async () => {
        if (!isPlaying) {
            try {
                if (!audioUrl) {
                    const response = await fetch(
                        `http://localhost:8080/api/get-main-audio?courseId=${courseId}`
                    );
                    const audioLink = await response.text();
                    setAudioUrl(audioLink);

                    // Delay chút để audioRef cập nhật src mới rồi play
                    setTimeout(() => {
                        audioRef.current?.play();
                        setIsPlaying(true);
                    }, 100);
                } else {
                    audioRef.current?.play();
                    setIsPlaying(true);
                }
            } catch (error) {
                console.error("Error fetching audio URL:", error);
            }
        } else {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
    };

    // Cập nhật thời gian phát khi kéo thanh seek
    const handleSeek = (e) => {
        const value = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
        }
    };

    // Tải audio về máy
    const handleDownload = () => {
        if (!audioUrl) return;
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = "dictation_audio.mp3";
        link.click();
    };

    // Thay đổi tốc độ phát
    const handlePlaybackRateChange = (rate) => {
        setPlaybackRate(rate);
        if (audioRef.current) audioRef.current.playbackRate = rate;
    };

    // Thay đổi âm lượng
    const handleVolumeChange = (e) => {
        const value = Number(e.target.value);
        setVolume(value);
        if (audioRef.current) audioRef.current.volume = value;
    };

    // Cập nhật currentTime, duration, activeIndex khi audio phát
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);

            // Nếu transcript có trường start/end, có thể dùng logic này để highlight chính xác
            // hiện tại bạn chưa có nên activeIndex tạm để -1
            const currentIndex = transcriptData.findIndex(
                (line) => audio.currentTime >= (line.start || 0) && audio.currentTime < (line.end || Infinity)
            );
            setActiveIndex(currentIndex);
        };

        const onLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoadedMetadata);

        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
        };
    }, [audioUrl, transcriptData]);

    // Định dạng thời gian kiểu MM:SS
    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? "0" + sec : sec}`;
    };

    // Xử lý toggle favorite (thêm hoặc xóa)
    const handleToggleFavorite = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Vui lòng đăng nhập để sử dụng chức năng này.");
            return;
        }

        try {
            if (isFavorite) {
                // Gọi API xóa favorite
                await http.delete("/api/delete-favorite-course", {
                    params: { userId, courseId },
                });
                setIsFavorite(false);
                alert("Đã bỏ yêu thích khóa học.");
            } else {
                // Gọi API thêm favorite
                await http.post("/api/create-favorite-course", { userId, courseId });
                setIsFavorite(true);
                alert("Đã thêm vào mục yêu thích!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật yêu thích:", error);
            alert("Đã xảy ra lỗi khi cập nhật mục yêu thích.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-4 space-y-4">
            {/* Toggle giữa Practice và Transcript */}
            <div className="flex justify-center mb-6 space-x-4">
                <button
                    onClick={() => setCurrentPage("dictation")}
                    className={`px-4 py-2 rounded ${
                        currentPage === "dictation"
                            ? "bg-black text-white"
                            : "bg-white text-black border border-black"
                    } hover:bg-gray-300`}
                >
                    Practice
                </button>
                <button
                    onClick={() => setCurrentPage("transcript")}
                    className={`px-4 py-2 rounded ${
                        currentPage === "transcript"
                            ? "bg-black text-white"
                            : "bg-white text-black border border-black"
                    } hover:bg-gray-300`}
                >
                    Full transcript
                </button>
            </div>

            {/* Tiêu đề và menu yêu thích */}
            <div className="flex items-center relative">
                <h1 className="text-2xl font-bold flex items-center">🎧 {courseName}</h1>
                <div className="relative ml-2">
                    <button
                        onClick={() => setIsSettingsOpen((prev) => !prev)}
                        className="text-lg p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm transition"
                        title="More options"
                    >
                        ⋯
                    </button>


                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 flex flex-col text-sm">
                            <button
                                onClick={() => {
                                    handleToggleFavorite();
                                    setIsSettingsOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 text-left"
                            >
                                {isFavorite ? "Remove from Favourite" : "Add to Favourite"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Nội dung Practice hoặc Transcript */}
            {currentPage === "dictation" && (
                <div className="flex flex-col items-start space-y-4">
                    <DictationPractice
                        courseName={courseName}
                        audioRef={audioRef}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        handlePlayPauseStop={handlePlayPause}
                        volume={volume}
                        setVolume={setVolume}
                        playbackRate={playbackRate}
                        setPlaybackRate={setPlaybackRate}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}

            {currentPage === "transcript" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded bg-gray-100">
                    <div className="w-full flex flex-col space-y-3">
                        {/* Audio element */}
                        <audio ref={audioRef} src={audioUrl} />

                        <div className="flex items-center justify-between mb-2 space-x-3">
                            {/* Play/Pause Button */}
                            <button
                                onClick={handlePlayPause}
                                title={isPlaying ? "Pause" : "Play"}
                                className="text-xl p-3 hover:bg-blue text-black"
                            >
                                {isPlaying ? "❚❚" : "▶"}
                            </button>

                            {/* Progress bar */}
                            <div className="flex-1 flex items-center space-x-2">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="flex-1 accent-blue-600 w-2/3"
                                />
                            </div>

                            {/* Time */}
                            <div className="text-sm text-gray-700">
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                            </div>

                            {/* Volume Control */}
                            <button
                                onClick={() => {
                                    if (audioRef.current) {
                                        audioRef.current.muted = !audioRef.current.muted;
                                        // Cập nhật volume để trigger re-render
                                        setVolume(audioRef.current.muted ? 0 : audioRef.current.volume);
                                    }
                                }}
                                className="text-sm"
                                title="Mute/Unmute"
                            >
                                {audioRef.current?.muted ? "🔇" : "🔊"}
                            </button>

                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-20 accent-blue-600"
                            />

                            {/* Settings Button */}
                            <button
                                onClick={() => setIsSettingsOpen((prev) => !prev)}
                                className="text-2xl p-3 transform rotate-90"
                                title="Settings"
                            >
                                &#8230;
                            </button>

                            {/* Settings Panel */}
                            {isSettingsOpen && (
                                <div
                                    className="settings-panel flex flex-col items-start bg-white p-3 border rounded mt-2 space-y-2"
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        zIndex: 10,
                                    }}
                                >
                                    <button onClick={handleDownload} className="text-sm" title="Download">
                                        Download
                                    </button>
                                    <div className="flex space-x-2">
                                        {[1, 1.5, 2].map((rate) => (
                                            <button
                                                key={rate}
                                                onClick={() => handlePlaybackRateChange(rate)}
                                                className={`text-sm ${playbackRate === rate ? "font-bold" : ""}`}
                                            >
                                                {rate}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Transcript */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">📝 Transcript</h2>
                        <div className="h-64 overflow-y-auto bg-white p-3 border rounded space-y-2">
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {transcriptData.map((line, idx) => (
                                    <li
                                        key={idx}
                                        className={`transition-all duration-200 ${
                                            idx === activeIndex ? "bg-yellow-100 font-semibold rounded px-2 py-1" : ""
                                        }`}
                                    >
                                        {line.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <AudioPlayer />
        </div>
    );
}
