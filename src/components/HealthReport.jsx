import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// HealthReport: compute simple stats given an array of numeric BPM samples
export default function HealthReport({ samples = [] }) {
  const stats = useMemo(() => {
    if (!samples || samples.length === 0) return { count: 0, min: null, max: null, avg: null, last: null };
    const numeric = samples.map(s => Number(s)).filter(n => !Number.isNaN(n));
    const count = numeric.length;
    const min = Math.min(...numeric);
    const max = Math.max(...numeric);
    const sum = numeric.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / count);
    const last = numeric[numeric.length - 1];
    return { count, min, max, avg, last };
  }, [samples]);

  return (
    <div className="card p-3 shadow-sm" style={{ background: '#fff' }}>
      <h4 style={{ margin: 0 }}>Health Report</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 12 }}>
        <div>
          <div className="small text-muted">Last</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.last ?? '—'}</div>
        </div>
        <div>
          <div className="small text-muted">Avg</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.avg ?? '—'}</div>
        </div>
        <div>
          <div className="small text-muted">Min</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.min ?? '—'}</div>
        </div>
        <div>
          <div className="small text-muted">Max</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.max ?? '—'}</div>
        </div>
      </div>
      <div style={{ marginTop: 12 }} className="small text-muted">Samples: {stats.count}</div>
    </div>
  );
}

HealthReport.propTypes = {
  samples: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
};
