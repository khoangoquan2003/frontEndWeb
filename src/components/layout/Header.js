import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import { FaClock, FaRegStickyNote, FaStar, FaUserCircle, FaCog } from 'react-icons/fa';

const Header = ({ nickname }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for notes
    const [noteContent, setNoteContent] = useState(''); // State for note content
    const [notes, setNotes] = useState([]); // State for storing notes
    const [isAddNoteForm, setIsAddNoteForm] = useState(false); // State to toggle between note list and add form
    const [editingIndex, setEditingIndex] = useState(null); // State to track the note being edited
    const [isVideoDropdownOpen, setIsVideoDropdownOpen] = useState(false);
    const [isInProgressDropdownOpen, setIsInProgressDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const [theme, setTheme] = useState("light");

    const navigate = useNavigate();

    // Toggle theme
    const toggleTheme = (selectedTheme) => {
        setTheme(selectedTheme);
        document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
        setIsThemeDropdownOpen(false);
    };

    // Handle dropdown toggle for different sections
    const handleDropdownToggle = (dropdown) => {
        if (dropdown === 'video') setIsVideoDropdownOpen(!isVideoDropdownOpen);
        if (dropdown === 'inProgress') setIsInProgressDropdownOpen(!isInProgressDropdownOpen);
        if (dropdown === 'user') setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.clear();
        toast.info("👋 Bạn đã đăng xuất", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
        });
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    };

    // Open/close the note modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setNoteContent(''); // Reset note content when closing the modal
        setIsAddNoteForm(false); // Reset to view notes when closing the modal
        setEditingIndex(null); // Reset editing state
    };

    // Save the note and add it to the list
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

            setIsAddNoteForm(false); // Switch back to view notes after saving
            setNoteContent(''); // Clear the note content
            setEditingIndex(null); // Reset editing index
        } else {
            toast.error("Note content cannot be empty.");
        }
    };

    // Handle edit of a note
    const handleEditNote = (index) => {
        setEditingIndex(index);
        setNoteContent(notes[index]); // Set the content to be edited
        setIsAddNoteForm(true); // Show the form to edit
    };

    // Handle delete of a note
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
                            onClick={toggleModal} // Open the modal to add/edit a note
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
                                    <Link
                                        to="/login"
                                        onClick={handleLogout}
                                        className="block px-4 py-2 hover:bg-red-100 text-red-600"
                                    >
                                        🚪 Logout
                                    </Link>
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
                        {/* Close button (X) */}
                        <button
                            className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-lg font-bold"
                            onClick={toggleModal}
                        >
                            ✖
                        </button>

                        {/* Header */}
                        {/* Header with total note info */}
                        <div className="mb-2">
                            <div className="text-xl font-semibold">Notes</div>
                            <div className="text-sm text-gray-600 mt-1">
                                📝 Total Notes: {notes.length}
                            </div>
                        </div>

                        {/* Add Note Button - small, aligned right */}
                        {!isAddNoteForm && (
                            <div className="flex justify-end mb-4">
                                <button
                                    className="text-sm text-blue-600 hover:underline flex items-center"
                                    onClick={() => {
                                        setIsAddNoteForm(true);
                                        setNoteContent('');
                                        setEditingIndex(null);
                                    }}
                                >
                                    <span className="text-xl mr-1">+</span>Add Note
                                </button>
                            </div>
                        )}

                        {/* Add/Edit Note Form */}
                        {isAddNoteForm ? (
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
                        ) : (
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
                        )}
                    </div>
                </div>
            )}

        </header>
    );
};

export default Header;
