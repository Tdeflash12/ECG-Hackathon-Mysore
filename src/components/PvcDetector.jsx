import { useEffect, useRef } from 'react';

// Simple PVC detector listening to global ecgSample events.
// Emits CustomEvent 'pvcDetected' with detail { timestamp, rr, prevRR, value }
// and 'pvcCount' with detail { count, timestamp }

export default function PvcDetector() {
  const lastValue = useRef(null);
  const prevValue = useRef(null);
  const lastPeakTs = useRef(null);
  const rrHistory = useRef([]);
  const pvcCount = useRef(0);
  const sampleWindow = useRef([]);

  useEffect(() => {
    function onEcg(ev) {
      try {
        const v = ev?.detail?.value;
        const ts = ev?.detail?.timestamp || Date.now();
        if (typeof v !== 'number') return;

        // maintain a running window for mean/std
        sampleWindow.current.push(v);
        if (sampleWindow.current.length > 40) sampleWindow.current.shift();
        const mean = sampleWindow.current.reduce((a, b) => a + b, 0) / (sampleWindow.current.length || 1);
        const variance = sampleWindow.current.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (sampleWindow.current.length || 1);
        const std = Math.sqrt(variance || 0);

        // detect local maxima using last two values (prevValue, lastValue, current)
        if (prevValue.current !== null && lastValue.current !== null) {
          const a = prevValue.current;
          const b = lastValue.current;
          const c = v;
          // b is local max if b > a and b >= c
          const isPeak = b > a && b >= c && b > mean + Math.max(std * 0.8, 8);
          if (isPeak) {
            // determine timestamp for the peak (we'll approximate by using ts - small delta)
            const peakTs = ts - 6; // assumptive small lag
            if (lastPeakTs.current) {
              const rr = peakTs - lastPeakTs.current; // ms
              if (rr > 100) { // ignore extremely short
                // store rr
                rrHistory.current.push(rr);
                if (rrHistory.current.length > 10) rrHistory.current.shift();
                // compute avg and previous rr
                const avg = rrHistory.current.reduce((s, x) => s + x, 0) / rrHistory.current.length;
                const prevRR = rrHistory.current.length > 1 ? rrHistory.current[rrHistory.current.length - 2] : avg;
                // Detect PVC: beat occurs early relative to average RR or previous RR
                // threshold: rr < 0.7 * avg AND rr < prevRR * 0.85
                if (avg > 0 && (rr < avg * 0.7 || (prevRR && rr < prevRR * 0.85))) {
                  pvcCount.current++;
                  // dispatch events
                  const detail = { timestamp: peakTs, rr, prevRR, value: b };
                  window.dispatchEvent(new CustomEvent('pvcDetected', { detail }));
                  window.dispatchEvent(new CustomEvent('pvcCount', { detail: { count: pvcCount.current, timestamp: Date.now() } }));
                }
              }
            }
            lastPeakTs.current = peakTs;
          }
        }

        // rotate values
        prevValue.current = lastValue.current;
        lastValue.current = v;
      } catch (e) {
        // noop
      }
    }
    window.addEventListener('ecgSample', onEcg);
    return () => window.removeEventListener('ecgSample', onEcg);
  }, []);

  return null;
}
