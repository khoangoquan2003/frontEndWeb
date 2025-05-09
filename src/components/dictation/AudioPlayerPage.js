import React, { useRef, useState } from 'react';

const AudioPlayerPage = () => {
    const audioRef = useRef(null);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [audioUrl, setAudioUrl] = useState('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    const [showMenu, setShowMenu] = useState(false);
    const [showNextCourse, setShowNextCourse] = useState(false); // New state for the next course dropdown

    // Sample transcript text
    const transcriptText = "This is a sample transcript of the audio. It can contain the text that corresponds to the audio being played.";

    // Define handlePlaybackRateChange to change playback speed
    const handlePlaybackRateChange = (event) => {
        const rate = parseFloat(event.target.value);
        setPlaybackRate(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    // Handle downloading the audio
    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = 'audio-file.mp3';
        a.click();
    };

    return (
        <div className="audio-player-page border border-gray-300 rounded-lg p-3 max-w-lg mx-auto mt-4 ml-0">
            <div className="header flex justify-between items-center mb-2">
                <h1 className="text-sm font-semibold">Audio Player with Speed Control</h1>
                <div className="menu-icon cursor-pointer text-xs" onClick={() => setShowMenu(!showMenu)}>
                    {showMenu ? '▲' : '▼'}
                </div>
            </div>

            {showMenu && (
                <div className="menu absolute top-16 right-0 bg-white shadow-md rounded-md p-2 w-48">
                    <button onClick={handleDownload} className="block w-full text-left py-1 px-3 text-gray-700 hover:bg-gray-100 text-xs">
                        Download Audio
                    </button>
                    <div className="playback-rate mt-2">
                        <label htmlFor="speed" className="block text-xs mb-1 text-gray-600">Playback Speed:</label>
                        <input
                            id="speed"
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={playbackRate}
                            onChange={handlePlaybackRateChange}
                            className="w-full"
                        />
                        <span className="text-xs text-gray-600">{playbackRate}x</span>
                    </div>
                </div>
            )}

            {showMenu && (
                <div className="audio-transcript mt-4">
                    <div className="audio-controls">
                        <audio ref={audioRef} src={audioUrl} controls className="w-[250px] mb-4 ml-0" />
                    </div>

                    <div className="transcript bg-gray-100 p-3 rounded-md ml-0">
                        <p className="text-md text-gray-700">{transcriptText}</p>
                    </div>
                </div>
            )}

            {/* Quick Link Dropdown to Next Course */}
            <div className="quicklink-dropdown mt-4 border-t border-gray-300 pt-4">
                <div className="flex justify-between items-center cursor-pointer text-sm font-semibold" onClick={() => setShowNextCourse(!showNextCourse)}>
                    <span>Quick Link to Next Course</span>
                    {showNextCourse ? '▲' : '▼'}
                </div>

                {showNextCourse && (
                    <div className="menu bg-white shadow-md rounded-md p-2 mt-2 w-48">
                        <a
                            href="#next-course" // Replace this with the actual next course URL
                            className="block w-full text-left py-1 px-3 text-gray-700 hover:bg-gray-100 text-sm"
                            title="Go to Next Course"
                        >
                            Go to Next Course
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioPlayerPage;
