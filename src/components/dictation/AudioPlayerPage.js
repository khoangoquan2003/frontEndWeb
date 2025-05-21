import React, { useState, useRef, useEffect } from 'react';

const AudioPlayerPage = () => {
    const audioRef = useRef(null);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [audioUrl, setAudioUrl] = useState('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    const [showMenu, setShowMenu] = useState(false);
    const [showNextCourse, setShowNextCourse] = useState(false);

    const menuRef = useRef(null);
    const nextCourseRef = useRef(null);

    const transcriptText = "This is a sample transcript of the audio. It can contain the text that corresponds to the audio being played.";

    const handlePlaybackRateChange = (event) => {
        const rate = parseFloat(event.target.value);
        setPlaybackRate(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = 'audio-file.mp3';
        a.click();
    };

    const handleToggleMenu = () => {
        setShowMenu(prev => !prev);
        if (showNextCourse) setShowNextCourse(false); // Đóng dropdown "Quick Link to Next Course"
    };

    const handleToggleNextCourse = () => {
        setShowNextCourse(prev => !prev);
        if (showMenu) setShowMenu(false); // Đóng dropdown "Audio Controls"
    };

    const handleClickOutside = (event) => {
        if (
            (menuRef.current && !menuRef.current.contains(event.target)) &&
            (nextCourseRef.current && !nextCourseRef.current.contains(event.target))
        ) {
            setShowMenu(false);
            setShowNextCourse(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="audio-player-page border border-gray-300 rounded-lg p-3 max-w-lg mx-auto mt-4 ml-0 hover:bg-gray-100 cursor-pointer transition-colors">
            {/* Audio Controls Dropdown */}
            <div ref={menuRef} className="mb-4">
                <div className="header flex justify-between items-center mb-2" onClick={handleToggleMenu}>
                    <h1 className="text-sm font-semibold">Audio Player with Speed Control</h1>
                    <div className="menu-icon cursor-pointer text-xs">
                        {showMenu ? '▲' : '▼'}
                    </div>
                </div>

                {showMenu && (
                    <div className="audio-controls">
                        <audio ref={audioRef} src={audioUrl} controls className="w-[250px] mb-4 ml-0" />
                        <div className="transcript bg-gray-100 p-3 rounded-md ml-0">
                            <p className="text-md text-gray-700">{transcriptText}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Link to Next Course Dropdown */}
            <div ref={nextCourseRef} className="quicklink-dropdown mt-4 border-t border-gray-300 pt-4">
                <div className="flex justify-between items-center cursor-pointer text-sm font-semibold" onClick={handleToggleNextCourse}>
                    <span>Quick Link to Next Course</span>
                    {showNextCourse ? '▲' : '▼'}
                </div>

                {showNextCourse && (
                    <div className="menu bg-white shadow-md rounded-md p-2 mt-2 w-48">
                        <a
                            href="#next-course"
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
