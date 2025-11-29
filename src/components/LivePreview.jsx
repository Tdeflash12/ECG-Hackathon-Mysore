import React, { useEffect, useRef, useState } from 'react';
import ECGChart from './ECGChart';

// Simple animated ECG-like preview using SVG path animation
export default function LivePreview({ bpm = 68 }) {
  const pathRef = useRef(null);
  const [value, setValue] = useState(bpm);
  const [waveform, setWaveform] = useState(() => Array.from({ length: 60 }, () => 20 + Math.random() * 10));

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    // animate strokeDashoffset to mock live movement
    let start = Date.now();
    let raf = null;
    function frame() {
      const now = Date.now();
      const t = ((now - start) / 600) % 1; // loop
      if (p) p.style.strokeDashoffset = String(Math.floor(t * 200));
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    setValue(bpm);
  }, [bpm]);

  useEffect(() => {
    function onSim(e) {
      const p = e?.detail?.bpm;
      if (p) setValue(p);
    }
    window.addEventListener('simulateCase', onSim);
    function onReading(e) {
      const p = e?.detail?.bpm;
      if (typeof p === 'number' && p > 0) setValue(p);
    }
    window.addEventListener('reading', onReading);
    return () => {
      window.removeEventListener('simulateCase', onSim);
      window.removeEventListener('reading', onReading);
    };
  }, []);

  // Update a fake waveform based on bpm to show activity in ECGChart.
  useEffect(() => {
    const id = setInterval(() => {
      const next = waveform.slice(1);
      const noise = Math.sin(Date.now() / 200) * 6 + (Math.random() - 0.5) * 2;
      next.push(30 + (value % 30) + noise);
      setWaveform(next);
    }, 120);
    return () => clearInterval(id);
  }, [value, waveform]);

  return (
    <div className="d-flex align-items-center" style={{ gap: '1rem', width: '100%', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="200" height="48" viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path ref={pathRef} stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" d="M0 24 L20 24 L28 24 L32 16 L40 40 L56 8 L64 24 L76 24 L100 24 L120 24 L130 24 L138 16 L150 40 L170 8 L190 24 L200 24" />
          </svg>
            <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{value}</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>BPM (Live preview)</div>
          </div>
        </div>
      </div>
      <div style={{ width: 200, textAlign: 'right', color: '#6b7280' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>Edge Mode</div>
        <div style={{ marginTop: '0.25rem' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" defaultChecked style={{ width: 18, height: 18 }} />
            <span style={{ color: '#475569', fontSize: '0.85rem' }}>Local inference</span>
          </label>
        </div>
      </div>
      <div style={{ width: 260, marginLeft: 8 }}>
        <ECGChart data={waveform} />
      </div>
    </div>
  );
}
