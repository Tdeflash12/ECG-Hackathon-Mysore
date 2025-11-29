import { useState, useEffect, useRef } from 'react';
import SerialReader from '../components/SerialReader';
import FileImporter from '../components/FileImporter';
import BackendPoller from '../components/BackendPoller';
import ECGChart from '../components/ECGChart';
import HealthReport from '../components/HealthReport';

export default function Dashboard() {
  const [reading, setReading] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [heartbeat, setHeartbeat] = useState(false);
  const [samples, setSamples] = useState([]);
  const [logging, setLogging] = useState(true);
  const samplesRef = useRef([]);
  const [bpmHistory, setBpmHistory] = useState([]);
  const bpmHistoryRef = useRef([]);
  const MAX_SAMPLES = 256;
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [importedImage, setImportedImage] = useState(null);

  async function analyze(value) {
    const num = Number(value);
    const hasValid = (!Number.isNaN(num) && num > 0);
    setReading(hasValid ? num : '');
    // NOTE: ignore BPM for waveform; waveform is built from `ecgSample` events
    // BPM numbers only update the readout and heartbeat animation.

    // store recent BPMs for quick list
    if (hasValid) {
      bpmHistoryRef.current = [...bpmHistoryRef.current, num].slice(-50);
      setBpmHistory(bpmHistoryRef.current);
    }

    // Flash heart for animation
    setHeartbeat(true);
    setTimeout(() => setHeartbeat(false), 200);

    // 🔮 ML model integration placeholder
    // const res = await fetch('/api/predict', {...});
    // const data = await res.json();
    // setPrediction(data.prediction);
  }

  useEffect(() => {
    function onConnect() { setDeviceConnected(true); }
    function onDisconnect() { setDeviceConnected(false); }
    function onSimStart() { setIsSimulating(true); }
    function onSimStop() { setIsSimulating(false); }
    window.addEventListener('deviceConnected', onConnect);
    window.addEventListener('deviceDisconnected', onDisconnect);
    window.addEventListener('simulationStarted', onSimStart);
    window.addEventListener('simulationStopped', onSimStop);
    return () => { window.removeEventListener('deviceConnected', onConnect); window.removeEventListener('deviceDisconnected', onDisconnect); window.removeEventListener('simulationStarted', onSimStart); window.removeEventListener('simulationStopped', onSimStop); };
  }, []);

  // Listen to global 'reading' events (dispatched by SerialReader or BackendPoller)
  useEffect(() => {
    function onReading(ev) {
      const bpm = ev?.detail?.bpm;
      if (typeof bpm === 'number') analyze(bpm);
    }
    window.addEventListener('reading', onReading);
    return () => window.removeEventListener('reading', onReading);
  }, [logging]);

  // Listen to global 'ecgSample' events to build the waveform buffer
  useEffect(() => {
    function onEcg(ev) {
      const v = ev?.detail?.value;
      if (typeof v === 'number' && logging) {
        samplesRef.current = [...samplesRef.current, v].slice(-MAX_SAMPLES);
        setSamples(samplesRef.current);
      }
    }
    window.addEventListener('ecgSample', onEcg);
    return () => window.removeEventListener('ecgSample', onEcg);
  }, [logging]);

  // Handle imported samples (CSV) to append to waveform buffer
  function handleImportedSamples(vals) {
    if (!vals || !Array.isArray(vals)) return;
    // convert to numbers and append
    samplesRef.current = [...samplesRef.current, ...vals].slice(-MAX_SAMPLES);
    setSamples(samplesRef.current);
  }

  function handleImportedImage(url) {
    setImportedImage(url);
  }

  // Example: color-coded prediction
  const predictionColor =
    prediction === 'High Risk'
      ? '#fee2e2' // red
      : prediction === 'Moderate Risk'
      ? '#fef3c7' // yellow
      : '#d1fae5'; // green

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#dc2626',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#dc2626',
            animation: heartbeat ? 'pulse 0.3s ease-out' : 'none',
          }}
        ></span>
        Live Heart Monitoring
      </h1>

      {/* Card for current reading */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', color: '#dc2626', marginBottom: '1rem' }}>
          Current Reading
        </h2>
        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827' }}>
          {reading || '---'}
        </p>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>BPM / Sensor Value</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
        {/* Left: Live waveform and controls */}
        <div>
          <div className="card p-3 shadow-sm" style={{ background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, color: '#dc2626' }}>Live ECG</h3>
                <div className="small text-muted">Real-time waveform from incoming sensor</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className={`btn btn-${logging ? 'outline-danger' : 'primary'}`} onClick={() => setLogging(l => !l)}>{logging ? 'Stop logging' : 'Start logging'}</button>
                <button className="btn btn-outline-secondary" onClick={() => {
                  // Export buffered samples to CSV
                  if (!samplesRef.current || !samplesRef.current.length) return;
                  const csv = ['time,bpm', ...samplesRef.current.map((s, i) => `${i},${s}`)].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'mycardio-samples.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                }}>Export CSV</button>
                <button className="btn btn-outline-secondary" onClick={() => {
                  // Toggle global simulation
                  if (isSimulating) window.dispatchEvent(new CustomEvent('stopSimulation')); else window.dispatchEvent(new CustomEvent('startSimulation'));
                }}>{isSimulating ? 'Stop Simulation' : 'Simulate'}</button>
                <button className="btn btn-outline-secondary" onClick={() => { samplesRef.current = []; setSamples([]); }}>Clear</button>
                <FileImporter onSamples={handleImportedSamples} onImage={handleImportedImage} />
              </div>
            </div>
            <div style={{ marginTop: 12, height: 180 }}>
              <ECGChart data={samples} height={160} />
              {importedImage && (
                <div style={{ marginTop: 8, textAlign: 'center' }}>
                  <div className="small text-muted">Imported Image Preview</div>
                  <img src={importedImage} alt="Imported" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, marginTop: 8 }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="card p-3 shadow-sm" style={{ background: '#fff' }}>
              <h4 style={{ margin: 0 }}>Alerts</h4>
                <div style={{ marginTop: 8 }}>
                  {(() => {
                    const last = Number(reading);
                    if (Number.isNaN(last)) return <div className="text-muted small">No numeric reading yet.</div>;
                    if (last < 50) return (
                      <div className="alert alert-danger p-2">
                        <div>Bradycardia detected ({last} BPM)</div>
                        <div className="small text-muted mt-1">Precautions: Sit/lie down, avoid exertion, monitor symptoms. If fainting, dizziness, or chest pain occur, seek emergency care.</div>
                      </div>
                    );
                    if (last > 120) return (
                      <div className="alert alert-danger p-2">
                        <div>High BPM detected ({last} BPM)</div>
                        <div className="small text-muted mt-1">Precautions: Stop activity, sit calmly and breathe deeply. If chest pain, shortness of breath, or syncope happen, seek emergency care immediately.</div>
                      </div>
                    );
                    if (last > 100) return (
                      <div className="alert alert-warning p-2">
                        <div>Tachycardia (mild) ({last} BPM)</div>
                        <div className="small text-muted mt-1">Precautions: Rest, hydration, deep breathing. Consider medical review if sustained or with symptoms.</div>
                      </div>
                    );
                    return <div className="alert alert-success p-2">HR normal ({last} BPM)</div>;
                  })()}
                </div>
            </div>
          </div>
        </div>

        {/* Right: Health summary and backend controls */}
        <div style={{ display: 'grid', gap: 12 }}>
          <HealthReport samples={samples} />
          <div className="card p-3 shadow-sm" style={{ background: '#fff' }}>
            <h4 style={{ margin: 0 }}>Recent readings</h4>
            <div style={{ marginTop: 8 }}>
              {bpmHistory.slice(-10).reverse().map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #f1f5f9' }}>
                  <div style={{ fontWeight: 600 }}>{s} BPM</div>
                  <div className="small text-muted">{i === 0 ? 'now' : `${i * 1}s ago`}</div>
                </div>
              ))}
              {samples.length === 0 && <div className="small text-muted">No readings yet</div>}
            </div>
          </div>
          <div className="card p-3 shadow-sm" style={{ background: '#fff' }}>
            <h4 style={{ margin: 0 }}>Detected Diseases</h4>
            <div style={{ marginTop: 8 }}>
              {(() => {
                const last = Number(reading);
                if (Number.isNaN(last)) return <div className="small text-muted">No data yet</div>;
                // Show myocardial disease warning if < 60 or > 130
                if (last < 60) {
                  return (
                    <div>
                      <div className="text-danger small fw-bold">Possible myocardial disease (Low BPM: {last} BPM)</div>
                      <div className="small text-muted">Precautions: Sit/lie down, avoid exertion. Monitor symptoms and consider clinical evaluation if symptomatic.</div>
                    </div>
                  );
                }
                if (last > 130) {
                  return (
                    <div>
                      <div className="text-danger small fw-bold">Possible myocardial disease (High BPM: {last} BPM)</div>
                      <div className="small text-muted">Precautions: Stop activity, rest, and seek emergency care if chest pain, dizziness, or severe symptoms occur.</div>
                    </div>
                  );
                }
                return <div className="small text-muted">No diseases detected</div>;
              })()}
            </div>
          </div>
          <div className="card p-3 shadow-sm" style={{ background: '#fff' }}>
            <h4 style={{ margin: 0 }}>Device & Backend</h4>
            <div style={{ marginTop: 8 }}>
              <div className="small text-muted">Backend Poller</div>
              <div style={{ marginTop: 6 }}><BackendPoller interval={1200} url="http://localhost:5000/api/sensor" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* ML Prediction Card */}
      <div
        style={{
          backgroundColor: predictionColor,
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
          ML Prediction
        </h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
          {deviceConnected ? 'Model connected (P0RT)' : (prediction || 'Model not connected yet')}
        </p>
        <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          Risk assessment based on live readings.
        </p>
      </div>

      {/* SerialReader */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
      >
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#dc2626', marginBottom: '1rem' }}>
          Serial Input
        </h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <SerialReader onData={analyze} />
          </div>
          <div style={{ minWidth: 220, textAlign: 'right' }}>
            <BackendPoller interval={1200} url="http://localhost:5000/api/sensor" />
              <div style={{ marginTop: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 6, background: isSimulating ? '#f59e0b' : (deviceConnected ? '#16a34a' : '#e5e7eb') }} aria-hidden></span>
                  <span className="small text-muted">{isSimulating ? 'Simulating' : (deviceConnected ? 'Arduino connected' : 'Not connected')}</span>
                </span>
              </div>
          </div>
        </div>
      </div>

      {/* Heartbeat animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
