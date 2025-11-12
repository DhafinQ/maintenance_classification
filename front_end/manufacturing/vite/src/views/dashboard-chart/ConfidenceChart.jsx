// src/Views/dashboard-chart/ConfidenceChart.jsx

import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';

// ==============================|| STACKED COLUMN CHART - CONFIDENCE ||============================== //

export default function ConfidenceChart({ predictData }) {
    const predictions = predictData?.predictions || {};
    const modelNames = ['Logistic Regression', 'Random Forest', 'XGBoost'];

    // Hitung Confidence tiap kelas
    const data = useMemo(() => {
        const conf0 = []; // Label 0 => Tidak Rusak (Hijau)
        const conf1 = []; // Label 1 => Rusak (Merah)

        modelNames.forEach(name => {
            const pred = predictions[name];
            if (pred) {
                const conf = pred.confidence;
                const label = pred.label;
                
                // Logika universal: memastikan confidence tertinggi masuk ke series yang benar
                // Confidence sudah dinormalisasi antara 0 dan 1 di backend (asumsi)
                if (label === '0') {
                    // Jika prediksi '0' (Tidak Rusak): Conf utama masuk ke conf0 (Hijau)
                    conf0.push(parseFloat((conf * 100).toFixed(2)));       
                    conf1.push(parseFloat(((1 - conf) * 100).toFixed(2))); 
                } else {
                    // Jika prediksi '1' (Rusak): Conf utama masuk ke conf1 (Merah)
                    conf0.push(parseFloat(((1 - conf) * 100).toFixed(2))); 
                    conf1.push(parseFloat((conf * 100).toFixed(2)));       
                }
            } else {
                conf0.push(0);
                conf1.push(0);
            }
        });

        // Urutan Series: Merah (Index 0) dulu, diikuti Hijau (Index 1).
        // Ini sinkron dengan colors: ['#FF4560', '#00E396']
        return [
            { name: 'Confidence Rusak (Label 1)', data: conf1 },          
            { name: 'Confidence Tidak Rusak (Label 0)', data: conf0 },    
        ];
    }, [predictions, modelNames]);

    const avgConfidence =
        modelNames.reduce((sum, name) => sum + (predictions[name]?.confidence * 100 || 0), 0) /
        modelNames.length;

    const chartOptions = useMemo(() => ({
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                // **PENYEMPURNAAN: Menjadikan Stacked 100% eksplisit**
                stackType: '100%' 
            },
        },
        xaxis: {
            categories: modelNames,
            title: { text: 'Model Klasifikasi' },
            labels: { style: { colors: '#212121' } }
        },
        yaxis: {
            title: { text: 'Confidence (%)' },
            max: 100, // Penting untuk 100% stacked chart
            labels: { 
                style: { colors: '#212121' },
                // Tambahkan tanda % pada label Y axis
                formatter: (val) => `${val.toFixed(0)} %`
            }
        },
        legend: {
            position: 'bottom', 
            horizontalAlign: 'center',
            itemMargin: { horizontal: 10, vertical: 5 }
        },
        tooltip: {
            y: {
                // Formatting tooltip
                formatter: val => `${parseFloat(val).toFixed(2)} %`,
            },
        },
        fill: { opacity: 1 },
        colors: ['#FF4560', '#00E396'], // Merah, Hijau
        grid: {
            show: true,
            borderColor: '#f0f0f0'
        },
        // **PERBAIKAN: Mengaktifkan Data Labels dan memformatnya**
        dataLabels: {
            enabled: true,
            // Hanya tampilkan label untuk series yang memiliki confidence tertinggi
            formatter: function (val, opts) {
                // Memastikan label hanya muncul di series dengan confidence > 50%
                if (val > 50) {
                    return `${parseFloat(val).toFixed(0)}%`;
                }
                return '';
            },
            style: {
                colors: ['#FFFFFF'], // Gunakan warna putih untuk kontras
                fontWeight: 600,
                fontSize: '11px'
            }
        }
    }), [modelNames]);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}> 
            {/* Header Chart */}
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#212121' }}>
                Tingkat Kepercayaan Model
            </h3>
            <p style={{ margin: '5px 0 15px 0', fontSize: '0.9rem', color: '#757575' }}>
                Proporsi Keyakinan per Kelas (0 = Tidak Rusak, 1 = Rusak). Rata-rata confidence: {avgConfidence.toFixed(2)}%
            </p>

            {/* Container Chart */}
            <div 
                style={{ 
                    flexGrow: 1, 
                    minHeight: '280px', 
                    height: 'calc(100% - 70px)' 
                }}
            > 
                <Chart 
                    options={chartOptions} 
                    series={data} 
                    type="bar" 
                    height="100%" 
                />
            </div>
        </div>
    );
}

ConfidenceChart.propTypes = {
    predictData: PropTypes.object,
};