// src/views/sample-page/InputForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import file CSS baru Anda
import './InputForm.css'; 

// === DATA & OPSI ===
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

// === KOMPONEN UTAMA ===
export default function InputForm() {
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                throw new Error(`Field "${key.replace(/_/g, ' ')}" tidak boleh kosong.`);
            }
            const num = parseFloat(raw);
            if (!Number.isFinite(num)) throw new Error(`Field "${key.replace(/_/g, ' ')}" harus berupa angka valid.`);
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

        // 1. Ambil Token dari Local Storage
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Anda harus login untuk melakukan prediksi.');
            setIsLoading(false);
            // Opsional: Redirect ke halaman login jika tidak ada token
            // navigate('/pages/login', { replace: true }); 
            return;
        }

        try {
            // 2. Siapkan Headers dengan Token
            const headers = { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // <--- Tambahkan token di sini
            };

            const res = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                headers: headers, // Gunakan headers yang sudah termasuk token
                body: JSON.stringify(payload),
            });

            const text = await res.text();

            // 3. Handle Error 401 (Unauthorized)
            if (res.status === 401) {
                 localStorage.removeItem('accessToken');
                 localStorage.removeItem('username');
                 navigate('/pages/login', { replace: true });
                 return;
            }

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

            // Redirect ke dashboard setelah hasil diterima
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

    // Helper untuk membuat label
    const createLabel = (name) => {
        // Mengubah "Air_temperature_C" menjadi "Air Temperature (°C)"
        if (name.includes('_C')) {
            name = name.replace('_C', ' (°C)');
        }
        if (name.includes('_rpm')) {
            name = name.replace('_rpm', ' (rpm)');
        }
        if (name.includes('_Nm')) {
            name = name.replace('_Nm', ' (Nm)');
        }
        if (name.includes('_min')) {
            name = name.replace('_min', ' (min)');
        }
        return name.replace(/_/g, ' ');
    };


    return (
        <div className="form-card main-card-input"> {/* Menggunakan form-card DAN kelas baru untuk styling container */}
            <div className="form-content">
                <div className="form-header">
                    <h2 className="form-title">Input Data Mesin</h2>
                    <p className="form-subtitle">
                        Masukkan nilai pengukuran untuk mendapatkan prediksi kondisi mesin secara real-time
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="form-stack">
                    {/* Alert Hasil Prediksi */}
                    {predictionResult !== null && (
                        <div className={`alert alert-${getPredictionMessage(predictionResult).severity}`}>
                            {getPredictionMessage(predictionResult).text}
                        </div>
                    )}

                    {/* Alert Error */}
                    {error && <div className="alert alert-warning">{error}</div>}

                    {/* Input Type (Dropdown) */}
                    <div className="input-group">
                        <label htmlFor="Type" className="input-label">Type</label>
                        <select
                            id="Type"
                            name="Type"
                            value={formData.Type}
                            onChange={handleChange}
                            className="form-input select-input"
                        >
                            {TypeOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Input Lainnya */}
                    {Object.keys(initialFormData).slice(1).map((key) => (
                        <div className="input-group" key={key}>
                            <label htmlFor={key} className="input-label">
                                {createLabel(key)}
                            </label>
                            <input
                                id={key}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                type="number"
                                step={key === 'Air_temperature_C' || key === 'Process_temperature_C' ? '0.01' : (key === 'Torque_Nm' ? '0.1' : '1')}
                                className="form-input"
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className={`styled-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Memproses...
                            </>
                        ) : (
                            <>
                                Lakukan Prediksi
                                <span className="send-icon">→</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}