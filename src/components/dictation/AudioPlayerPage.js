import React, { useState, useRef, useEffect } from 'react';
import { http } from "../../api/Http";
import { useSearchParams, useNavigate } from 'react-router-dom';

const AudioPlayerPage = () => {
    const audioRef = useRef(null);
    const menuRef = useRef(null);
    const nextCourseRef = useRef(null);

    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');

    const [playbackRate, setPlaybackRate] = useState(1);
    const [audioUrl, setAudioUrl] = useState('');
    const [transcriptText, setTranscriptText] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [showNextCourse, setShowNextCourse] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [audioRes, transcriptRes] = await Promise.all([
                    http.get('/api/get-main-audio', { params: { courseId } }),
                    http.get('/api/get-transcript', { params: { courseId } }),
                ]);


                setAudioUrl(audioRes.data);
                setTranscriptText(transcriptRes.data);
            } catch (error) {
                console.error("Error loading audio or transcript", error);
            }
        };

        if (courseId) fetchData();
    }, [courseId]);

    const handlePlaybackRateChange = (e) => {
        const rate = parseFloat(e.target.value);
        setPlaybackRate(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = 'audio.mp3';
        a.click();
    };

    const handleToggleMenu = () => {
        setShowMenu(prev => !prev);
        setShowNextCourse(false);
    };

    const handleToggleNextCourse = () => {
        setShowNextCourse(prev => !prev);
        setShowMenu(false);
    };

    const handleGoToNextCourse = async () => {
        const nextCourseId = Number(courseId) + 1;
        try {
            const res = await http.get('/api/get-course', {
                params: { courseId: nextCourseId }
            });

            if (res.data?.result) {
                navigate(`/dictation?courseId=${nextCourseId}`);
            } else {
                alert("Next course not found!");
            }
        } catch (error) {
            console.error("Error fetching next course", error);
            alert("Next course not found!");
        }
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
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="audio-player-page border border-gray-300 rounded-lg p-3 max-w-lg mx-auto mt-4 ml-0 hover:bg-gray-100 cursor-pointer transition-colors">
            {/* Audio Controls Dropdown */}
            <div ref={menuRef} className="mb-4">
                <div
                    className="header flex justify-between items-center mb-2"
                    onClick={handleToggleMenu}
                >
                    <h1 className="text-sm font-semibold">Audio Player with Speed Control</h1>
                    <div className="menu-icon cursor-pointer text-xs">{showMenu ? '▲' : '▼'}</div>
                </div>

                {showMenu && (
                    <div className="audio-controls">
                        {audioUrl ? (
                            <>
                                <audio
                                    ref={audioRef}
                                    src={audioUrl}
                                    controls
                                    className="w-[250px] mb-2 ml-0"
                                    playbackRate={playbackRate}
                                />

                            </>
                        ) : (
                            <p>Loading audio...</p>
                        )}

                        <div className="transcript bg-gray-100 p-3 rounded-md ml-0 text-sm text-gray-800">
                            <p>{transcriptText || 'Loading transcript...'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Link to Next Course Dropdown */}
            <div ref={nextCourseRef} className="quicklink-dropdown mt-4 border-t border-gray-300 pt-4">
                <div
                    className="flex justify-between items-center cursor-pointer text-sm font-semibold"
                    onClick={handleToggleNextCourse}
                >
                    <span>Quick Link to Next Course</span>
                    {showNextCourse ? '▲' : '▼'}
                </div>

                {showNextCourse && (
                    <div className="menu bg-white shadow-md rounded-md p-2 mt-2 w-48">
                        <button
                            onClick={handleGoToNextCourse}
                            className="block w-full text-left py-1 px-3 text-gray-700 hover:bg-gray-100 text-sm"
                        >
                            Go to Next Course
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioPlayerPage;
