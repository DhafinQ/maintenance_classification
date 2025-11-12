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
  const [isLoading, setLoading] = useState(true);
  const [predictData, setPredictData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(PREDICT_API_URL);
        setPredictData(response.data);
      } catch (error) {
        console.error("Error fetching prediction data:", error.message);
        setPredictData({
          ...MOCK_PREDICT_DATA,
          error: `API Error: ${error.message}. Data ditampilkan dari Mock (0%).`
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        alignItems: "center", // 🔥 Pusatkan konten horizontal
        justifyContent: "center", // 🔥 Pusatkan konten vertikal
        minHeight: "50vh", // agar tetap center meskipun halaman tinggi
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
              justifyContent="center" // 🔥 Pusatkan semua card
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
              justifyContent="center" // 🔥 Pusatkan chart
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
