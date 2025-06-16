import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import { FaClock, FaRegStickyNote, FaStar, FaUserCircle, FaCog } from 'react-icons/fa';
import { http } from "../../api/Http";

const Header = ({ nickname: propNickname }) => {
    const [nickname, setNickname] = useState(null);

    useEffect(() => {
        setNickname(localStorage.getItem("nickname"));
    }, []);
    const navigate = useNavigate();
    const [commentCount, setCommentCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [courses, setCourses] = useState([]);

    // Modal and Notes States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [notes, setNotes] = useState([]);
    const [isAddNoteForm, setIsAddNoteForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    // Dropdown States
    const [isVideoDropdownOpen, setIsVideoDropdownOpen] = useState(false);
    const [isInProgressDropdownOpen, setIsInProgressDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const [minutes, setMinutes] = useState(0);
    // Theme State
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) setUserId(parseInt(storedUserId));

        // Fetch course names
        const fetchCourseNames = async () => {
            try {
                const response = await http.get("/api/all-course-names");
                if (response.data && response.data.result) {
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

        // Fetch favorite, notifications, comments counts
        const fetchUserDataCounts = async (userId) => {
            try {
                const [favRes, notifRes, commentRes] = await Promise.all([
                    http.get("/api/show-all-favorite-course", { params: { userId } }),
                    http.get(`/api/show-all-notification?userId=${userId}`),
                    http.get(`/api/show-comment-user?userId=${userId}`),
                ]);

                if (favRes.data && Array.isArray(favRes.data.result)) setFavoriteCount(favRes.data.result.length);
                if (notifRes.data && Array.isArray(notifRes.data.result)) setNotificationCount(notifRes.data.result.length);
                if (commentRes.data && Array.isArray(commentRes.data.result)) setCommentCount(commentRes.data.result.length);
            } catch (error) {
                console.error("Failed to fetch user data counts:", error);
            }
        };

        // Fetch notes
        const fetchNotes = async (userId) => {
            try {
                const response = await http.get("/api/show-all-note", { params: { userId: parseInt(userId) } });
                const noteList = response?.data?.result;
                if (Array.isArray(noteList)) setNotes(noteList);
            } catch (error) {
                console.error("Failed to fetch notes:", error);
                toast.error("Failed to load notes.");
            }
        };

        fetchCourseNames();

        if (storedUserId) {
            fetchUserDataCounts(storedUserId);

            // Poll every 3 seconds for updates on counts
            const intervalId = setInterval(() => {
                fetchUserDataCounts(storedUserId);
            }, 3000);

            fetchNotes(storedUserId);

            // Cleanup interval on unmount
            return () => clearInterval(intervalId);
        }
    }, []);

    useEffect(() => {
        const syncNickname = () => setNickname(localStorage.getItem("nickname"));
        window.addEventListener("storage", syncNickname);
        return () => window.removeEventListener("storage", syncNickname);
    }, []);
    useEffect(() => {
        // Lấy startTime từ localStorage, nếu chưa có thì set hiện tại
        let startTime = localStorage.getItem("startTime");
        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem("startTime", startTime);
        }

        // Hàm tính số phút đã trôi qua
        const updateMinutes = () => {
            const now = Date.now();
            const diff = now - parseInt(startTime, 10);
            const mins = Math.floor(diff / 60000); // 1 phút = 60000 ms
            setMinutes(mins);
        };

        updateMinutes(); // tính lần đầu ngay khi mount

        const intervalId = setInterval(updateMinutes, 60000); // update mỗi phút

        return () => clearInterval(intervalId); // cleanup khi unmount
    }, []);
    // Handle dropdown toggles
    const handleDropdownToggle = (dropdown) => {
        switch (dropdown) {
            case 'video':
                setIsVideoDropdownOpen(prev => !prev);
                break;
            case 'inProgress':
                setIsInProgressDropdownOpen(prev => !prev);
                break;
            case 'user':
                setIsUserDropdownOpen(prev => !prev);
                break;
            default:
                break;
        }
    };
    const handleLogout = () => {
        console.log("userId remove:" + userId);
        localStorage.removeItem("nickname");
        localStorage.removeItem("userId");
        setUserId(null); // 👈 thêm dòng này
        setNickname(null);
        toast.info("👋 Bạn đã đăng xuất", {
            position: "top-right",
            autoClose: 2000,
        });
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };
    const handleSaveNote = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            toast.error("Please login again.");
            return;
        }

        if (!noteContent.trim()) {
            toast.error("Note content cannot be empty.");
            return;
        }

        try {
            if (editingIndex !== null) {
                // ✅ UPDATE NOTE
                const noteToUpdate = notes[editingIndex];
                const response = await http.put("/api/update-note", {
                    noteId: noteToUpdate.id, // <-- sửa tại đây
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
                // ✅ CREATE NEW NOTE
                const response = await http.post("/api/create-note", {
                    userId: parseInt(userId),
                    content: noteContent.trim(),
                });

                const newNote = response?.data?.result;
                if (newNote) {
                    setNotes([...notes, newNote]);
                    toast.success("Note saved!");
                }
            }

            setIsAddNoteForm(false);
            setNoteContent('');
            setEditingIndex(null);
        } catch (error) {
            console.error("Error saving/updating note:", error);
            toast.error("Failed to save note.");
        }
    };
    // Edit note
    const handleEditNote = (index) => {
        setEditingIndex(index);
        setNoteContent(notes[index].content);
        setIsAddNoteForm(true);
    };
    // Delete note
    const handleDeleteNote = async (index) => {
        const noteToDelete = notes[index];

        try {
            await http.delete("/api/delete-note", {
                params: { noteId: noteToDelete.id }, // ✅ Sửa ở đây
            });

            const updatedNotes = notes.filter((_, i) => i !== index);
            setNotes(updatedNotes);
            toast.success("Note deleted!");
        } catch (error) {
            console.error("Failed to delete note:", error);
            toast.error("Failed to delete note.");
        }
    };
    const handleCourseClick = (course) => {
        // encodeURIComponent để tránh lỗi ký tự đặc biệt trong URL
        navigate(`/dictation?courseId=${course.id}&courseName=${encodeURIComponent(course.name)}`);
    };
    return (
        <header className="bg-white shadow-sm py-2 w-full sticky top-0 z-50 px-4">
            <div className="max-w-screen-xl mx-auto flex flex-col space-y-2 px-6">
                {/* Logo and main menu */}
                <div className="flex items-center justify-between flex-wrap text-sm text-gray-700">
                    <div className="flex flex-col">
                        <Link to="/homepage" className="flex items-center space-x-2">
                            <div className="text-blue-600 font-bold text-2xl">D</div>
                            <span className="font-semibold text-lg">DailyDictation</span>
                        </Link>
                    </div>

                    {/* Main menu */}
                    <nav className="flex items-center space-x-6">
                        <Link to="/topics" className="hover:text-blue-600">All exercises</Link>
                        <Link to="/top-users" className="hover:text-blue-600">Top users</Link>

                        {/* Video lessons dropdown */}
                        <div className="relative">
                            <span
                                className="hover:text-blue-600 cursor-pointer"
                                onClick={() => handleDropdownToggle('video')}
                            >
                                Video lessons ▾
                            </span>
                            {isVideoDropdownOpen && (
                                <div className="absolute top-full left-0 bg-white shadow rounded-md mt-1 w-40 z-10">
                                    <Link to="/videos/basic" className="block px-4 py-2 hover:bg-gray-100">Basic</Link>
                                    <Link to="/videos/intermediate" className="block px-4 py-2 hover:bg-gray-100">Intermediate</Link>
                                </div>
                            )}
                        </div>

                        <Link to="/donate" className="text-pink-500 hover:underline">Donate 💖</Link>
                    </nav>
                </div>

                <hr className="border-t border-gray-300 w-full" />

                {/* In-progress, Notes, User, Settings */}
                <div className="flex items-center justify-between space-x-4 text-sm text-gray-700 mt-2">
                    <div className="flex items-center space-x-1">
                        <FaClock />
                        <span>{minutes} minutes</span>
                    </div>
                    <div className="flex items-center space-x-4 ml-auto">
                        {/* In-progress dropdown */}
                        <div className="relative flex items-center space-x-1">
                            <FaStar />
                            <span
                                className="cursor-pointer"
                                onClick={() => handleDropdownToggle('inProgress')}
                            >
        In-progress ▾
      </span>
                            {isInProgressDropdownOpen && (
                                <div className="absolute top-full left-0 bg-white shadow rounded-md mt-1 w-64 max-h-64 overflow-auto z-10 p-2">
                                    {courses.length === 0 ? (
                                        <div className="p-4 text-gray-500">Loading...</div>
                                    ) : (
                                        courses.map((course, idx) => (
                                            <div key={idx} className="mb-3 cursor-pointer" onClick={() => handleCourseClick(course)}>
                                                <div className="font-semibold text-sm text-blue-600 hover:underline">{course.name}</div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                                <small className="text-xs text-gray-600">{course.progress}% completed</small>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>                
                        {/* Notes - Open the modal to add/edit note */}
                        <button
                            type="button"
                            className="flex items-center space-x-1 hover:text-blue-600"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaRegStickyNote />
                            <span>Note</span>
                        </button>


                        {/* User dropdown */}
                        {/* User dropdown or Login */}
                        {nickname ? (
                            <div className="relative flex items-center space-x-1">
                                <FaUserCircle />
                                <span
                                    className="cursor-pointer"
                                    onClick={() => handleDropdownToggle('user')}
                                >
            {nickname} ▾
        </span>
                                {isUserDropdownOpen && (
                                    <div className="absolute top-full right-0 bg-white shadow rounded-md mt-1 w-48 z-10">
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">👤 Profile Info</Link>
                                        <Link to="/notifications" className="block px-4 py-2 hover:bg-gray-100">
                                            🔔 Notifications ({notificationCount})
                                        </Link>
                                        <Link to="/comments" className="block px-4 py-2 hover:bg-gray-100">
                                            💬 Comments ({commentCount})
                                        </Link>
                                        <Link to="/favourites" className="block px-4 py-2 hover:bg-gray-100">
                                            ⭐ Favourites ({favoriteCount})
                                        </Link>
                                        <div className="border-t my-1"></div>
                                        <Link to="/changePassword" className="block px-4 py-2 hover:bg-gray-100">🔑 Change Password</Link>
                                        <Link to="/changeMail" className="block px-4 py-2 hover:bg-gray-100">✉️ Change Email</Link>
                                        <div className="border-t my-1"></div>
                                        <Link
                                            to="/login"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleLogout();
                                            }}
                                            className="block px-4 py-2 hover:bg-red-100 text-red-600"
                                        >
                                            🚪 Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="flex items-center space-x-1 text-600 hover:underline cursor-pointer"
                                onClick={() => navigate('/login')}
                            >

                                <span>🔐 Login</span>
                            </div>
                        )}

                        {/* Theme settings */}
                        <div className="relative">
                            <div
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                            >
                                <FaCog />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
                        {/* Close button (X) */}
                        <button
                            className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-lg font-bold"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✖
                        </button>

                        {/* Header */}
                        <div className="mb-2">
                            <div className="text-xl font-semibold">Notes</div>
                            <div className="text-sm text-gray-600 mt-1">
                                📝 Total Notes: {notes.length}
                            </div>
                        </div>

                        {/* Add/Edit Note Form */}
                        {!isAddNoteForm ? (
                            <div>
                                {/* Add Note Button */}
                                <div className="flex justify-end mb-2">
                                    <button
                                        className="text-blue-600 hover:underline font-medium"
                                        onClick={() => {
                                            setNoteContent('');
                                            setIsAddNoteForm(true);
                                            setEditingIndex(null);
                                        }}
                                    >
                                        ➕ Add Note
                                    </button>
                                </div>

                                {/* Notes list or empty state */}
                                {notes.length === 0 ? (
                                    <p className="text-gray-600">No notes yet. Click "+ Add Note" to start.</p>
                                ) : (
                                    <ul>
                                        {notes.map((note, index) => (
                                            <li key={note.noteId} className="border-b py-2 flex justify-between items-start text-sm">
                                                <span className="w-3/4 break-words">{note.content}</span>
                                                <div className="space-x-2 flex-shrink-0">
                                                    <button
                                                        className="text-blue-600 hover:underline"
                                                        onClick={() => handleEditNote(index)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:underline"
                                                        onClick={() => handleDeleteNote(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : (


                            <div>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Write your note..."
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                />
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        type="button"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        onClick={handleSaveNote}
                                    >
                                        Save Note
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                                        onClick={() => {
                                            setIsAddNoteForm(false);
                                            setNoteContent('');
                                            setEditingIndex(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </header>
    );
};
export default Header;