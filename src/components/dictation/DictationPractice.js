import { useRef, useState, useEffect } from "react";

export default function DictationPractice() {
    const audioRef = useRef(null);
    const [revealedAnswer, setRevealedAnswer] = useState("");
    const [volume, setVolume] = useState(1.0); // mặc định 100%
    const [isMuted, setIsMuted] = useState(false);

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

    const handleVolumeChange = (e) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        setIsMuted(vol === 0);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isMuted) {
            audio.volume = volume;
            setIsMuted(false);
        } else {
            audio.volume = 0;
            setIsMuted(true);
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
        let revealedWords = [];
        let skipNext = false;

        for (let i = 0; i < words.length; i++) {
            if (userWords[i] === words[i]) {
                correctCount++;
                revealedWords.push(words[i]);
                // cho phép hiện từ tiếp theo
                if (i + 1 < words.length) {
                    revealedWords.push(words[i + 1]);
                    i++; // bỏ qua từ tiếp theo vì đã xử lý
                }
            } else if (skipNext) {
                // đã xử lý trong lần đúng trước đó
                skipNext = false;
                continue;
            } else {
                revealedWords.push("*".repeat(words[i].length));
            }
        }

        const percent = ((correctCount / words.length) * 100).toFixed(2);
        setScore(percent);
        setRevealedAnswer(revealedWords.join(" "));
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

    const handleSkip = () => {
        setShowAnswer(true);
        setScore(null); // Không hiển thị điểm khi bỏ qua
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 space-y-4">
            <h1 className="text-2xl font-bold">🎧 Dictation Practice</h1>

            {/* Âm thanh */}
            <audio ref={audioRef} src="/src/assets/audio/dictation1.mp3" preload="auto" />

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

            </div>

            {/* Chọn tốc độ phát & âm lượng */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
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

                {/* Biểu tượng âm lượng bấm để mute/unmute */}
                <button onClick={toggleMute} className="text-xl ml-2">
                    {isMuted || volume === 0 ? "🔇" : "🔊"}
                </button>

                {/* Thanh chỉnh âm lượng ngắn */}
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
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    ✔️ Kiểm tra
                </button>
                <button
                    onClick={handleSkip}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                    ⏭️ Bỏ qua
                </button>
            </div>

                {showAnswer && (
                    <div className="bg-gray-100 p-3 rounded">
                        <p><strong>Gợi ý đúng:</strong> {revealedAnswer}</p>
                        {score !== null ? (
                            <p><strong>Điểm số:</strong> {score}%</p>
                        ) : (
                            <p className="text-gray-600 italic">Bạn đã bỏ qua câu này.</p>
                        )}
                    </div>
                )}



                </div>
    );
}
