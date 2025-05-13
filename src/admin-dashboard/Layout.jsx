// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar

export default function Layout() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar will have fixed width and remain the same size */}
            <Sidebar />

            {/* Content will take the remaining space */}
            <div className="flex-1 p-6 ml-64"> {/* 64px = 16 * 4 (w-64) */}
                <Outlet /> {/* Content will be rendered here */}
            </div>
        </div>
    );
}
