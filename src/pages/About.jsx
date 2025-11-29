import LivePreview from '../components/LivePreview';

export default function About() {
	function simulateSequence() {
		const seq = [70, 75, 82, 110, 85, 68, 80, 150, 45, 72];
		let i = 0;
		const id = setInterval(() => {
			window.dispatchEvent(new CustomEvent('simulateCase', { detail: { bpm: seq[i] } }));
			i += 1;
			if (i >= seq.length) clearInterval(id);
		}, 500);
	}
	return (
		<div className="page about-page container py-4" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
			<section className="hero row align-items-center g-4">
				<div className="col-lg-7">
					<h1 style={{ margin: 0, fontSize: '2.25rem', color: '#111827' }}>About MyCardio</h1>
					<p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '1.05rem' }}>
						MyCardio is a minimal, ML-ready dashboard designed to read Arduino heart sensor data and connect to a
						predictive model (e.g. heartd.keras / heartd.h2) for heart-risk insights. It’s built to be lightweight,
						accessible, and easy to integrate with embedded devices and ML pipelines.
					</p>

					<div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
						<button className="btn-primary" onClick={() => window.dispatchEvent(new CustomEvent('openDemo'))}>
							Request a Demo
						</button>
						<button className="btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('goToContact'))}>
							Contact Us
						</button>
						<button className="btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}>Chat</button>
					</div>
				</div>
				<div className="col-lg-5">
					<div className="card p-3 shadow-sm">
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<h5 className="mb-0 text-danger">Live Preview</h5>
								<small className="text-muted">Animated ECG + BPM</small>
							</div>
							<div style={{ width: 260 }}>
								<LivePreview bpm={68} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mt-4">
				<h3 className="mb-2">Model Library</h3>
				<div className="d-flex flex-wrap gap-2">
					<div className="badge bg-light text-dark p-2 me-2">heartd.h5 <small className="text-muted d-block">Keras</small></div>
					<div className="badge bg-light text-dark p-2 me-2">heartd.tflite <small className="text-muted d-block">TF-Lite</small></div>
					<div className="badge bg-light text-dark p-2 me-2">heartd.onnx <small className="text-muted d-block">ONNX</small></div>
				</div>
			</section>

						<section className="mt-4">
								<h3 className="mb-2">Resources & FAQ</h3>
								<div className="card p-3">
									<div className="mb-2">Helpful links and resources:</div>
									<ul className="mb-0">
										<li><a href="https://www.heart.org" target="_blank" rel="noreferrer">American Heart Association</a></li>
										<li><a href="https://www.cdc.gov" target="_blank" rel="noreferrer">CDC - Heart Disease</a></li>
										<li><a href="https://www.ncbi.nlm.nih.gov" target="_blank" rel="noreferrer">NIH - Research and data</a></li>
									</ul>
									<hr />
									<div className="mt-2">
										<strong>FAQ</strong>
										<ul className="mt-2">
											<li><strong>Is BPM the same as ECG?</strong> No — BPM is a single metric (beats per minute); an ECG records the electrical waveform of the heart for clinical diagnosis.</li>
											<li><strong>Can I use MyCardio for medical diagnosis?</strong> Not for clinical diagnosis — this is an educational demo and prototype; clinicians should validate devices and models before clinical use.</li>
										</ul>
									</div>
								</div>
						</section>

						<section className="mt-4">
								<h3 className="mb-2">Demo script (quick)</h3>
								<div className="card p-3">
									<ol className="mb-0">
										<li>Start the server: <code>npm run dev</code>.</li>
										<li>Open the site and show the Dashboard with LivePreview and SerialReader components.</li>
										<li>Open About; click 'Simulate' in the 'Simulate Cases' card to demonstrate abnormal BPM scenarios.</li>
										<li>Show the chatbot: click 'Chat' and ask 'I measured 150 bpm' to show analysis and 'Learn more' link.</li>
										<li>Open Contact and demonstrate 'Download sample data' and demo request flow.</li>
									</ol>
								</div>
						</section>

					<section className="mt-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
						<div className="d-flex gap-2 align-items-center">
							<div className="card p-3 text-center">
								<div className="h4 mb-0 text-danger">+250</div>
								<div className="small text-muted">Devices connected</div>
							</div>
							<div className="card p-3 text-center">
								<div className="h4 mb-0 text-danger">~30 ms</div>
								<div className="small text-muted">Avg inference latency (simulated)</div>
							</div>
							<div className="card p-3 text-center">
								<div className="h4 mb-0 text-danger">90%</div>
								<div className="small text-muted">Prediction accuracy (demo)</div>
							</div>
						</div>
						<div className="d-flex gap-2">
							<button className="btn btn-outline-secondary" onClick={() => window.dispatchEvent(new CustomEvent('goToContact'))}>Contact Sales</button>
							<button className="btn btn-danger" onClick={() => window.dispatchEvent(new CustomEvent('openDemo'))}>Start Demo</button>
						</div>
					</section>

			<div>
				<div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center' }}>
					<div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
						<div style={{ background: '#e6f6ff', borderRadius: 8, padding: '0.4rem 0.6rem', color: '#0ea5e9', fontWeight: 700 }}>ML READY</div>
						<div style={{ background: '#fff7ed', borderRadius: 8, padding: '0.4rem 0.6rem', color: '#f97316', fontWeight: 700 }}>EDGE-FIRST</div>
						<div style={{ background: '#ecfccb', borderRadius: 8, padding: '0.4rem 0.6rem', color: '#16a34a', fontWeight: 700 }}>OPEN-SOURCE</div>
					</div>
				</div>

				<div style={{ marginTop: '1rem' }}>
					<div style={{ borderRadius: 12, boxShadow: '0 6px 18px rgba(13,23,39,0.04)', padding: '1rem', background: 'white' }}>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
								<div>
									<h3 style={{ margin: 0, fontSize: '1rem' }}>Live Demo Preview</h3>
								<p style={{ marginTop: 6, color: '#6b7280', fontSize: '0.9rem' }}>See how a live input looks in MyCardio UI.</p>
							</div>
							<div>
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
										<div style={{ width: 320 }}>
											<LivePreview bpm={68} />
										</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
				<article className="card" style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 6px 18px rgba(13, 23, 39, 0.06)' }}>
					<h3 style={{ marginTop: 0, color: '#0f172a' }}>Why MyCardio?</h3>
					<p style={{ color: '#475569', marginBottom: 0 }}>
						Built to collect live ECG/BPM numbers from Arduino-compatible sensors and provide a clear, navigable dashboard
						for clinicians and hobbyists alike.
					</p>
				</article>

				<article className="card" style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 6px 18px rgba(13, 23, 39, 0.06)' }}>
					<h3 style={{ marginTop: 0, color: '#0f172a' }}>ML Friendly</h3>
					<p style={{ color: '#475569', marginBottom: 0 }}>
						The project is structured for easy integration with a model server or an edge model to run predictions on live data.
					</p>
				</article>

				<article className="card" style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 6px 18px rgba(13, 23, 39, 0.06)' }}>
					<h3 style={{ marginTop: 0, color: '#0f172a' }}>Extensible</h3>
					<p style={{ color: '#475569', marginBottom: 0 }}>
						Wired to accept improvements: visualization widgets, more sensors, and additional clinical flags.
					</p>
				</article>
			</section>

				<section style={{ marginTop: '2rem' }}>
					<h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>Hackathon-ready features</h2>
					<div className="row gx-3 gy-3">
						<div className="col-md-4">
							<div className="card h-100 p-3 d-flex align-items-center">
								<div className="me-3" style={{ width: 44, height: 44, borderRadius: 8, background: 'linear-gradient(90deg,#7c3aed,#0ea5e9)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700 }}>P</div>
								<div>
									<div className="fw-bold">Prototype fast</div>
									<div className="text-muted small">Pre-built components and mock data for quick demos and proofs-of-concept.</div>
								</div>
							</div>
						</div>

						<div className="col-md-4">
							<div className="card h-100 p-3 d-flex align-items-center">
								<div className="me-3" style={{ width: 44, height: 44, borderRadius: 8, background: 'linear-gradient(90deg,#f97316,#ef4444)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700 }}>E</div>
								<div>
									<div className="fw-bold">Edge & Offline</div>
									<div className="text-muted small">Run predictions on-device; demo without cloud connectivity and showcase privacy-first designs.</div>
								</div>
							</div>
						</div>

						<div className="col-md-4">
							<div className="card h-100 p-3 d-flex align-items-center">
								<div className="me-3" style={{ width: 44, height: 44, borderRadius: 8, background: 'linear-gradient(90deg,#10b981,#84cc16)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700 }}>S</div>
								<div>
									<div className="fw-bold">Simulate Cases</div>
									<div className="text-muted small">Built-in simulator for injecting ECG traces, testing corner cases and response times.</div>
									<div className="mt-2">
										<button className="btn btn-outline-secondary" onClick={simulateSequence}>Simulate</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

					<section style={{ marginTop: '2rem' }}>
						<h3 style={{ marginBottom: '0.5rem', color: '#0f172a' }}>Integrations & Formats</h3>
						<div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
							<span className="badge bg-light text-dark me-2 p-2">TensorFlow</span>
							<span className="badge bg-light text-dark me-2 p-2">TF-Lite</span>
							<span className="badge bg-light text-dark me-2 p-2">ONNX</span>
							<span className="badge bg-light text-dark me-2 p-2">EdgeTPU</span>
							<span className="badge bg-light text-dark me-2 p-2">h5/h2 Support</span>
						</div>
					</section>

					<section style={{ marginTop: '1.5rem' }}>
						<h3 style={{ marginBottom: '0.5rem', color: '#0f172a' }}>Use cases</h3>
						<div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
							<div className="card p-3">
								<div style={{ fontWeight: 700 }}>Remote Patient Monitoring</div>
								<div style={{ color: '#475569', fontSize: 13 }}>Track chronic patients at home, reduce hospital visits.</div>
							</div>
							<div className="card p-3">
								<div style={{ fontWeight: 700 }}>Preventative Health</div>
								<div style={{ color: '#475569', fontSize: 13 }}>Integrate with wellness apps to detect anomalies early.</div>
							</div>
							<div className="card p-3">
								<div style={{ fontWeight: 700 }}>Research / Trials</div>
								<div style={{ color: '#475569', fontSize: 13 }}>Export datasets for model development and validation.</div>
							</div>
							<div className="card p-3">
								<div style={{ fontWeight: 700 }}>DIY & Maker Projects</div>
								<div style={{ color: '#475569', fontSize: 13 }}>Connect to Arduino hardware for quick prototypes & events.</div>
							</div>
						</div>
					</section>

					<section style={{ marginTop: '1.5rem' }}>
						<h3 style={{ marginBottom: '0.5rem', color: '#0f172a' }}>Get started (Quick start)</h3>
						<div className="card" style={{ padding: 12 }}>
							<div style={{ fontWeight: 700 }}>Hackathon quick start</div>
							<div style={{ color: '#475569', fontSize: 13, marginTop: 8 }}>
								Clone the repo and run the dev server locally — it's ready for quick demos.
							</div>
							<pre style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginTop: 8, overflowX: 'auto' }}>
																<code>{`git clone https://github.com/your-repo/mycardio.git
cd mycardio
npm install
npm run dev

/* Arduino serial example (send BPM as simple number per line) */
// Arduino C++
void loop() {
	int bpm = analogRead(A0) / 10; // mock
	Serial.println(bpm);
	delay(250);
}`}</code>
							</pre>
						</div>
					</section>

			<section style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
				<div style={{ flex: 1 }}>
					<h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>How it works</h2>
					<p style={{ color: '#475569' }}>
						MyCardio reads a serial stream from an Arduino or microcontroller, extracts heart readings, and provides a
						small set of tools to visualize and log the results. The dashboard provides a live view and a placeholder for
						ML-driven risk prediction.
					</p>
				</div>

				<div style={{ width: '360px', background: '#f8fafc', borderRadius: '12px', padding: '1rem', color: '#111827' }}>
					<strong>Integrate the model</strong>
					<p style={{ color: '#475569', marginTop: '0.5rem' }}>Drop your model, serve it via an endpoint, and connect predictions to the dashboard.</p>
				</div>
			</section>
		</div>
	);
}