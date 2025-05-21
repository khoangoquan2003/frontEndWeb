import { useState, useRef, useEffect } from "react";
import DictationPractice from "./DictationPractice";
import AudioPlayer from "./AudioPlayerPage";

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

    const transcriptData = [
        { text: "Hello everyone, welcome to today's dictation practice.", start: 0, end: 4 },
        { text: "Please listen carefully and write down what you hear.", start: 4, end: 8 },
        { text: "Let's start with some simple sentences.", start: 8, end: 12 },
        { text: "Make sure to check your spelling and punctuation.", start: 12, end: 16 },
        { text: "Good luck and have fun!", start: 16, end: 20 },
    ];

    // Handle Play, Pause, and Stop actions
    const handlePlayPauseStop = async () => {
        if (!isPlaying) {
            try {
                const response = await fetch("http://localhost:8080/api/get-main-audio?courseId=1");
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

    // Update current time and active transcript index
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
    }, [audioUrl]);

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
                    className={`px-4 py-2 rounded ${currentPage === "dictation" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                >
                    Practice
                </button>
                <button
                    onClick={() => setCurrentPage("transcript")}
                    className={`px-4 py-2 rounded ${currentPage === "transcript" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                >
                    Full transcript
                </button>
            </div>

            <h1 className="text-2xl font-bold">🎧 Dictation Practice</h1>

            {currentPage === "dictation" && (
                <div className="flex flex-col items-start space-y-4">
                    <DictationPractice
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
                        <audio ref={audioRef} src={audioUrl}/>
                        <div className="flex items-center justify-between mb-2 space-x-3">
                            <div className="flex space-x-2">
                                <button onClick={handlePlayPauseStop} title={isPlaying ? "Pause" : "Play"}
                                        className="text-xl">
                                    {isPlaying ? "❚❚" : "▶"}
                                </button>
                            </div>
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
                            <button
                                onClick={() => setIsSettingsOpen(prev => !prev)}
                                className="text-2xl p-3 transform rotate-90"
                                title="Settings"
                            >
                                &#8230;
                            </button>
                        </div>
                        <div className="flex justify-between text-sm text-gray-700 mt-1">
                            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                        </div>

                        {isSettingsOpen && (
                            <div
                                className="flex flex-col items-start absolute bg-white p-3 border rounded mt-1 space-y-2">
                                <button onClick={handleDownload} className="text-sm" title="Download">
                                    Download
                                </button>
                                <div className="flex space-x-2">
                                    <button onClick={() => handlePlaybackRateChange(1)} className="text-sm">1x</button>
                                    <button onClick={() => handlePlaybackRateChange(1.5)} className="text-sm">1.5x
                                    </button>
                                    <button onClick={() => handlePlaybackRateChange(2)} className="text-sm">2x</button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => audioRef.current.muted = !audioRef.current.muted}
                                            className="text-sm">🔊
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
                                </div>
                            </div>
                        )}
                    </div>

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
