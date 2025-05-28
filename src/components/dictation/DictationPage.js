import { useState, useRef, useEffect } from "react";
import DictationPractice from "./DictationPractice";
import AudioPlayer from "./AudioPlayerPage";
import {useSearchParams} from "react-router-dom";

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
    const [progress, setProgress] = useState(0);

    const [transcriptData, setTranscriptData] = useState([]);
    const [searchParams] = useSearchParams();
    const courseId = parseInt(searchParams.get("courseId"));
    const courseName = searchParams.get("courseName") || ''; // Directly get courseName from URL

    // Fetch transcript từ API khi component mount
    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/get-transcript?courseId=${courseId}`);
                const transcriptText = await response.text(); // Lấy dạng text thay vì json
                // Tách đoạn text thành mảng các câu theo dấu xuống dòng
                const data = transcriptText.split('\n').map((line, index) => ({
                    text: line.trim(),

                }));
                setTranscriptData(data);
            } catch (error) {
                console.error("Error fetching transcript:", error);
                setTranscriptData([]);
            }
        };

        fetchTranscript();
    }, []);

    // Handle Play, Pause, and Stop actions
    const handlePlayPauseStop = async () => {
        if (!isPlaying) {
            try {
                const response = await fetch(`http://localhost:8080/api/get-main-audio?courseId=${courseId}`);
                const data = await response.text(); // Nếu trả về chuỗi URL
                console.log("Fetched audio URL:", data);

                setAudioUrl(data);

                setTimeout(() => {
                    if (audioRef.current) {
                        audioRef.current.play();
                        setIsPlaying(true);
                    }
                }, 100);
            } catch (error) {
                console.error("Error fetching audio URL:", error);
            }
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    // Handle seeking within the audio
    const handleSeek = (e) => {
        const value = Number(e.target.value);
        audioRef.current.currentTime = value;
        setCurrentTime(value);
    };

    // Handle downloading the audio
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = "dictation_audio.mp3";
        link.click();
    };

    // Handle changing playback rate
    const handlePlaybackRateChange = (rate) => {
        setPlaybackRate(rate);
        if (audioRef.current) audioRef.current.playbackRate = rate;
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const value = Number(e.target.value);
        setVolume(value);
        if (audioRef.current) audioRef.current.volume = value;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const update = () => {
            setCurrentTime(audio.currentTime);

            const currentIndex = transcriptData.findIndex(
                (line) => audio.currentTime >= line.start && audio.currentTime < line.end
            );
            setActiveIndex(currentIndex);
        };

        const setDur = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", update);
        audio.addEventListener("loadedmetadata", setDur);

        return () => {
            audio.removeEventListener("timeupdate", update);
            audio.removeEventListener("loadedmetadata", setDur);
        };
    }, [audioUrl, transcriptData]);

    // Format time to MM:SS
    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? "0" + sec : sec}`;
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-4 space-y-4">
            <div className="flex justify-center mb-6 space-x-4">
                <button
                    onClick={() => setCurrentPage("dictation")}
                    className={`px-4 py-2 rounded ${currentPage === "dictation" ? "bg-black text-white" : "bg-white text-black border border-black"} hover:bg-gray-300`}
                >
                    Practice
                </button>
                <button
                    onClick={() => setCurrentPage("transcript")}
                    className={`px-4 py-2 rounded ${currentPage === "transcript" ? "bg-black text-white" : "bg-white text-black border border-black"} hover:bg-gray-300`}
                >
                    Full transcript
                </button>
            </div>

            <h1 className="text-2xl font-bold">🎧 {courseName}</h1>

            {currentPage === "dictation" && (
                <div className="flex flex-col items-start space-y-4">
                    <DictationPractice
                        courseName={courseName}
                        audioRef={audioRef}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        handlePlayPauseStop={handlePlayPauseStop}
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
                        <audio ref={audioRef} src={audioUrl} />
                        <div className="flex items-center justify-between mb-2 space-x-3">
                            {/* Play/Pause Button */}
                            <button
                                onClick={handlePlayPauseStop}
                                title={isPlaying ? "Pause" : "Play"}
                                className="text-xl p-3  hover:bg-blue text-black"
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
                                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                            </div>

                            {/* Volume Control */}
                            <button onClick={() => audioRef.current.muted = !audioRef.current.muted} className="text-sm">
                                {audioRef.current?.muted ? "🔇" : "🔊"}
                            </button>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 accent-blue-600"
                                />
                            </div>

                            {/* Settings Button */}
                            <button
                                onClick={() => setIsSettingsOpen(prev => !prev)}
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
                                        <button onClick={() => handlePlaybackRateChange(1)} className="text-sm">1x</button>
                                        <button onClick={() => handlePlaybackRateChange(1.5)} className="text-sm">1.5x</button>
                                        <button onClick={() => handlePlaybackRateChange(2)} className="text-sm">2x</button>
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
                                        className={`transition-all duration-200 ${idx === activeIndex ? "bg-yellow-100 font-semibold rounded px-2 py-1" : ""}`}
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
