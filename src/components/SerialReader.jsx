import { useState, useEffect } from 'react';


export default function SerialReader({ onData }) {
const [port, setPort] = useState(null);
const [reading, setReading] = useState(false);


async function connectSerial() {
try {
const newPort = await navigator.serial.requestPort();
await newPort.open({ baudRate: 9600 });
setPort(newPort);
setReading(true);


	const reader = newPort.readable.getReader();


while (true) {
const { value, done } = await reader.read();
if (done) break;


const text = new TextDecoder().decode(value);
onData(text.trim());
	}
	// Track opened port so we can close it
	setPort(newPort);
} catch (err) {
console.error('Serial connection failed:', err);
}
}

// Clean up the port when unmounted
useEffect(() => {
	return () => {
		if (port?.close) port.close();
	};
}, [port]);


return (
<div>
<button onClick={connectSerial} disabled={reading}>
{reading ? 'Reading...' : 'Connect to Arduino'}
</button>
</div>
);
}