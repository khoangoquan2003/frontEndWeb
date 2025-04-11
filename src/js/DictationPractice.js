import { useRef, useState, useEffect } from "react";

export default function DictationPractice() {
    const audioRef = useRef(null);
    const [input, setInput] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(null);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1.0);

    const correctText = "The quick brown fox jumps over the lazy dog.";

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
            audioRef.current.play();
        }
    };

    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const handleCheck = () => {
        const userInput = input.trim().toLowerCase();
        const correct = correctText.trim().toLowerCase();
        const words = correct.split(" ");
        const userWords = userInput.split(" ");

        let correctCount = 0;
        words.forEach((word, index) => {
            if (word === userWords[index]) correctCount++;
        });

        const percent = ((correctCount / words.length) * 100).toFixed(2);
        setScore(percent);
        setShowAnswer(true);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
            const percent = (audio.currentTime / audio.duration) * 100;
            setProgress(percent || 0);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", () => {
            setDuration(audio.duration);
        });

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
        };
    }, []);

    const handleSeek = (e) => {
        const newProgress = parseFloat(e.target.value);
        const audio = audioRef.current;
        if (audio && audio.duration) {
            audio.currentTime = (newProgress / 100) * audio.duration;
        }
        setProgress(newProgress);
    };

    const handleChangeSpeed = (rate) => {
        setPlaybackRate(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 space-y-4">
            <h1 className="text-2xl font-bold">🎧 Dictation Practice</h1>

            {/* Âm thanh */}
            <audio ref={audioRef} src="/audio/dictation1.mp3" preload="auto" />

            {/* Thanh tua tiến trình */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">
                    {formatTime(currentTime)}
                </span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="flex-grow"
                />
                <span className="text-sm text-gray-600 w-12 text-right">
                    {formatTime(duration)}
                </span>
            </div>

            <div className="space-x-2">
                <button
                    onClick={handlePlay}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    ▶️ Nghe
                </button>
                <button
                    onClick={handlePause}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    ⏸ Dừng
                </button>
                <button
                    onClick={handleCheck}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    ✔️ Kiểm tra
                </button>
            </div>

            {/* Chọn tốc độ phát */}
            <div className="space-x-2 mt-2">
                {[1.0, 1.25, 1.5, 1.75, 2.0].map((rate) => (
                    <button
                        key={rate}
                        onClick={() => handleChangeSpeed(rate)}
                        className={`px-3 py-1 rounded border ${
                            playbackRate === rate
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-800"
                        }`}
                    >
                        {rate}x
                    </button>
                ))}
            </div>

            <textarea
                rows={4}
                placeholder="Gõ lại đoạn bạn vừa nghe..."
                className="w-full p-2 border border-gray-300 rounded"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            {showAnswer && (
                <div className="bg-gray-100 p-3 rounded">
                    <p><strong>Đáp án đúng:</strong> {correctText}</p>
                    <p><strong>Điểm số:</strong> {score}%</p>
                </div>
            )}
        </div>
    );
}
