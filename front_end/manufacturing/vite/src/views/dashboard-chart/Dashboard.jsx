// src/Views/dashboard-chart/Dashboard.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PredictionCard from './PredictionCard';
import PredictionChart from './PredictionChart';
import ConfidenceChart from './ConfidenceChart';
import { useNavigate } from 'react-router-dom'; // 1. Tambahkan useNavigate untuk Redirect

const PREDICT_API_URL = 'http://127.0.0.1:8000/predict/';

const MOCK_PREDICT_DATA = {
    predictions: {
        "Logistic Regression": { label: "N/A", confidence: 0.0 },
        "Random Forest": { label: "N/A", confidence: 0.0 },
        "XGBoost": { label: "N/A", confidence: 0.0 }
    },
    summary: { best_model: "N/A", final_decision: "N/A" }
};

export default function Dashboard() {
    const navigate = useNavigate(); // 2. Inisialisasi useNavigate
    const [isLoading, setLoading] = useState(true);
    const [predictData, setPredictData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            
            // 3. Cek Token - Jika tidak ada, redirect ke login (meskipun MainLayout sudah punya guard, ini adalah backup)
            if (!token) {
                console.log("Token not found in Dashboard. Redirecting to login.");
                setLoading(false);
                // Redirect ke login, hindari error API
                navigate('/pages/login', { replace: true }); 
                return;
            }

            setLoading(true);
            try {
                // 4. Konfigurasi Header dengan Token
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                };

                // Mengirim permintaan dengan header Authorization
                const response = await axios.get(PREDICT_API_URL, config);
                setPredictData(response.data);
            } catch (error) {
                console.error("Error fetching prediction data:", error.message);
                
                // 5. Tangani Error 401 (Unauthorized/Token Expired)
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized (401). Token might be expired/invalid. Redirecting to login.");
                    localStorage.removeItem('accessToken');
                    navigate('/pages/login', { replace: true });
                    return; 
                }

                // Tangani error lainnya
                setPredictData({
                    ...MOCK_PREDICT_DATA,
                    error: `API Error: ${error.message}. Data ditampilkan dari Mock (0%).`
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]); // Tambahkan navigate sebagai dependency useEffect

    const predictions = predictData?.predictions || {};
    const summary = predictData?.summary || {};

    const finalDecisionText =
        summary.final_decision === "1"
            ? "Rusak"
            : summary.final_decision === "0"
            ? "Tidak Rusak"
            : "N/A";

    const finalDecisionColor =
        summary.final_decision === "1"
            ? "error.main"
            : summary.final_decision === "0"
            ? "success.main"
            : "text.secondary";

    return (
        <Box
            sx={{
                flexGrow: 1,
                p: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center", 
                minHeight: "50vh", 
                backgroundColor: "#f9fafb",
            }}
        >
            <Box sx={{ width: "90%", maxWidth: "1200px" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{ mb: 4, fontWeight: "bold" }}
                >
                    Machine Fault Prediction Dashboard
                </Typography>

                {/* --- Pesan Error Jika Ada --- */}
                {predictData?.error && (
                    <Card sx={{ mb: 3, bgcolor: "error.light" }}>
                        <CardContent>
                            <Typography variant="h6" color="error.dark">
                                WARNING: Gagal Koneksi
                            </Typography>
                            <Typography color="error.dark">{predictData.error}</Typography>
                        </CardContent>
                    </Card>
                )}

                {isLoading || !predictData ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Fetching prediction data...</Typography>
                    </Box>
                ) : (
                    <>
                        {/* --- Grid Card Atas --- */}
                        <Grid
                            container
                            spacing={3}
                            justifyContent="center" 
                            sx={{ mb: 4 }}
                        >
                            <Grid item xs={12} sm={6} md={3}>
                                <PredictionCard
                                    title="Logistic Regression"
                                    value={`${(
                                        predictions["Logistic Regression"]?.confidence * 100
                                    ).toFixed(2)}%`}
                                    subtitle="Confidence"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <PredictionCard
                                    title="Random Forest"
                                    value={`${(
                                        predictions["Random Forest"]?.confidence * 100
                                    ).toFixed(2)}%`}
                                    subtitle="Confidence"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <PredictionCard
                                    title="XGBoost"
                                    value={`${(
                                        predictions["XGBoost"]?.confidence * 100
                                    ).toFixed(2)}%`}
                                    subtitle="Confidence"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <PredictionCard
                                    title={`Best Model: ${summary.best_model}`}
                                    value={finalDecisionText}
                                    subtitle="Final Decision"
                                    color={finalDecisionColor}
                                />
                            </Grid>
                        </Grid>

                        {/* --- Grid Chart Bawah --- */}
                        <Grid
                            container
                            spacing={3}
                            justifyContent="center" 
                            alignItems="stretch"
                        >
                            <Grid item xs={12} md={8}>
                                <PredictionChart predictData={predictData} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <ConfidenceChart predictData={predictData} />
                            </Grid>
                        </Grid>
                    </>
                )}
            </Box>
        </Box>
    );
}