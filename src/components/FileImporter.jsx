import React, { useState } from 'react';

export default function FileImporter({ onSamples, onImage }) {
  const [filename, setFilename] = useState(null);
  const [error, setError] = useState(null);

  function reset() {
    setFilename(null);
    setError(null);
    if (onImage) onImage(null);
    if (onSamples) onSamples(null);
  }

  async function onFileChange(e) {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    setFilename(f.name);
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      if (onImage) onImage(url);
      // keep filename, but do not parse
      return;
    }
    // try parse csv/text
    try {
      const text = await f.text();
      // handle csv: split lines, parse first column as numeric
      const rows = text.split(/\r?\n/).map(r => r.trim()).filter(Boolean);
      const vals = [];
      for (const row of rows) {
        const cols = row.split(/,|\t/).map(c => c.trim());
        const v = Number(cols[0]);
        if (!Number.isNaN(v)) vals.push(v);
      }
      if (!vals.length) {
        setError('No numeric values found in CSV file');
        return;
      }
      if (onSamples) onSamples(vals);
    } catch (err) {
      setError(String(err?.message || err));
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label className="btn btn-outline-secondary btn-sm" style={{ padding: '6px 10px', cursor: 'pointer' }}>
        Import File
        <input type="file" accept=".csv,image/*" onChange={onFileChange} style={{ display: 'none' }} />
      </label>
      {filename && <span className="small text-muted">{filename}</span>}
      {error && <div className="small text-danger">{error}</div>}
      <button className="btn btn-outline-secondary btn-sm" onClick={reset}>Clear</button>
    </div>
  );
}
