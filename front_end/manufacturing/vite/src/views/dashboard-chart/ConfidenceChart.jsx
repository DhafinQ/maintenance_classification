// ==============================|| STACKED COLUMN CHART - CONFIDENCE ||============================== //

import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Chart from 'react-apexcharts';

export default function ConfidenceChart({ predictData }) {
  const predictions = predictData?.predictions || {};
  const modelNames = ['Logistic Regression', 'Random Forest', 'XGBoost'];

  // Hitung Confidence tiap kelas
  const data = useMemo(() => {
    const conf0 = []; // Label 0 => Tidak Rusak
    const conf1 = []; // Label 1 => Rusak

    modelNames.forEach(name => {
      const pred = predictions[name];
      if (pred) {
        const conf = pred.confidence;
        const label = pred.label;

        if (label === '0') {
          // confidence untuk kelas 0 (Tidak Rusak) = conf
          conf0.push(parseFloat((conf * 100).toFixed(2)));
          conf1.push(parseFloat(((1 - conf) * 100).toFixed(2)));
        } else {
          // label === '1'
          conf0.push(parseFloat(((1 - conf) * 100).toFixed(2)));
          conf1.push(parseFloat((conf * 100).toFixed(2)));
        }
      } else {
        conf0.push(0);
        conf1.push(0);
      }
    });

    return [
      { name: 'Confidence Tidak Rusak (Label 0)', data: conf0 },
      { name: 'Confidence Rusak (Label 1)', data: conf1 },
    ];
  }, [predictions, modelNames]);

  const avgConfidence =
    modelNames.reduce((sum, name) => sum + (predictions[name]?.confidence * 100 || 0), 0) /
    modelNames.length;

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      stacked: true,
      height: '100%',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: modelNames,
      title: { text: 'Model Klasifikasi' },
    },
    yaxis: {
      title: { text: 'Confidence (%)' },
      max: 100,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
    tooltip: {
      y: {
        formatter: val => `${parseFloat(val).toFixed(2)} %`,
      },
    },
    fill: { opacity: 1 },
    // Urutan warna disesuaikan: hijau untuk Label 0 (Tidak Rusak), merah untuk Label 1 (Rusak)
    colors: ['#00E396', '#FF4560'],
  }), [modelNames]);

  return (
    <Card raised sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom>
          Tingkat Kepercayaan Model
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Proporsi Keyakinan per Kelas (0 = Tidak Rusak, 1 = Rusak). Rata-rata confidence: {avgConfidence.toFixed(2)}%
        </Typography>

        <Box sx={{ mt: 2, flexGrow: 1, minHeight: 0 }}>
          <Chart options={chartOptions} series={data} type="bar" height="100%" />
        </Box>
      </CardContent>
    </Card>
  );
}

ConfidenceChart.propTypes = {
  predictData: PropTypes.object,
};
