import React, { useEffect, useState } from 'react';

export default function BackendPoller({ interval = 1000, url = '/api/sensor' }) {
  const [last, setLast] = useState(null);

  useEffect(() => {
    let mounted = true;
    let t = null;
    async function fetchOnce() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!mounted) return;
        setLast(data);
        // Dispatch events
        if (typeof data.bpm === 'number' && data.bpm > 0) {
          try { window.dispatchEvent(new CustomEvent('reading', { detail: { bpm: data.bpm, timestamp: Date.now() } })); } catch (e) { void e; }
        }
        if (typeof data.raw === 'number') {
          try { window.dispatchEvent(new CustomEvent('ecgSample', { detail: { value: data.raw, timestamp: Date.now() } })); } catch (e) { void e; }
        }
        if (data.pvcCount && typeof data.pvcCount === 'number') {
          try { window.dispatchEvent(new CustomEvent('pvcCount', { detail: { count: data.pvcCount, timestamp: Date.now() } })); } catch (e) { void e; }
        }
      } catch (e) {
        // ignore network errors here; backend may be down
      }
    }
    // initial fetch
    fetchOnce();
    t = setInterval(fetchOnce, interval);
    return () => { mounted = false; if (t) clearInterval(t); };
  }, [interval, url]);

  return (
    <div className="small text-muted">Backend Poll: {last ? `${last.bpm || '-'} BPM` : 'idle'}</div>
  );
}
