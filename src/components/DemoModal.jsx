import React, { useState, useEffect } from 'react';

export default function DemoModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener('openDemo', onOpen);
    return () => window.removeEventListener('openDemo', onOpen);
  }, []);

  function close() {
    setOpen(false);
    setEmail('');
    setName('');
    setCompany('');
  }

  async function sendRequest(e) {
    e.preventDefault();
    if (!email) return alert('Please include an email');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, message })
      });
      const data = await res.json();
      alert(data?.message || 'Request received');
      close();
    } catch (err) {
      console.error(err);
      alert('Failed to send request — offline/mock');
    }
  }

  if (!open) return null;
  return (
    <div className="modal d-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} role="dialog">
      <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0 }} onClick={close} />
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Request a Demo</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={close}></button>
          </div>
          <div className="modal-body">
            <p className="text-muted">Tell us a few details and we’ll schedule a demo and share a sandbox API key.</p>
            <form onSubmit={sendRequest}>
              <div className="row g-2">
                <div className="col-md-6">
                  <input className="form-control" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Company / Team" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div className="col-12 mt-2">
                  <input className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="col-12 mt-2">
                  <textarea className="form-control" placeholder="Short description of use case" value={message} onChange={(e) => setMessage(e.target.value)} style={{ minHeight: 90 }} />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
            <button type="submit" className="btn btn-danger">Send Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}
