import React, { useEffect, useState } from "react";
import { http } from "../api/Http";

const formatMinutes = (min) => {
    const hours = Math.floor(min / 60);
    const minutes = min % 60;
    return `${hours}h ${minutes}m`;
};

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [practiceData, setPracticeData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingPractice, setLoadingPractice] = useState(true);
    const [errorUser, setErrorUser] = useState(null);
    const [errorPractice, setErrorPractice] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [newNickName, setNewNickName] = useState("");

    const [showImgModal, setShowImgModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const userId = localStorage.getItem("userId");

    // Fetch user info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await http.get(`/api/show-information`, {
                    params: { userId },
                    headers: { Authorization: `Bearer ${token}` },
                });

                const result = res.data.result;
                setUserData({
                    id: result.id,
                    username: result.nickName,
                    img: result.img,
                    joinDate: result.createDate,
                    totalActiveTime: 12840,
                    coursesCompleted: 8,
                    last7Days: 320,
                    last30Days: 1260,
                });
                setLoadingUser(false);
            } catch (error) {
                setErrorUser("Failed to load user data");
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, [userId]);

    // Fetch practice info
    useEffect(() => {
        const fetchPractice = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await http.get(`/api/show-practice`, {
                    params: { userId },
                    headers: { Authorization: `Bearer ${token}` },
                });

                setPracticeData(res.data.result);
                setLoadingPractice(false);
            } catch (error) {
                setErrorPractice("Failed to load practice data");
                setLoadingPractice(false);
            }
        };
        fetchPractice();
    }, [userId]);

    const handleSaveNickname = async () => {
        try {
            const token = localStorage.getItem("token");

            await http.put(
                `/api/edit-nick-name-user`,
                {},
                {
                    params: { userId, newNickName },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUserData((prev) => ({
                ...prev,
                username: newNickName,
            }));
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update nickname:", error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSaveImage = async () => {
        if (!selectedFile) return;

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("avatar", selectedFile);

            const response = await http.put(
                `/api/upload-avatar`,
                formData,
                {
                    params: { userId },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newImgUrl = response.data.result.img;

            setUserData((prev) => ({
                ...prev,
                img: newImgUrl,
            }));

            setShowImgModal(false);
            setSelectedFile(null);
        } catch (error) {
            console.error("Failed to update avatar:", error);
        }
    };

    if (loadingUser || loadingPractice)
        return <div className="text-center mt-10">Loading...</div>;

    if (errorUser)
        return (
            <div className="text-center mt-10 text-red-500">
                {errorUser}
            </div>
        );

    if (errorPractice)
        return (
            <div className="text-center mt-10 text-red-500">
                {errorPractice}
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded mt-10 mb-10">
            {/* Avatar + Name */}
            <div className="flex items-center space-x-4 mb-6">
                <img
                    src={userData.img}
                    alt="User avatar"
                    className="w-20 h-20 rounded-full border"
                />
                <div>
                    <div className="flex items-center space-x-3">
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={newNickName}
                                    onChange={(e) => setNewNickName(e.target.value)}
                                    className="border px-2 py-1 rounded text-sm"
                                />
                                <button
                                    onClick={handleSaveNickname}
                                    className="text-blue-500 text-sm"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-500 text-sm"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-semibold">{userData.username}</h2>
                                <button
                                    onClick={() => {
                                        setNewNickName(userData.username);
                                        setIsEditing(true);
                                    }}
                                    className="text-blue-500 text-sm"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => setShowImgModal(true)}
                                    className="relative top-[-4px] text-blue-600 text-2xl cursor-pointer hover:text-blue-800"
                                    aria-label="Change avatar"
                                    title="Change avatar"
                                >
                                    📷
                                </button>
                            </>
                        )}
                    </div>
                    <p className="text-gray-600">
                        Joined on {new Date(userData.joinDate).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-500">Total Active Time</p>
                    <p className="text-lg font-medium">
                        {formatMinutes(userData.totalActiveTime)}
                    </p>
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-500">Courses Completed</p>
                    <p className="text-lg font-medium">{userData.coursesCompleted}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-500">Active Time (Last 7 Days)</p>
                    <p className="text-lg font-medium">
                        {formatMinutes(userData.last7Days)}
                    </p>
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-500">Active Time (Last 30 Days)</p>
                    <p className="text-lg font-medium">
                        {formatMinutes(userData.last30Days)}
                    </p>
                </div>
            </div>

            {/* Practice Info */}
            <div className="max-w-md mx-auto bg-gray-50 p-4 rounded border">
                <h3 className="text-lg font-semibold mb-2">Practice Information</h3>
                {practiceData ? (
                    <>
                        <p>
                            <strong>Score:</strong> {practiceData.score}
                        </p>
                        <p>
                            <strong>Status:</strong> {practiceData.status}
                        </p>
                        <p>
                            <strong>Score Finish:</strong> {practiceData.scoreFinish}
                        </p>
                    </>
                ) : (
                    <p className="text-gray-500">No practice data available.</p>
                )}
            </div>

            {/* Modal chọn ảnh */}
            {showImgModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Change Avatar</h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mb-4"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowImgModal(false);
                                    setSelectedFile(null);
                                }}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveImage}
                                disabled={!selectedFile}
                                className={`px-4 py-2 rounded text-white ${
                                    selectedFile
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
