// src/Views/dashboard-chart/Dashboard.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                setLoading(false);
                navigate('/pages/login', { replace: true }); 
                return;
            }

            setLoading(true);
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                };

                const response = await axios.get(PREDICT_API_URL, config);
                setPredictData(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/pages/login', { replace: true });
                    return; 
                }

                // Gunakan mock data jika API gagal
                setPredictData(MOCK_PREDICT_DATA);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

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
    
    // Variabel confidenceData dihapus karena tidak digunakan lagi
    
    return (
        <div className="dashboard-container main-card"> 
            
            <h2 className="dashboard-title title">Machine Fault Prediction Dashboard</h2> 

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
                            {/* Prediction Chart - Menggunakan predictData sebagai prop */}
                            <PredictionChart predictData={predictData} /> 
                        </div>
                        <div className="chart-item chart-side-focus-revised">
                            {/* Confidence Chart */}
                            <ConfidenceChart predictData={predictData} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}