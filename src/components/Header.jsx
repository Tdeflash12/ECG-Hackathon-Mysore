import React from 'react';
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
          </ul>
        </div>
      </div>
    </nav>
  );
}
