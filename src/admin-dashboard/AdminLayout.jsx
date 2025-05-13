// admin-dashboard/AdminLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    padding: 3,
                }}
            >
                <Container maxWidth="lg">
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                        <Outlet />
                    </div>
                </Container>
            </Box>
        </Box>
    );
}
