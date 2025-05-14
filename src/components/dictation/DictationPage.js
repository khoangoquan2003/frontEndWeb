import { useState, useRef, useEffect } from "react";
import DictationPractice from "./DictationPractice";
import AudioPlayer from "./AudioPlayerPage"; // Import AudioPlayer

export default function DictationPage() {
    const [currentPage, setCurrentPage] = useState("dictation");
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [volume, setVolume] = useState(1); // Default volume set to 1 (100%)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isVolumeControlOpen, setIsVolumeControlOpen] = useState(false); // Toggle for volume control visibility

    const transcriptData = [
        { text: "Hello everyone, welcome to today's dictation practice.", start: 0, end: 4 },
        { text: "Please listen carefully and write down what you hear.", start: 4, end: 8 },
        { text: "Let's start with some simple sentences.", start: 8, end: 12 },
        { text: "Make sure to check your spelling and punctuation.", start: 12, end: 16 },
        { text: "Good luck and have fun!", start: 16, end: 20 },
    ];

    const handlePlayPauseStop = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        if (audioRef.current) {
            const value = Number(e.target.value);
            audioRef.current.currentTime = value;
            setCurrentTime(value);
        }
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/audio/sample.mp3";
        link.download = "dictation_audio.mp3";
        link.click();
    };

    const handlePlaybackRateChange = (rate) => {
        setPlaybackRate(rate);
        audioRef.current.playbackRate = rate;
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
        if (audioRef.current) {
            audioRef.current.volume = e.target.value;
        }
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
    }, []);

    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? "0" + sec : sec}`;
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-4 space-y-4">
            {/* Page Navigation */}
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

            <h1 className="text-2xl font-bold">🎧 Dictation Practice</h1>

            {/* Conditional Rendering */}
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

            {/* Full Transcript Page */}
            {currentPage === "transcript" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded bg-gray-100">
                    <div className="w-full flex flex-col space-y-3 relative">
                        <audio ref={audioRef} src="/audio/sample.mp3" />
                        <div className="flex items-center justify-between mb-2 space-x-3">
                            <div className="flex space-x-2">
                                <button
                                    onClick={handlePlayPauseStop}
                                    title={isPlaying ? "Pause" : "Play"}
                                    className="text-xl text-black hover:bg-gray-400 hover:scale-95 transition duration-200 ease-in-out"
                                >
                                    {isPlaying ? (
                                        // Pause: hai thanh đứng màu đen
                                        <div className="flex gap-[2px]">
                                            <div className="w-[3px] h-4 bg-black" />
                                            <div className="w-[3px] h-4 bg-black" />
                                        </div>
                                    ) : (
                                        // Play: tam giác màu đen
                                        <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-black" />
                                    )}
                                </button>
                            </div>


                            {/* Seek Bar + Volume + Settings */}
                            <div className="flex items-center justify-between w-full space-x-4 relative">

                                {/* Audio Seek Bar */}
                                <div className="flex-1 flex items-center space-x-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full accent-blue-600"
                                    />
                                </div>

                                {/* Time + Volume */}
                                <div className="relative flex items-center space-x-2">
                                    {/* Time Display */}
                                    <div className="text-sm text-gray-700">
                                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                                    </div>

                                    {/* Volume Button */}
                                    <button
                                        onClick={() => setIsVolumeControlOpen(prev => !prev)}
                                        className="text-sm ml-2"
                                        title="Adjust Volume"
                                    >
                                        <i className={`fas ${volume === 0 ? 'fa-volume-off' : 'fa-volume-up'}`} />
                                    </button>

                                    {/* Volume Dropdown */}
                                    {isVolumeControlOpen && (
                                        <div className="absolute top-full right-0 mt-2 bg-white p-2 rounded shadow z-50">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={volume}
                                                onChange={handleVolumeChange}
                                                className="w-24 accent-blue-600"
                                                title="Volume"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Settings Button + Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSettingsOpen(prev => !prev)}
                                        className="text-2xl p-3 transform rotate-90 hover:cursor-pointer hover:bg-gray-200 hover:scale-95 transition duration-200 ease-in-out"
                                        title="Settings"
                                    >
                                        &#8230;
                                    </button>

                                    {isSettingsOpen && (
                                        <div className="absolute top-full right-0 mt-2 bg-white p-3 border rounded shadow z-50 space-y-2">
                                            <button onClick={handleDownload} className="text-sm" title="Download">
                                                Download
                                            </button>
                                            <div className="flex space-x-1">
                                                <button onClick={() => handlePlaybackRateChange(1)} className="text-sm">1x</button>
                                                <button onClick={() => handlePlaybackRateChange(1.5)} className="text-sm">1.5x</button>
                                                <button onClick={() => handlePlaybackRateChange(2)} className="text-sm">2x</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>




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

            {/* AudioPlayer Component at the bottom */}
            <AudioPlayer /> {/* Call the AudioPlayer at the bottom */}
        </div>
    );
}
