import React from 'react';

export default function Footer() {
  return (
    <footer className="py-4 border-top mt-4">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <strong>MyCardio</strong>
          <div className="text-muted small">Small, embeddable heart monitoring with ML-ready tooling</div>
        </div>
        <div className="text-muted small">© {new Date().getFullYear()} MyCardio — Built for edge-first monitoring</div>
      </div>
    </footer>
  );
}