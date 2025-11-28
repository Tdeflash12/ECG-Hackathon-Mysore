import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

/**
 * ECGChart
 * Simple, lightweight ECG-like waveform that uses Chart.js line chart.
 * Props: data = number[] | labels = string[]
 */
export default function ECGChart({ data = [], labels = [], height = 90 }) {
  // Ensure labels length matches data length. If not provided, use indexes.
  const safeLabels = useMemo(() => {
    if (labels && labels.length === data.length && labels.length > 0) return labels;
    return Array.from({ length: data.length }, (_, i) => i.toString());
  }, [data, labels]);

  const chartData = useMemo(() => ({
    labels: safeLabels,
    datasets: [
      {
        label: 'ECG',
        data: data || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.06)',
        pointRadius: 0,
        fill: true,
        tension: 0.15
      }
    ]
  }), [safeLabels, data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { display: false, min: Math.min(...(data.length ? data : [0])) - 5, max: Math.max(...(data.length ? data : [100])) + 5 },
      x: { display: false }
    },
    elements: { line: { borderWidth: 2 } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  }), [data]);

  return (
    <div style={{ width: '100%', height }} aria-hidden={false} aria-label="ECG waveform preview">
      <Line data={chartData} options={options} height={height} />
    </div>
  );
}

ECGChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number
};

ECGChart.defaultProps = {
  data: [],
  labels: [],
  height: 90
};
// End of file (cleaned up duplicate old ChartJS implementation)
