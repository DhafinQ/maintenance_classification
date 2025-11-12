// src/views/sample-page/InputForm.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // 🧭 Tambahkan ini

// 1. Page wrapper
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#f8f9fa',
  padding: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}));

// 2. Content grid
const ContentGrid = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  alignItems: 'start',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 2),
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
  border: 'none',
  width: '100%',
}));

const FormContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(5),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.8),
  borderRadius: 8,
  fontWeight: 700,
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
}));

const TypeOptions = [
  { value: 0, label: 'High Quality (0)' },
  { value: 1, label: 'Low Quality (1)' },
  { value: 2, label: 'Medium Quality (2)' },
];

const initialFormData = {
  Type: 0,
  Air_temperature_C: '',
  Process_temperature_C: '',
  Rotational_speed_rpm: '',
  Torque_Nm: '',
  Tool_wear_min: '',
};

export default function InputForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 🧭 Hook untuk redirect

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Type') setFormData((p) => ({ ...p, Type: Number(value) }));
    else setFormData((p) => ({ ...p, [name]: value }));
    setPredictionResult(null);
    setError(null);
  };

  const validateAndBuildPayload = () => {
    const payload = {};
    for (const key of Object.keys(formData)) {
      if (key === 'Type') {
        payload[key] = Number(formData.Type);
        continue;
      }
      const raw = formData[key];
      if (raw === '' || raw === null || raw === undefined) {
        throw new Error(`Field "${key}" tidak boleh kosong.`);
      }
      const num = parseFloat(raw);
      if (!Number.isFinite(num)) throw new Error(`Field "${key}" harus berupa angka valid.`);
      payload[key] = num;
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictionResult(null);
    setError(null);

    let payload;
    try {
      payload = validateAndBuildPayload();
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Server error ${res.status}. ${text ? text.slice(0, 200) : ''}`);

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        throw new Error('Response dari server bukan JSON valid.');
      }

      let finalPrediction;
      if (typeof data.prediction !== 'undefined') finalPrediction = data.prediction;
      else if (data.summary?.final_decision) finalPrediction = data.summary.final_decision;
      else {
        const candidate = Object.values(data).find(
          (v) => typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v))
        );
        finalPrediction = candidate;
      }

      if (typeof finalPrediction === 'undefined')
        throw new Error('Tidak menemukan hasil prediksi pada response server.');

      setPredictionResult(Number(finalPrediction));

      // ✅ Redirect ke dashboard setelah hasil diterima
      setTimeout(() => {
        navigate('/dashboard-chart');
      }, 500);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat memproses permintaan.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPredictionMessage = (prediction) => {
    if (prediction === 1)
      return { severity: 'error', text: 'Prediksi: GAGAL (Failure detected)' };
    return { severity: 'success', text: 'Prediksi: AMAN (No failure)' };
  };

  return (
    <PageWrapper>
      <ContentGrid>
        <FormCard>
          <FormContent>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1976d2', mb: 0.5 }}>
                Input Data Mesin
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Masukkan nilai pengukuran untuk mendapatkan prediksi kondisi mesin secara real-time
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                {predictionResult !== null && (
                  <Alert severity={getPredictionMessage(predictionResult).severity}>
                    {getPredictionMessage(predictionResult).text}
                  </Alert>
                )}

                {error && <Alert severity="warning">{error}</Alert>}

                <TextField
                  select
                  fullWidth
                  label="Type"
                  name="Type"
                  value={formData.Type}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                >
                  {TypeOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Air Temperature (°C)"
                  name="Air_temperature_C"
                  value={formData.Air_temperature_C}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ step: '0.01' }}
                  variant="outlined"
                  size="medium"
                />

                <TextField
                  fullWidth
                  label="Process Temperature (°C)"
                  name="Process_temperature_C"
                  value={formData.Process_temperature_C}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ step: '0.01' }}
                  variant="outlined"
                  size="medium"
                />

                <TextField
                  fullWidth
                  label="Rotational Speed (rpm)"
                  name="Rotational_speed_rpm"
                  value={formData.Rotational_speed_rpm}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                  size="medium"
                />

                <TextField
                  fullWidth
                  label="Torque (Nm)"
                  name="Torque_Nm"
                  value={formData.Torque_Nm}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ step: '0.1' }}
                  variant="outlined"
                  size="medium"
                />

                <TextField
                  fullWidth
                  label="Tool Wear (min)"
                  name="Tool_wear_min"
                  value={formData.Tool_wear_min}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                  size="medium"
                />

                <StyledButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  endIcon={
                    isLoading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />
                  }
                >
                  {isLoading ? 'Memproses...' : 'Lakukan Prediksi'}
                </StyledButton>
              </Stack>
            </Box>
          </FormContent>
        </FormCard>
      </ContentGrid>
    </PageWrapper>
  );
}
