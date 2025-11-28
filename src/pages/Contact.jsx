import { useState, useMemo } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [projectType, setProjectType] = useState('prototype');
  const [file, setFile] = useState(null);
  const [subscribe, setSubscribe] = useState(true);

  function validateEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!name || !email || !message) {
      return window.alert('Please fill out all fields');
    }
    if (!validateEmail(email)) {
      return window.alert('Please use a valid email address');
    }
    // Try to send details to backend endpoint, fallback to mock behavior if offline
    setSent(true);
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, projectType })
    })
      .then((res) => res.json())
      .then((data) => {
        window.alert(data?.message || 'Thanks — your message has been sent (mock)');
        setName(''); setEmail(''); setMessage('');
      })
      .catch(() => {
        window.alert('Network unavailable — saved locally (mock)');
      })
      .finally(() => setSent(false));
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
  }

  const sampleDataUrl = useMemo(() => {
    const csv = 'time,bpm\n0,72\n1,75\n2,70\n3,69\n4,80\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    return URL.createObjectURL(blob);
  }, []);

  return (
    <div className="container py-4" style={{ fontFamily: 'Inter, Arial, sans-serif', minHeight: '100vh' }}>
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: '#111827' }}>Contact MyCardio</h1>
        <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
          We'd love to hear from you — questions, demo requests, feedback, or partnership ideas. Fill out the form and we’ll
          get back to you shortly.
        </p>

        <div className="row gx-3 gy-3" style={{ marginTop: '1.5rem' }}>
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              </div>
              <div className="col-12">
                <label className="form-label">Project Type</label>
                <select className="form-select" value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                  <option value="prototype">Prototype / Demo</option>
                  <option value="research">Research / Academia</option>
                  <option value="medical">Medical / Clinical</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Attach sample data (optional)</label>
                <input className="form-control" type="file" onChange={handleFileChange} />
                {file && <div className="form-text">Selected: {file.name}</div>}
              </div>
              <div className="col-12">
                <label className="form-label">Message</label>
                <textarea className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your use case…" style={{ minHeight: '140px' }} />
              </div>
              <div className="col-12 d-flex align-items-center">
                <button className="btn btn-danger" type="submit" disabled={sent}>{sent ? 'Sending…' : 'Send Message'}</button>
                <button className="btn btn-outline-secondary ms-2" type="button" onClick={() => { setName(''); setEmail(''); setMessage(''); }}>Reset</button>
                <div className="form-check ms-auto">
                  <input className="form-check-input" type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} id="subscribeCheck" />
                  <label className="form-check-label" htmlFor="subscribeCheck">Subscribe to updates</label>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-4">
            <aside className="card p-3 shadow-sm">
            <h3 style={{ marginTop: 0, color: '#0f172a' }}>Contact Info</h3>
            <p style={{ color: '#475569', marginBottom: '0.5rem' }}>
              Email: <a href="mailto:team@mycardio.local">team@mycardio.local</a>
            </p>
            <p style={{ color: '#475569', marginBottom: '0.5rem' }}>Support: +1 (555) 010-0123</p>
            <p style={{ color: '#475569' }}>We normally respond within one business day.</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
              <a href={sampleDataUrl} download="mycardio-sample.csv" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '0.5rem 0.7rem' }}>Download sample data</a>
              <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={() => window.dispatchEvent(new CustomEvent('openDemo'))}>Schedule demo</button>
            </div>
            <div style={{ marginTop: 8 }}>
              <button className="btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}>Chat with us</button>
            </div>

            <div style={{ marginTop: 12, color: '#475569' }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Available endpoints</div>
              <div style={{ fontSize: 13 }}>• /v1/predict (mock)</div>
              <div style={{ fontSize: 13 }}>• /v1/ingest</div>
            </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
