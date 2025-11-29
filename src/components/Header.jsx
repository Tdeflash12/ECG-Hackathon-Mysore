import React from 'react';
import DeviceStatus from './DeviceStatus';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/dashboard" style={{ textDecoration: 'none' }}>
          <div className="me-2" style={{ width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(90deg,#ef4444,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>❤</div>
          <div>
            <div className="fw-bold mb-0" style={{ color: '#0f172a' }}>MyCardio</div>
            <small className="text-muted">Live / Edge cardiac monitoring</small>
          </div>
        </NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/dashboard">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/contact">Contact</NavLink>
            </li>
            <li className="nav-item ms-3">
              <button className="btn btn-danger btn-sm d-inline-flex align-items-center" onClick={() => window.dispatchEvent(new CustomEvent('openDemo'))}>
                <i className="bi bi-megaphone me-2"></i> Request Demo
              </button>
            </li>
            <li className="nav-item ms-2">
              <button className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center" onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}>
                <i className="bi bi-chat-dots me-1"></i> Chat
              </button>
            </li>
            <li className="nav-item ms-2">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DeviceStatus />
              </div>
            </li>
            <li className="nav-item ms-2">
              <button className="btn btn-outline-primary btn-sm d-inline-flex align-items-center" onClick={async () => {
                // Trigger a user-gesture port selection and open the port
                try {
                  if (!navigator?.serial) {
                    return window.alert('Web Serial not supported in this browser');
                  }
                  const port = await navigator.serial.requestPort();
                  await port.open({ baudRate: 9600 });
                  // dispatch event with selected port for SerialReader to attach
                  window.dispatchEvent(new CustomEvent('portSelected', { detail: { port } }));
                } catch (err) {
                  console.error('Port selection failed', err);
                  const m = String(err?.message || err?.name || err);
                  // suppress the noisy 'failed to open serial port' and permission/denial messages
                  const suppressed = /failed to open serial port|failed to execute 'open' on 'serialport'|could not open|cannot open|open failed|in use|notallowederror|securityerror|notfounderror|permission denied|operation aborted/i.test(m);
                  if (!suppressed) {
                    window.alert('Failed to select port: ' + m);
                  } else {
                    // otherwise, quietly warn the console; the SerialReader handles fallback.
                    console.warn('Port selection suppressed:', m);
                  }
                }
              }}>
                <i className="bi bi-usb-plug me-1"></i> Connect Arduino
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}