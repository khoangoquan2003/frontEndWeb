import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import { FaClock, FaRegStickyNote, FaStar, FaUserCircle, FaCog } from 'react-icons/fa';

const Header = ({ nickname: propNickname }) => {
    const [nickname, setNickname] = useState(propNickname || localStorage.getItem("nickname"));
    const navigate = useNavigate();

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

    // Theme State
    const [theme, setTheme] = useState("light");
    useEffect(() => {
        const syncNickname = () => {
            setNickname(localStorage.getItem("nickname"));
        };

        window.addEventListener("storage", syncNickname);
        return () => window.removeEventListener("storage", syncNickname);
    }, []);
    // Toggle theme
    const toggleTheme = (selectedTheme) => {
        setTheme(selectedTheme);
        document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
        setIsThemeDropdownOpen(false);
    };


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
        localStorage.clear();
        setNickname(null); // ✅ cập nhật lại state để re-render
        toast.info("👋 Bạn đã đăng xuất", {
            position: "top-right",
            autoClose: 2000,
        });
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };



    // Handle note saving
    const handleSaveNote = () => {
        if (noteContent.trim()) {
            if (editingIndex !== null) {
                // Update existing note
                const updatedNotes = [...notes];
                updatedNotes[editingIndex] = noteContent;
                setNotes(updatedNotes);
                toast.success("Note updated!");
            } else {
                // Add new note
                setNotes([...notes, noteContent]);
                toast.success("Note saved!");
            }
            setIsAddNoteForm(false);
            setNoteContent('');
            setEditingIndex(null);
        } else {
            toast.error("Note content cannot be empty.");
        }
    };

    // Edit note
    const handleEditNote = (index) => {
        setEditingIndex(index);
        setNoteContent(notes[index]);
        setIsAddNoteForm(true);
    };

    // Delete note
    const handleDeleteNote = (index) => {
        const updatedNotes = notes.filter((note, idx) => idx !== index);
        setNotes(updatedNotes);
        toast.info("Note deleted!");
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
                        <span>0 minutes</span>
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
                                <div className="absolute top-full left-0 bg-white shadow rounded-md mt-1 w-40 z-10">
                                    <Link to="/in-progress/dictations" className="block px-4 py-2 hover:bg-gray-100">Dictations</Link>
                                    <Link to="/in-progress/tests" className="block px-4 py-2 hover:bg-gray-100">Tests</Link>
                                </div>
                            )}
                        </div>

                        {/* Notes - Open the modal to add/edit note */}
                        <Link
                            to="#"
                            className="flex items-center space-x-1 hover:text-blue-600"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaRegStickyNote />
                            <span>Note</span>
                        </Link>

                        {/* User dropdown */}
                        <div className="relative flex items-center space-x-1">
                            <FaUserCircle />
                            <span
                                className="cursor-pointer"
                                onClick={() => handleDropdownToggle('user')}
                            >
                                {nickname || "Guest"} ▾
                            </span>
                            {isUserDropdownOpen && (
                                <div className="absolute top-full right-0 bg-white shadow rounded-md mt-1 w-48 z-10">
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">👤 Profile Info</Link>
                                    <Link to="/notifications" className="block px-4 py-2 hover:bg-gray-100">🔔 Notifications</Link>
                                    <Link to="/comments" className="block px-4 py-2 hover:bg-gray-100">💬 Comments</Link>
                                    <Link to="/favourites" className="block px-4 py-2 hover:bg-gray-100">⭐ Favourites</Link>
                                    <div className="border-t my-1"></div>
                                    <Link to="/changePassword" className="block px-4 py-2 hover:bg-gray-100">🔑 Change Password</Link>
                                    <Link to="/changeMail" className="block px-4 py-2 hover:bg-gray-100">✉️ Change Email</Link>
                                    <div className="border-t my-1"></div>
                                    {nickname ? (
                                        <Link
                                            to="/login"
                                            onClick={(e) => {
                                                e.preventDefault(); // ngăn reload trang
                                                handleLogout();
                                            }}
                                            className="block px-4 py-2 hover:bg-red-100 text-red-600"
                                        >
                                            🚪 Logout
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="block px-4 py-2 hover:bg-blue-100 text-blue-600"
                                        >
                                            🔐 Login
                                        </Link>
                                    )}

                                </div>
                            )}
                        </div>

                        {/* Theme settings */}
                        <div className="relative">
                            <div
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                            >
                                <FaCog />
                            </div>
                            {isThemeDropdownOpen && (
                                <div className="absolute right-0 mt-1 bg-white shadow rounded-md text-gray-700 w-32 z-10 dark:bg-gray-800 dark:text-white">
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => toggleTheme('light')}
                                    >
                                        🌞 Light Mode
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => toggleTheme('dark')}
                                    >
                                        🌙 Dark Mode
                                    </button>
                                </div>
                            )}
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
                                {notes.length === 0 ? (
                                    <p className="text-gray-600">No notes yet. Click "+ Add Note" to start.</p>
                                ) : (
                                    <ul>
                                        {notes.map((note, index) => (
                                            <li key={index} className="border-b py-2 flex justify-between items-start text-sm">
                                                <span className="w-3/4 break-words">{note}</span>
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
