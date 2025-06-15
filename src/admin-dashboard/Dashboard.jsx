import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { http } from "../api/Http";

export default function Dashboard() {
    const [userCount, setUserCount] = useState(0);
    const [dictationCount, setDictationCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0); // <-- thêm khai báo này
    useEffect(() => {
        fetchUserCount();
        fetchDictationCount();
        fetchCommentCount();
    }, []);

    const fetchUserCount = async () => {
        try {
            const response = await http.get('/api/get-all-user');
            if (response.data.code === 200) {
                setUserCount(response.data.result.length);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchDictationCount = async () => {
        try {
            const response = await http.get('/api/show-all-topic');
            console.log("Dictation API response:", response.data); // 👈 kiểm tra in ra

            if (response.data.code === 200 && Array.isArray(response.data.result)) {
                setDictationCount(response.data.result.length); // ✅ phải là result.length
            } else {
                console.warn("Unexpected data format:", response.data);
            }
        } catch (error) {
            console.error("Failed to fetch dictations", error);
        }
    };
    const fetchCommentCount = async () => {
        try {
            const response = await http.get('/api/all-comments');
            if (response.data.code === 200 && Array.isArray(response.data.result)) {
                setCommentCount(response.data.result.length);
            } else {
                console.warn("Unexpected comment data:", response.data);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    return (
        <div style={{ padding: '20px', marginLeft: '16rem' }}>
            <h2>📊 Admin Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5">👥 Users</Typography>
                        <Typography variant="h3" style={{ fontWeight: 'bold' }}>{userCount}</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5">📚 Topics</Typography>
                        <Typography variant="h3" style={{ fontWeight: 'bold' }}>{dictationCount}</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5">💬 Comments</Typography>
                        <Typography variant="h3" style={{ fontWeight: 'bold' }}>{commentCount}</Typography>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
