import { useEffect, useState, useRef } from 'react';

export default function SerialReader({ onData }) {
	const [isSupported, setIsSupported] = useState(!!(typeof navigator !== 'undefined' && navigator.serial));
	const [isConnected, setIsConnected] = useState(false);
	const isConnectedRef = useRef(isConnected);
	const [errorMessage, setErrorMessage] = useState(null);
	const [statusText, setStatusText] = useState('idle');
	const portRef = useRef(null);
	const readerRef = useRef(null);
	const readLoopRef = useRef(false);
	// simulation fallback
	const simulateRef = useRef(null);
	const [isSimulating, setIsSimulating] = useState(false);
	const simulateBaseRef = useRef(100);
	const simulateEcgBaseRef = useRef(450);

	useEffect(() => {
		setIsSupported(!!(typeof navigator !== 'undefined' && navigator.serial));
		function onConnectReq() { if (!isConnectedRef.current) connect(); else disconnect(); }
		window.addEventListener('connectArduino', onConnectReq);
		function onDisconnectReq() { disconnect(); }
		window.addEventListener('disconnectArduino', onDisconnectReq);
		window.addEventListener('portSelected', onPortSelected);
		// allow other components to request a simulation start/stop
		window.addEventListener('startSimulation', startSimulation);
		window.addEventListener('stopSimulation', stopSimulation);

		function onPortSelected(e) {
			const port = e?.detail?.port;
			if (!port) return;
			// Use the port selected by header; ensure it's open
			(async () => {
				try {
					if (port.readable) {
						portRef.current = port;
						setIsConnected(true);
						// Mark ML prediction port as connected for demo purposes
						setTimeout(() => window.dispatchEvent(new CustomEvent('mlConnected', { detail: { port: 'P0RT' } })), 250);
						setStatusText('connected');
						// ensure UI components know a device is connected
						window.dispatchEvent(new CustomEvent('deviceConnected'));
						readLoopRef.current = true;
						readLoop(port);
					}
				} catch (err) {
					console.error('Error attaching selected port', err);
					const m = String(err?.message || err?.name || err);
					// suppress the common 'Failed to open serial port' message
					const suppressed2 = /failed to open serial port|failed to execute 'open' on 'serialport'|could not open|cannot open|open failed|in use|notallowederror|securityerror|notfounderror|permission denied|operation aborted/i.test(m);
					if (!suppressed2) {
						setErrorMessage(m);
						window.dispatchEvent(new CustomEvent('serialError', { detail: { message: m } }));
					} else {
						// do not set an intrusive UI error for user-denied or open failures
						setErrorMessage(null);
					}
				}
			})();
		}

		return () => {
			window.removeEventListener('connectArduino', onConnectReq);
			window.removeEventListener('disconnectArduino', onDisconnectReq);
			window.removeEventListener('portSelected', onPortSelected);
			window.removeEventListener('startSimulation', startSimulation);
			window.removeEventListener('stopSimulation', stopSimulation);
			// stop any simulation on unmount
			stopSimulation();
		};
	}, []);

	// Keep a ref in sync to avoid stale closures
	useEffect(() => { isConnectedRef.current = isConnected; }, [isConnected]);

	async function connect() {
		try {
			if (!navigator?.serial) throw new Error('Web Serial unavailable');
			const port = await navigator.serial.requestPort();
			setErrorMessage(null);
			if (portRef.current) {
				setStatusText('already open');
				return;
			}
			await port.open({ baudRate: 9600 });
			portRef.current = port;
			setIsConnected(true);
			// Mark ML prediction port as connected for demo purposes
			setTimeout(() => window.dispatchEvent(new CustomEvent('mlConnected', { detail: { port: 'P0RT' } })), 250);
			window.dispatchEvent(new CustomEvent('deviceConnected'));
			readLoopRef.current = true;
			setStatusText('connected');
			readLoop(port);
		} catch (err) {
			// On common port open failures (user denied permission, in-use, etc.) the browser
			// surfaces a message such as "Failed to execute 'open' on 'SerialPort': Failed to open serial port".
			// The user finds these noisy and we suppress an explicit alert while keeping a console
			// message for diagnostics. For other errors we'll still emit a serialError event.
			console.error('Serial connect failed', err);
			const m2 = String(err?.message || err?.name || err);
			// Suppress noisy 'Failed to open serial port' errors and NotAllowedError from showing in UI
			const suppressed = /failed to open serial port|failed to execute 'open' on 'serialport'|could not open|cannot open|open failed|in use|notallowederror|securityerror|notfounderror|permission denied|operation aborted/i.test(m2);
			if (!suppressed) {
				setErrorMessage(m2);
				window.dispatchEvent(new CustomEvent('serialError', { detail: { message: m2 } }));
				setStatusText('error');
			} else {
				// keep a minimal status change for suppressed errors; we'll start simulation shortly
				setStatusText('idle');
			}
			// If serial connection fails, fallback to simulation so UI remains interactive
			startSimulation();
		}
	}

	function startSimulation() {
		if (simulateRef.current) return;
		setStatusText('simulating');
		setIsConnected(true);
		window.dispatchEvent(new CustomEvent('deviceConnected'));
		window.dispatchEvent(new CustomEvent('simulationStarted'));
		setIsSimulating(true);
			// pick stable base bpm and ECG base
			simulateBaseRef.current = 90 + Math.floor(Math.random() * 31); // 90..120
			simulateEcgBaseRef.current = 400 + Math.floor(Math.random() * 200); // ~400..600
			// emit an immediate reading to update UI right away
			window.dispatchEvent(new CustomEvent('reading', { detail: { bpm: simulateBaseRef.current, timestamp: Date.now() } }));
			const baseE = simulateEcgBaseRef.current;
			for (let k = 0; k < 3; k++) {
				const v1 = baseE + Math.floor((Math.random() - 0.5) * 10);
				window.dispatchEvent(new CustomEvent('ecgSample', { detail: { value: v1, timestamp: Date.now() } }));
			}
				// schedule per-beat emission based on BPM
				const beatBpm = simulateBaseRef.current;
				const beatIntervalMs = Math.max(250, Math.round(60000 / beatBpm)); // prevent too-low interval
				// utility to emit one beat (series of ecg sample events + one reading event)
				function emitBeat() {
					const baseE = simulateEcgBaseRef.current;
					const bpm = simulateBaseRef.current;
					// send a BPM reading once per beat
					window.dispatchEvent(new CustomEvent('reading', { detail: { bpm, timestamp: Date.now() } }));
					// Build a simple beat waveform pattern (baseline, small bump, sharp R spike, return)
					const beatPattern = [
						baseE - 6,
						baseE - 2,
						baseE + 8,
						baseE + Math.floor(60 + Math.random() * 80), // R spike
						baseE + 20,
						baseE,
					];
					// Emit each waveform sample spaced by ~30ms for a beat effect
					beatPattern.forEach((val, idx) => setTimeout(() => {
						window.dispatchEvent(new CustomEvent('ecgSample', { detail: { value: val, timestamp: Date.now() } }));
					}, idx * 30));
				}
				// emit an immediate beat to kickstart UI
				emitBeat();
				simulateRef.current = setInterval(emitBeat, beatIntervalMs);
	}

	function stopSimulation() {
		if (!simulateRef.current) return;
		clearInterval(simulateRef.current);
		simulateRef.current = null;
		setIsConnected(false);
		setStatusText('idle');
		window.dispatchEvent(new CustomEvent('deviceDisconnected'));
		window.dispatchEvent(new CustomEvent('simulationStopped'));
		setIsSimulating(false);
	}

	async function disconnect() {
		readLoopRef.current = false;
		setStatusText('disconnecting');
		try {
			if (readerRef.current) {
				try { await readerRef.current.cancel(); } catch (e) { /* ignore */ }
				readerRef.current = null;
			}
			if (portRef.current && portRef.current.close) {
				try { await portRef.current.close(); } catch (e) { /* ignore */ }
				portRef.current = null;
			}
		} catch (err) {
			console.error('Serial disconnect failed', err);
			setErrorMessage(String(err?.message || err));
		} finally {
			setIsConnected(false);
			window.dispatchEvent(new CustomEvent('deviceDisconnected'));
			// ensure simulation stopped when disconnecting
			stopSimulation();
			setStatusText('disconnected');
		}
	}

	async function readLoop(port) {
		if (!port?.readable) return;
		const reader = port.readable.getReader();
		readerRef.current = reader;
		let leftover = '';
		try {
			while (readLoopRef.current) {
				const { value, done } = await reader.read();
				if (done) break;
				if (!value) continue;
				const txt = new TextDecoder().decode(value);
				if (typeof txt !== 'string') continue;
				const text = (leftover + txt).replace(/\r/g, '');
				const parts = text.split('\n');
				leftover = parts.pop() || '';
				for (const p of parts) {
					const trimmed = p.trim();
					if (!trimmed) continue;
										// try parse numeric BPM (accept digits embedded in text)
										let num = parseInt(trimmed, 10);
										if (Number.isNaN(num)) {
											const m = trimmed.match(/(\d{1,3})/);
											if (m) num = parseInt(m[1], 10);
										}
										if (!Number.isNaN(num) && num > 0) {
											window.dispatchEvent(new CustomEvent('reading', { detail: { bpm: num, timestamp: Date.now() } }));
											if (typeof onData === 'function') onData(num);
						continue;
					}
					// try parse as JSON
					try {
												const j = JSON.parse(trimmed);
												const bpmVal = j?.bpm;
												if (bpmVal !== undefined && bpmVal !== null) {
																			const bnum = Number(bpmVal);
																			if (!Number.isNaN(bnum) && bnum > 0) {
																				window.dispatchEvent(new CustomEvent('reading', { detail: { bpm: bnum, timestamp: Date.now() } }));
																				if (typeof onData === 'function') onData(bnum);
																			}
												}
						if (typeof j.raw === 'number') {
							window.dispatchEvent(new CustomEvent('ecgSample', { detail: { value: j.raw, timestamp: Date.now() } }));
						}
						continue;
					} catch (err) {
						// fallback text
						window.dispatchEvent(new CustomEvent('serialText', { detail: { text: trimmed, timestamp: Date.now() } }));
						if (typeof onData === 'function') onData(trimmed);
					}
				}
			}
		} catch (err) {
			console.error('Read loop error', err);
			const rr = String(err?.message || err?.name || err);
			const suppressed3 = /failed to open serial port|failed to execute 'open' on 'serialport'|could not open|cannot open|open failed|in use|notallowederror|securityerror|notfounderror|permission denied|operation aborted/i.test(rr);
			if (!suppressed3) setErrorMessage(rr);
		} finally {
			try { await reader.cancel(); } catch (e) { /* ignore */ }
			try { await reader.releaseLock(); } catch (e) { /* ignore */ }
			readerRef.current = null;
			setIsConnected(false);
			// when disconnecting, also notify ML status as disconnected
			window.dispatchEvent(new CustomEvent('mlDisconnected'));
			// announce disconnect so other components can update
			window.dispatchEvent(new CustomEvent('deviceDisconnected'));
			setStatusText('disconnected');
		}
	}

	if (!isSupported) {
		return <div className="small text-muted">Web Serial not supported in this browser</div>;
	}

	return (
		<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
			<button className="btn btn-primary btn-sm" onClick={() => (isConnected ? disconnect() : connect())}>{isConnected ? 'Disconnect' : 'Connect Arduino'}</button>
			<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
				<div className="small text-muted" style={{ minWidth: 120 }}>{statusText}</div>
				{errorMessage && <div className="small text-danger">{errorMessage}</div>}
			</div>
			{/* Simulation is now controlled globally from Dashboard/DeviceStatus; hide per-component toggle */}
		</div>
	);
}