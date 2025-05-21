// Dashboard.jsx (sử dụng MUI)
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function Dashboard() {
    return (
        <div style={{ padding: '20px', marginLeft: '16rem' }}> {/* Đảm bảo nội dung không bị lấp bởi sidebar */}
            <h2>📊 Admin Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5">👥 Users</Typography>
                        <Typography variant="h3" style={{ fontWeight: 'bold' }}>124</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5">📚 Dictations</Typography>
                        <Typography variant="h3" style={{ fontWeight: 'bold' }}>48</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5">💬 Comments</Typography>
                        <Typography variant="h3" style={{ fontWeight: 'bold' }}>320</Typography>
                    </CardContent>
                </Card>
            </div>

            <Card variant="outlined" style={{ marginTop: '20px', textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h5">📈 Activity Overview</Typography>
                    <Typography variant="body1">(Placeholder for chart or stats)</Typography>
                </CardContent>
            </Card>
        </div>
    );
}
