// src/Views/dashboard-chart/PredictionChart.jsx

import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';

// ==============================|| CHART 1 - PREDICTION LABEL (BAR HORIZONTAL) ||============================== //

export default function PredictionChart({ predictData }) {
    const predictions = predictData?.predictions || {};
    const summary = predictData?.summary || {};
    const modelNames = ['Logistic Regression', 'Random Forest', 'XGBoost'];

    // Data Series: 0 = Tidak Rusak, 1 = Rusak
    const seriesData = modelNames.map(name => {
        const label = predictions[name]?.label;
        return label === '1' ? 1 : 0; 
    });

    const series = [
        {
            name: 'Keputusan',
            data: seriesData
        }
    ];

    // Fungsi untuk mendapatkan warna BAR berdasarkan label
    const getBarColor = (modelName) => {
        const label = predictions[modelName]?.label;
        // Merah untuk Rusak (1), Hijau untuk Tidak Rusak (0)
        return label === '1' ? '#FF4560' : '#00E396'; 
    };

    const chartOptions = useMemo(
        () => ({
            chart: {
                type: 'bar',
                height: '100%', 
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    columnWidth: '80%',
                    borderRadius: 4,
                    dataLabels: {
                        position: 'center' 
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => {
                    // Tampilkan label teks di tengah bar
                    return val === 1 ? 'RUSAK (1)' : 'TIDAK RUSAK (0)';
                },
                style: {
                    // KITA GANTI WARNA TEKS MENJADI HITAM (#212121) AGAR KONTRAST DI ATAS BAR HIJAU CERAH.
                    // Teks di atas bar MERAH mungkin akan sedikit kurang kontras, tapi ini 
                    // adalah solusi paling aman tanpa rendering HTML yang gagal.
                    colors: ['#212121'], 
                    fontWeight: 600,
                    fontSize: '13px'
                },
                dropShadow: {
                    enabled: false, // Nonaktifkan Shadow agar teks tidak mengganggu
                }
            },
            xaxis: {
                categories: modelNames,
                // PERBAIKAN STABIL: Mengubah rentang min/max agar bar nilai 0 terlihat
                min: -0.1, 
                max: 1.1, 
                labels: { show: false }, 
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: { 
                    style: { 
                        fontSize: '13px',
                        fontWeight: 500,
                        colors: ['#212121'] 
                    } 
                }
            },
            // Warna bar tetap dinamis
            colors: modelNames.map(name => getBarColor(name)),
            legend: { show: false },
            tooltip: {
                y: {
                    formatter: (val) => (val === 1 ? 'Rusak' : 'Tidak Rusak')
                },
                shared: false
            },
            grid: {
                show: false, 
            }
        }),
        [modelNames, predictions]
    );

    const finalDecisionLabel = summary.final_decision === '1' ? 1 : 0;
    const title =
        finalDecisionLabel === 1 ? 'KEPUTUSAN AKHIR: RUSAK' : 'KEPUTUSAN AKHIR: TIDAK RUSAK';
    
    const titleColor = finalDecisionLabel === 1 ? '#FF4560' : '#00E396';

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}> 
            {/* Header Chart */}
            <h3 
                style={{ 
                    margin: 0, 
                    fontSize: '1.5rem', 
                    color: titleColor,
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}
            >
                {title}
            </h3>
            <p style={{ margin: '5px 0 15px 0', fontSize: '0.9rem', color: '#757575' }}>
                Keputusan Label Model Individu (0 = Tidak Rusak, 1 = Rusak)
            </p>

            {/* Container Chart */}
            <div style={{ flexGrow: 1, minHeight: '200px', height: 'calc(100% - 70px)' }}> 
                <Chart 
                    options={chartOptions} 
                    series={series} 
                    type="bar" 
                    height="100%" 
                />
            </div>
        </div>
    );
}

PredictionChart.propTypes = { predictData: PropTypes.object };