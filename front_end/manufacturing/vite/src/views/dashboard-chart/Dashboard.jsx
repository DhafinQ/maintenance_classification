// src/Views/dashboard-chart/Dashboard.jsx

import { useEffect, useState, useCallback } from 'react'; // Tambahkan useCallback
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Asumsi components ini ada di path yang sama atau sudah dikonfigurasi
import PredictionCard from './PredictionCard';
import PredictionChart from './PredictionChart';
import ConfidenceChart from './ConfidenceChart';
import './Dashboard.css';

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
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [predictData, setPredictData] = useState(null);

    // Fungsi untuk mengambil data dari API (dibuat dengan useCallback agar stabil)
    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('accessToken');

        // Cek Autentikasi
        if (!token) {
            setLoading(false);
            navigate('/pages/login', { replace: true });
            return;
        }

        setLoading(true);
        try {
            // 🔑 Mengirim Token untuk membedakan data antar pengguna
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.get(PREDICT_API_URL, config);
            setPredictData(response.data);
        } catch (error) {
            // Handle token kedaluwarsa atau tidak valid
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('username'); // Hapus data user juga
                navigate('/pages/login', { replace: true });
                return;
            }

            // Gunakan mock data jika API gagal (misalnya, server down)
            console.error("Failed to fetch data, using mock data:", error);
            setPredictData(MOCK_PREDICT_DATA);
        } finally {
            setLoading(false);
        }
    }, [navigate]); // navigate sebagai dependency

    // Efek untuk memanggil fetchData saat komponen dimuat
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Penambahan: Fungsi Reset Data ---
    const handleResetData = () => {
        setPredictData(MOCK_PREDICT_DATA);
        console.log("Data prediksi telah direset ke nilai awal.");
    };

    const predictions = predictData?.predictions || MOCK_PREDICT_DATA.predictions;
    const summary = predictData?.summary || MOCK_PREDICT_DATA.summary;

    const finalDecisionText =
        summary.final_decision === "1"
            ? "Rusak"
            : summary.final_decision === "0"
                ? "Tidak Rusak"
                : "N/A";

    const finalDecisionClass =
        summary.final_decision === "1"
            ? "error"
            : summary.final_decision === "0"
                ? "success"
                : "neutral";

    return (
        <div className="dashboard-container main-card">

            <h2 className="dashboard-title title">Machine Fault Prediction Dashboard</h2>

            {/* Tombol Reset Data dan Tombol Muat Ulang (Opsional) */}
            <div className="dashboard-controls">
                <button 
                    onClick={handleResetData} 
                    className="btn btn-warning" 
                    disabled={isLoading}
                >
                    Reset Data (Mock)
                </button>
                <button 
                    onClick={fetchData} 
                    className="btn btn-primary" 
                    disabled={isLoading}
                >
                    Fetch Latest Data
                </button>
            </div>

            <hr className="separator" /> {/* Pemisah visual */}


            {isLoading || !predictData ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Fetching prediction data...</p>
                </div>
            ) : (
                <>
                    {/* --- Grid Card Atas (4 Card) --- */}
                    <div className="grid-row grid-4-cols">
                        <PredictionCard
                            title="Logistic Regression"
                            value={`${(predictions["Logistic Regression"]?.confidence * 100).toFixed(2)}%`}
                            subtitle="Confidence"
                        />
                        <PredictionCard
                            title="Random Forest"
                            value={`${(predictions["Random Forest"]?.confidence * 100).toFixed(2)}%`}
                            subtitle="Confidence"
                        />
                        <PredictionCard
                            title="XGBoost"
                            titleClass="small-title"
                            value={`${(predictions["XGBoost"]?.confidence * 100).toFixed(2)}%`}
                            subtitle="Confidence"
                        />
                        <PredictionCard
                            title={`Best Model: ${summary.best_model || 'N/A'}`}
                            value={finalDecisionText}
                            subtitle="Final Decision"
                            resultClass={finalDecisionClass}
                        />
                    </div>

                    {/* --- Grid Chart Bawah (Chart Ukuran Baru) --- */}
                    <div className="grid-row grid-chart-layout-revised">
                        <div className="chart-item chart-main-focus">
                            <PredictionChart predictData={predictData} />
                        </div>
                        <div className="chart-item chart-side-focus-revised">
                            <ConfidenceChart predictData={predictData} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}