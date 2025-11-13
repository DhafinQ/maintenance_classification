// src/views/dashboard-chart/PredictionCard.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function PredictionCard({ title, value, subtitle, color, sx, resultClass }) {
    // Menetapkan warna berdasarkan resultClass untuk Final Decision Card
    const getColorForDecision = (className) => {
        switch (className) {
            case 'success':
                return '#00E396'; // Hijau untuk Tidak Rusak
            case 'error':
                return '#FF4560'; // Merah untuk Rusak
            default:
                return 'primary.main'; 
        }
    };
    
    // Gunakan warna prop yang diteruskan atau hitung berdasarkan resultClass
    const displayColor = color || getColorForDecision(resultClass);

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                backgroundColor: 'background.paper',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                ...sx
            }}
        >
            <CardContent
                sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%'
                }}
            >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {subtitle}
                </Typography>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    color={displayColor} // Menggunakan displayColor
                    sx={{ mb: 0.5 }}
                >
                    {value}
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
}