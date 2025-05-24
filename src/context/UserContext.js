// import React, { createContext, useContext, useState, useEffect } from 'react';
//
// const UserContext = createContext();
//
// export const useUser = () => {
//     return useContext(UserContext);
// };
//
// export const UserProvider = ({ children }) => {
//     const [nickname, setNickname] = useState(localStorage.getItem('nickname') || 'Guest');
//     const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
//
//     useEffect(() => {
//         // If nickname or userId changes, update them in localStorage
//         localStorage.setItem('nickname', nickname);
//         localStorage.setItem('userId', userId);
//     }, [nickname, userId]);
//
//     const updateUser = (newNickname, newUserId) => {
//         setNickname(newNickname);
//         setUserId(newUserId);
//     };
//
//     return (
//         <UserContext.Provider value={{ nickname, userId, updateUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };
