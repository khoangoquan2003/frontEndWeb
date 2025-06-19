import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FaClock, FaRegStickyNote, FaStar, FaUserCircle, FaCog,
    FaBell, FaComment, FaHeart, FaPlus, FaTimes
} from 'react-icons/fa';
import { http } from "../../api/Http";
import { FaDollarSign } from 'react-icons/fa';

// Custom hooks
const useAuth = () => {
    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedNickname = localStorage.getItem("nickname");

        if (storedUserId) setUserId(parseInt(storedUserId));
        if (storedNickname) setNickname(storedNickname);

        const syncNickname = () => setNickname(localStorage.getItem("nickname"));
        window.addEventListener("storage", syncNickname);
        return () => window.removeEventListener("storage", syncNickname);
    }, []);

    return { userId, nickname, setUserId, setNickname };
};

const useTimer = () => {
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
        let startTime = localStorage.getItem("startTime");
        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem("startTime", startTime);
        }

        const updateMinutes = () => {
            const now = Date.now();
            const diff = now - parseInt(startTime, 10);
            const mins = Math.floor(diff / 60000);
            setMinutes(mins);
        };

        updateMinutes();
        const intervalId = setInterval(updateMinutes, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return minutes;
};

const useUserData = (userId) => {
    const [commentCount, setCommentCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [favoriteCount, setFavoriteCount] = useState(0);

    const fetchUserDataCounts = useCallback(async (userId) => {
        if (!userId) return;

        try {
            const [favRes, notifRes, commentRes] = await Promise.all([
                http.get("/api/show-all-favorite-course", { params: { userId } }),
                http.get(`/api/show-all-notification?userId=${userId}`),
                http.get(`/api/show-comment-user?userId=${userId}`),
            ]);

            if (favRes.data?.result) setFavoriteCount(favRes.data.result.length);
            if (notifRes.data?.result) setNotificationCount(notifRes.data.result.length);
            if (commentRes.data?.result) setCommentCount(commentRes.data.result.length);
        } catch (error) {
            console.error("Failed to fetch user data counts:", error);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserDataCounts(userId);
            const intervalId = setInterval(() => fetchUserDataCounts(userId), 30000); // Reduced frequency
            return () => clearInterval(intervalId);
        }
    }, [userId, fetchUserDataCounts]);

    return { commentCount, notificationCount, favoriteCount };
};

// Sub-components
const Logo = () => (
    <Link to="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <div className="text-blue-600 font-bold text-2xl bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
            D
        </div>
        <span className="font-semibold text-lg text-gray-800">DailyDictation</span>
    </Link>
);

const NavigationMenu = () => {
    const [isVideoDropdownOpen, setIsVideoDropdownOpen] = useState(false);

    return (
        <nav className="flex items-center space-x-6">
            <Link to="/topics" className="hover:text-blue-600 transition-colors font-medium">
                All exercises
            </Link>
            <Link to="/top-users" className="hover:text-blue-600 transition-colors font-medium">
                Top users
            </Link>

            <div className="relative">
                <button
                    className="hover:text-blue-600 cursor-pointer transition-colors font-medium flex items-center gap-1"
                    onClick={() => setIsVideoDropdownOpen(!isVideoDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsVideoDropdownOpen(false), 150)}
                >
                    Video lessons
                    <span className={`transform transition-transform ${isVideoDropdownOpen ? 'rotate-180' : ''}`}>
                        ▾
                    </span>
                </button>
                {isVideoDropdownOpen && (
                    <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg mt-2 w-40 z-20 border border-gray-200">
                        <Link
                            to="/videos/basic"
                            className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors first:rounded-t-lg"
                        >
                            Basic
                        </Link>
                        <Link
                            to="/videos/intermediate"
                            className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors last:rounded-b-lg"
                        >
                            Intermediate
                        </Link>
                    </div>
                )}
            </div>

            <Link to="/donate" className="text-pink-500 hover:text-pink-600 transition-colors font-medium">
                Donate 💖
            </Link>
        </nav>
    );
};

const ProgressDropdown = ({ courses, onCourseClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex items-center space-x-1">
            <FaStar className="text-yellow-500" />
            <button
                className="cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1"
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            >
                In-progress
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg mt-2 w-80 max-h-80 overflow-auto z-20 border border-gray-200">
                    <div className="p-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Your Progress</h3>
                    </div>
                    {courses.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">
                            <div className="text-2xl mb-2">📚</div>
                            <p>No courses in progress</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {courses.map((course, idx) => (
                                <div
                                    key={course.id || idx}
                                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                    onClick={() => {
                                        onCourseClick(course);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="font-medium text-sm text-blue-600 hover:underline mb-2">
                                        {course.name}
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {course.progress}% completed
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const UserDropdown = ({ nickname, counts, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { to: "/profile", icon: "👤", label: "Profile Info" },
        { to: "/notifications", icon: "🔔", label: `Notifications (${counts.notificationCount})` },
        { to: "/comments", icon: "💬", label: `Comments (${counts.commentCount})` },
        { to: "/favourites", icon: "⭐", label: `Favourites (${counts.favoriteCount})` },
    ];

    const accountItems = [
        { to: "/changePassword", icon: "🔑", label: "Change Password" },
        { to: "/changeMail", icon: "✉️", label: "Change Email" },
    ];

    return (
        <div className="relative flex items-center space-x-1">
            <FaUserCircle className="text-blue-600" />
            <button
                className="cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1"
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            >
                {nickname}
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 bg-white shadow-lg rounded-lg mt-2 w-56 z-[9999] border border-gray-200">
                    <div className="p-3 border-b border-gray-100">
                        <div className="font-semibold text-gray-800">Hello, {nickname}!</div>
                    </div>

                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.to}
                            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <div className="border-t border-gray-100">
                        {accountItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="border-t border-gray-100">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-3 hover:bg-red-50 text-red-600 transition-colors rounded-b-lg"
                        >
                            <span className="mr-3">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const NotesModal = ({ isOpen, onClose, notes, onSave, onEdit, onDelete }) => {
    const [noteContent, setNoteContent] = useState('');
    const [isAddNoteForm, setIsAddNoteForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleSave = async () => {
        await onSave(noteContent, editingIndex);
        setIsAddNoteForm(false);
        setNoteContent('');
        setEditingIndex(null);
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setNoteContent(notes[index].content);
        setIsAddNoteForm(true);
    };

    const handleCancel = () => {
        setIsAddNoteForm(false);
        setNoteContent('');
        setEditingIndex(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">My Notes</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            📝 Total Notes: {notes.length}
                        </p>
                    </div>
                    <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={onClose}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {!isAddNoteForm ? (
                        <div>
                            <div className="flex justify-end mb-4">
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={() => {
                                        setNoteContent('');
                                        setIsAddNoteForm(true);
                                        setEditingIndex(null);
                                    }}
                                >
                                    <FaPlus size={12} />
                                    Add Note
                                </button>
                            </div>

                            {notes.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">📝</div>
                                    <p className="text-gray-500">No notes yet.</p>
                                    <p className="text-gray-400 text-sm">Click "Add Note" to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {notes.map((note, index) => (
                                        <div key={note.noteId || index} className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-800 mb-3 break-words">{note.content}</p>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    onClick={() => handleEdit(index)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    onClick={() => onDelete(index)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">
                                {editingIndex !== null ? 'Edit Note' : 'Add New Note'}
                            </h3>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows="4"
                                placeholder="Write your note here..."
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                            />
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    onClick={handleSave}
                                    disabled={!noteContent.trim()}
                                >
                                    {editingIndex !== null ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Header Component
const Header = ({ nickname: propNickname }) => {
    const { userId, nickname, setUserId, setNickname } = useAuth();
    const minutes = useTimer();
    const userCounts = useUserData(userId);
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [notes, setNotes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch courses
    useEffect(() => {
        const fetchCourseNames = async () => {
            try {
                const response = await http.get("/api/all-course-names");
                if (response.data?.result) {
                    const courseWithProgress = response.data.result.map(course => ({
                        id: course.id,
                        name: course.name,
                        progress: Math.floor(Math.random() * 101),
                    }));
                    setCourses(courseWithProgress);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
        };

        fetchCourseNames();
    }, []);

    // Fetch notes
    useEffect(() => {
        const fetchNotes = async (userId) => {
            try {
                const response = await http.get("/api/show-all-note", {
                    params: { userId: parseInt(userId) }
                });
                const noteList = response?.data?.result;
                if (Array.isArray(noteList)) setNotes(noteList);
            } catch (error) {
                console.error("Failed to fetch notes:", error);
                toast.error("Failed to load notes.");
            }
        };

        if (userId) {
            fetchNotes(userId);
        }
    }, [userId]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("nickname");
        localStorage.removeItem("userId");
        localStorage.removeItem("startTime");
        localStorage.removeItem("token");
        setUserId(null);
        setNickname(null);

        toast.info("👋 Bạn đã đăng xuất", {
            position: "top-right",
            autoClose: 2000,
        });

        setTimeout(() => navigate("/login"), 1000);
    }, [navigate, setUserId, setNickname]);

    const handleCourseClick = useCallback((course) => {
        navigate(`/dictation?courseId=${course.id}&courseName=${encodeURIComponent(course.name)}`);
    }, [navigate]);

    const handleSaveNote = useCallback(async (noteContent, editingIndex) => {
        const currentUserId = localStorage.getItem("userId");
        if (!currentUserId) {
            toast.error("Please login again.");
            return;
        }

        if (!noteContent.trim()) {
            toast.error("Note content cannot be empty.");
            return;
        }

        try {
            if (editingIndex !== null) {
                const noteToUpdate = notes[editingIndex];
                const response = await http.put("/api/update-note", {
                    noteId: noteToUpdate.id,
                    content: noteContent.trim(),
                });

                const updatedNote = response?.data?.result;
                if (updatedNote) {
                    const updatedNotes = [...notes];
                    updatedNotes[editingIndex] = updatedNote;
                    setNotes(updatedNotes);
                    toast.success("Note updated!");
                }
            } else {
                const response = await http.post("/api/create-note", {
                    userId: parseInt(currentUserId),
                    content: noteContent.trim(),
                });

                const newNote = response?.data?.result;
                if (newNote) {
                    setNotes(prev => [...prev, newNote]);
                    toast.success("Note saved!");
                }
            }
        } catch (error) {
            console.error("Error saving/updating note:", error);
            toast.error("Failed to save note.");
        }
    }, [notes]);

    const handleDeleteNote = useCallback(async (index) => {
        const noteToDelete = notes[index];

        try {
            await http.delete("/api/delete-note", {
                params: { noteId: noteToDelete.id },
            });

            const updatedNotes = notes.filter((_, i) => i !== index);
            setNotes(updatedNotes);
            toast.success("Note deleted!");
        } catch (error) {
            console.error("Failed to delete note:", error);
            toast.error("Failed to delete note.");
        }
    }, [notes]);

    return (
        <>
            <header className="bg-white shadow-sm py-3 w-full sticky top-0 z-40 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3">
                        <Logo />
                        <NavigationMenu />
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between text-sm text-gray-700">
                        <div className="flex items-center space-x-2 text-blue-600">
                            <FaClock />
                            <span className="font-medium">{minutes} minutes</span>
                        </div>
                        {/* Chữ Buy Course */}

                        <div className="flex items-center space-x-6">
<span className="text-gray-700 font-semibold cursor-pointer hover:text-blue-800 flex items-center space-x-2">
    <Link to="/topicBuy">
        <span>Buy Course</span>
    </Link>
</span>                            <ProgressDropdown
                                courses={courses}
                                onCourseClick={handleCourseClick}
                            />

                            <button
                                className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <FaRegStickyNote />
                                <span>Notes</span>
                                {notes.length > 0 && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {notes.length}
                        </span>
                                )}
                            </button>



                            {nickname ? (
                                <UserDropdown
                                    nickname={nickname}
                                    counts={userCounts}
                                    onLogout={handleLogout}
                                />
                            ) : (
                                <button
                                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                                    onClick={() => navigate('/login')}
                                >
                                    <span>🔐</span>
                                    <span>Login</span>
                                </button>
                            )}

                            <button className="text-gray-500 hover:text-gray-700 transition-colors">
                                <FaCog />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <NotesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                notes={notes}
                onSave={handleSaveNote}
                onDelete={handleDeleteNote}
            />
        </>
    );
};

export default Header;