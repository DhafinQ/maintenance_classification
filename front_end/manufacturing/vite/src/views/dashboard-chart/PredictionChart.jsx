// src/Views/dashboard-chart/PredictionChart.jsx (BAR CHART - MENAMPILKAN LABEL 0/1)

import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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

    // Fungsi untuk mendapatkan warna berdasarkan label
    const getColors = (modelName) => {
        const label = predictions[modelName]?.label;
        return label === '1' ? '#FF4560' : '#00E396'; // Merah untuk Rusak (1), Hijau untuk Tidak Rusak (0)
    };

    const chartOptions = useMemo(
        () => ({
            chart: {
                type: 'bar',
                height: 300,
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    columnWidth: '80%',
                    borderRadius: 4
                }
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => {
                    // Tampilkan label teks di atas bar
                    return val === 1 ? 'RUSAK (1)' : 'TIDAK RUSAK (0)';
                },
                style: {
                    colors: ['#000', '#FFF']
                }
            },
            xaxis: {
                categories: modelNames,
                min: 0,
                max: 1,
                labels: { show: false }
            },
            yaxis: {
                labels: { style: { fontSize: '12px' } }
            },
            colors: modelNames.map(name => getColors(name)),
            legend: { show: false },
            tooltip: {
                y: {
                    formatter: (val) => (val === 1 ? 'Rusak' : 'Tidak Rusak')
                }
            }
        }),
        [modelNames, predictions]
    );

    const finalDecisionLabel = summary.final_decision === '1' ? 1 : 0;
    const title =
        finalDecisionLabel === 1 ? 'KEPUTUSAN AKHIR: RUSAK' : 'KEPUTUSAN AKHIR: TIDAK RUSAK';

    return (
        <Card raised>
            <CardContent>
                <Typography
                    variant="h5"
                    sx={{ color: finalDecisionLabel === 1 ? 'error.main' : 'success.main', mb: 1 }}
                >
                    {title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Keputusan Label Model Individu (0=Tidak Rusak, 1=Rusak)
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Chart options={chartOptions} series={series} type="bar" height={300} />
                </Box>
            </CardContent>
        </Card>
    );
}

PredictionChart.propTypes = { predictData: PropTypes.object };
