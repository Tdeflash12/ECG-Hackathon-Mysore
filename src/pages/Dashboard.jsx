import React, { useState } from 'react';
import LivePreview from '../components/LivePreview';
import SerialReader from '../components/SerialReader';
import HealthReport from '../components/HealthReport';

export default function Dashboard() {
  const [reading, setReading] = useState('');
  const [prediction] = useState(null);
  const [heartbeat, setHeartbeat] = useState(false);

  async function analyze(value) {
    setReading(value);
    const bpm = Number(value);
    if (!Number.isNaN(bpm)) {
      try {
        window.dispatchEvent(new CustomEvent('reading', { detail: { bpm, timestamp: Date.now() } }));
      } catch {
        // ignore
      }
    }

    // Flash heart for animation
    setHeartbeat(true);
    setTimeout(() => setHeartbeat(false), 200);
  }

  const predictionColor =
    prediction === 'High Risk' ? '#fee2e2' : prediction === 'Moderate Risk' ? '#fef3c7' : '#d1fae5';

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, Arial, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.25rem', color: '#dc2626', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ display: 'inline-block', width: 22, height: 22, borderRadius: 999, backgroundColor: '#dc2626', transform: heartbeat ? 'scale(1.6)' : 'scale(1)', transition: 'transform 0.35s' }} />
        Live Heart Monitoring
      </h1>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Simulate controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
          <select id="simulateCase" defaultValue="normal" style={{ padding: '6px 8px', borderRadius: 6 }}>
            <option value="normal">Normal (70)</option>
            <option value="tachy">Tachycardia (130)</option>
            <option value="brady">Bradycardia (45)</option>
            <option value="very-high">Very high (170)</option>
          </select>
          <button onClick={() => {
            const sel = document.getElementById('simulateCase')?.value || 'normal';
            const mapping = { normal: 70, tachy: 130, brady: 45, 'very-high': 170 };
            const bpm = mapping[sel] || 70;
            window.dispatchEvent(new CustomEvent('simulateCase', { detail: { bpm } }));
            // also dispatch a reading so other components update
            try { window.dispatchEvent(new CustomEvent('reading', { detail: { bpm, timestamp: Date.now() } })); } catch (err) { void err; }
          }} style={{ padding: '6px 10px', borderRadius: 6, backgroundColor: '#ef4444', color: '#ffffff', border: 'none' }}>Simulate</button>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', backgroundColor: '#fff', padding: '1.75rem', borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#dc2626', marginBottom: 6 }}>Current Reading</h2>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: '#111827' }}>{reading || '---'}</div>
          <div style={{ color: '#6b7280', marginTop: 6 }}>BPM / Sensor Value</div>
        </div>

        <div style={{ backgroundColor: predictionColor, padding: '1rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#dc2626' }}>ML Prediction</h3>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>{prediction || 'Model not connected yet'}</div>
          <div style={{ color: '#6b7280', marginTop: 6, fontSize: '0.85rem' }}>Risk assessment based on live readings.</div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', backgroundColor: '#fff', padding: '1rem', borderRadius: 12, boxShadow: '0 4px 10px rgba(0,0,0,0.04)', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#dc2626' }}>Serial Input</h3>
            <SerialReader onData={analyze} />
          </div>
          <div style={{ width: 320 }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#dc2626' }}>Live Preview</h3>
            <LivePreview bpm={Number(reading) || 70} />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <HealthReport maxSamples={60} />
        </div>
      </div>
    </div>
  );
}
// end of file  