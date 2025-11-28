import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function HealthReport({ maxSamples = 60 }) {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    function onReading(e) {
      const { bpm, timestamp } = e?.detail || {};
      if (typeof bpm !== 'number') return;
      setReadings(prev => {
        const next = prev.concat({ bpm, timestamp });
        if (next.length > maxSamples) return next.slice(next.length - maxSamples);
        return next;
      });
    }
    window.addEventListener('reading', onReading);
    return () => window.removeEventListener('reading', onReading);
  }, [maxSamples]);

  // Derived stats
  const stats = useMemo(() => {
    if (!readings.length) return { avg: 0, min: 0, max: 0, counts: { brady: 0, normal: 0, tachy: 0 } };
    const values = readings.map(r => r.bpm);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const counts = values.reduce(
      (acc, v) => {
        if (v < 60) acc.brady++;
        else if (v > 100) acc.tachy++;
        else acc.normal++;
        return acc;
      },
      { brady: 0, normal: 0, tachy: 0 }
    );
    return { avg, min, max, counts };
  }, [readings]);

  const chartData = useMemo(() => ({
    labels: readings.map(r => new Date(r.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'BPM',
        data: readings.map(r => r.bpm),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.06)',
        tension: 0.25,
        pointRadius: 0,
      },
    ],
  }), [readings]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: true, grid: { display: false } }, y: { display: true } },
    plugins: { legend: { display: false } },
  }), []);

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', width: '100%' }}>
      <div style={{ flex: 1, backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0, color: '#dc2626' }}>Health Report</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{stats.avg || '—'} BPM</div>
            <div style={{ color: '#6b7280' }}>Average (last {readings.length || 0})</div>
          </div>
          <div style={{ minWidth: 200, height: 90 }}>
            <Line data={chartData} options={options} height={90} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: 8 }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Min</div>
            <div style={{ fontWeight: 700, color: '#111827' }}>{stats.min || '—'}</div>
          </div>
          <div style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: 8 }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Max</div>
            <div style={{ fontWeight: 700, color: '#111827' }}>{stats.max || '—'}</div>
          </div>
          <div style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: 8 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Brady/Normal/Tachy</span>
            </div>
            <div style={{ fontWeight: 700, color: '#111827' }}>{stats.counts.brady}/{stats.counts.normal}/{stats.counts.tachy}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

HealthReport.propTypes = {
  maxSamples: PropTypes.number,
};

HealthReport.defaultProps = {
  maxSamples: 60,
};
