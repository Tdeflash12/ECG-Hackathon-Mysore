import React, { useEffect, useState } from 'react';

export default function DeviceStatus() {
	const [isSupported, setIsSupported] = useState(!!(typeof navigator !== 'undefined' && navigator.serial));
	const [isConnected, setIsConnected] = useState(false);
	const [lastBpm, setLastBpm] = useState(null);
	const [lastEcg, setLastEcg] = useState(null);
	const [error, setError] = useState(null);
	const [isSimulating, setIsSimulating] = useState(false);
	const [mlConnected, setMlConnected] = useState(false);

	useEffect(() => {
		function onConnect() { setIsConnected(true); }
		function onDisconnect() { setIsConnected(false); }
		function onReading(e) { const bpm = e?.detail?.bpm; if (typeof bpm === 'number') setLastBpm(bpm); }
		function onEcg(e) { const v = e?.detail?.value; if (typeof v === 'number') setLastEcg(v); }
		function onError(e) { setError(String(e?.detail?.message || 'Error')); }
		function onSimStart() { setIsSimulating(true); }
		function onSimStop() { setIsSimulating(false); }
		function onMLConnect() { setMlConnected(true); }
		function onMLDisconnect() { setMlConnected(false); }
		setIsSupported(!!(typeof navigator !== 'undefined' && navigator.serial));
		window.addEventListener('deviceConnected', onConnect);
		window.addEventListener('deviceDisconnected', onDisconnect);
		window.addEventListener('reading', onReading);
		window.addEventListener('ecgSample', onEcg);
		window.addEventListener('serialError', onError);
		window.addEventListener('simulationStarted', onSimStart);
		window.addEventListener('simulationStopped', onSimStop);
		window.addEventListener('mlConnected', onMLConnect);
		window.addEventListener('mlDisconnected', onMLDisconnect);
		return () => {
			window.removeEventListener('deviceConnected', onConnect);
			window.removeEventListener('deviceDisconnected', onDisconnect);
			window.removeEventListener('reading', onReading);
			window.removeEventListener('ecgSample', onEcg);
			window.removeEventListener('serialError', onError);
			window.removeEventListener('simulationStarted', onSimStart);
			window.removeEventListener('simulationStopped', onSimStop);
			window.removeEventListener('mlConnected', onMLConnect);
			window.removeEventListener('mlDisconnected', onMLDisconnect);
			setError(null);
		};
	}, []);

	if (!isSupported) {
		return <div className="small text-muted">Serial not supported</div>;
	}

	return (
		<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
			<div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
				<span style={{ width: 10, height: 10, borderRadius: 6, background: isConnected ? '#16a34a' : '#e5e7eb' }} aria-hidden />
				<span className="small text-muted">{isSimulating ? 'Simulating' : (isConnected ? 'Connected' : 'Disconnected')}</span>
			</div>
			<div className="small text-muted">{lastBpm ? `${lastBpm} BPM` : ''}</div>
			{error && <div style={{ marginLeft: 8 }} className="small text-danger">{error}</div>}
			{mlConnected && <div className="small text-muted" style={{ marginLeft: 8 }}><strong>ML:</strong> P0RT connected</div>}
			<button className="btn btn-outline-secondary btn-sm" onClick={async () => {
				if (!navigator?.serial) return window.alert('Web Serial not supported');
				try {
					const port = await navigator.serial.requestPort();
					await port.open({ baudRate: 9600 });
					window.dispatchEvent(new CustomEvent('portSelected', { detail: { port } }));
				} catch (err) {
					console.error('device connect failed', err);
					const m = String(err?.message || err?.name || err);
					const suppressed = /failed to open serial port|failed to execute 'open' on 'serialport'|could not open|cannot open|open failed|in use|notallowederror|securityerror|notfounderror|permission denied|operation aborted/i.test(m);
					if (!suppressed) {
						window.alert('Failed to connect: ' + m);
					} else {
						console.warn('Device connect suppressed:', m);
					}
				}
			}}>{isConnected ? 'Disconnect' : 'Connect'}</button>

			{isConnected && (
				<button className="btn btn-outline-danger btn-sm" onClick={() => window.dispatchEvent(new CustomEvent('disconnectArduino'))}>Disconnect</button>
			)}
			<button className="btn btn-outline-secondary btn-sm" onClick={() => {
				// toggle continuous simulation via events
				if (isSimulating) {
					window.dispatchEvent(new CustomEvent('stopSimulation'));
				} else {
					window.dispatchEvent(new CustomEvent('startSimulation'));
				}
			}}>{isSimulating ? 'Stop Simulation' : 'Simulate BPM'}</button>
			<button className="btn btn-outline-secondary btn-sm" onClick={() => {
				const v = Math.floor(400 + Math.random() * 200);
				window.dispatchEvent(new CustomEvent('ecgSample', { detail: { value: v, timestamp: Date.now() } }));
			}}>Simulate Wave</button>
		</div>
	);
}

