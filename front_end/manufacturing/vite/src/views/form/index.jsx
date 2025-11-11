import React, { useState } from 'react';
import {
    Grid,
    TextField,
    MenuItem,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Alert, // Tambahkan Alert untuk notifikasi
    CircularProgress // Tambahkan CircularProgress untuk loading
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const StyledCard = styled(Card)(({ theme }) => ({
    boxShadow: theme.shadows[5],
    borderRadius: 12,
    padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontSize: '1rem',
}));

const TypeOptions = [
    { value: 0, label: '0 = High Quality (H)' },
    { value: 1, label: '1 = Low Quality (L)' },
    { value: 2, label: '2 = Medium Quality (M)' },
];

// Data awal (Semua kosong, kecuali Type)
const initialFormData = {
    Type: 0,
    Air_temperature_C: '',
    Process_temperature_C: '',
    Torque_Nm: '',
    Rotational_speed_rpm: '',
    Tool_wear_min: '',
};

export default function InputForm() { // Hapus prop onSubmit dan isLoading dari sini
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null); // State untuk hasil prediksi
    const [error, setError] = useState(null); // State untuk error

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setPredictionResult(null); // Reset hasil saat input diubah
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setPredictionResult(null);
        setError(null);

        // Konversi string input menjadi float, pastikan tidak ada field yang kosong atau NaN
        const dataToSend = {};
        for (const key in formData) {
            // Jika field numerik kosong, anggap 0 atau lemparkan error validasi
            if (formData[key] === '' && key !== 'Type') {
                setError(`Field ${key} tidak boleh kosong.`);
                setIsLoading(false);
                return;
            }
            dataToSend[key] = parseFloat(formData[key]);
        }
        
        try {
            const response = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Gagal melakukan prediksi dari server.');
            }

            const data = await response.json();
            setPredictionResult(data.prediction); // Asumsi API mengembalikan { "prediction": "No Failure" }

        } catch (err) {
            console.error("Fetch Error:", err);
            setError(`Error: ${err.message}. Pastikan backend berjalan.`);
        } finally {
            setIsLoading(false);
            // TIDAK mereset formData di sini agar user bisa melihat input yang sudah dimasukkan
        }
    };

    const getPredictionMessage = (prediction) => {
        if (prediction === 1) {
            return {
                text: "PREDIKSI: GAGAL (Failure Detected)",
                severity: "error",
            };
        }
        return {
            text: "PREDIKSI: AMAN (No Failure)",
            severity: "success",
        };
    };

    return (
        <StyledCard>
            <CardContent>
                <Typography variant="h4" component="div" sx={{ mb: 3, fontWeight: 'bold', color: '#3f51b5' }}>
                    ⚙️ Input Data Prediksi Kerusakan Mesin
                </Typography>
                
                {/* TAMPILKAN HASIL PREDIKSI ATAU ERROR */}
                {predictionResult !== null && (
                    <Alert 
                        severity={getPredictionMessage(predictionResult).severity} 
                        sx={{ mb: 3, fontSize: '1.1rem' }}
                    >
                        {getPredictionMessage(predictionResult).text}
                    </Alert>
                )}

                {error && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        
                        {/* Input Type (Dropdown) */}
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <TextField
                                select
                                fullWidth
                                label="Type"
                                name="Type"
                                value={formData.Type}
                                onChange={handleChange}
                                helperText="Pilih Tipe Kualitas"
                                variant="outlined"
                                required
                            >
                                {TypeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        
                        {/* Air Temperature (C) */}
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <TextField
                                fullWidth
                                label="Air Temperature (°C)"
                                name="Air_temperature_C"
                                value={formData.Air_temperature_C}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ step: '0.01' }}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        {/* Process Temperature (C) */}
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <TextField
                                fullWidth
                                label="Process Temperature (°C)"
                                name="Process_temperature_C"
                                value={formData.Process_temperature_C}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ step: '0.01' }}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        {/* Rotational Speed */}
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <TextField
                                fullWidth
                                label="Rotational Speed (rpm)"
                                name="Rotational_speed_rpm"
                                value={formData.Rotational_speed_rpm}
                                onChange={handleChange}
                                type="number"
                                variant="outlined"
                                required
                            />
                        </Grid>

                        {/* Torque */}
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <TextField
                                fullWidth
                                label="Torque (Nm)"
                                name="Torque_Nm"
                                value={formData.Torque_Nm}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ step: '0.1' }}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        {/* Tool Wear */}
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <TextField
                                fullWidth
                                label="Tool Wear (min)"
                                name="Tool_wear_min"
                                value={formData.Tool_wear_min}
                                onChange={handleChange}
                                type="number"
                                variant="outlined"
                                required
                            />
                        </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <StyledButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Memproses...' : 'Lakukan Prediksi'}
                    </StyledButton>
                </Box>
            </CardContent>
        </StyledCard>
    );
}

InputForm.propTypes = {
    // Properti ini dihapus karena state loading dan submit dipindahkan ke dalam komponen
};