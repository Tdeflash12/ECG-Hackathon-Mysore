import React, { useState, useEffect, useRef } from 'react';

const KB = [
  { q: 'what is mycardio', a: 'MyCardio is a lightweight dashboard for live heart monitoring and early insight; it helps collect BPM and waveform data and is designed for rapid prototyping and research integrations.' },
  { q: 'how to connect arduino', a: 'Using the SerialReader in the dashboard, send newline-separated BPM integers from your microcontroller (e.g., Serial.println(bpm);). The About page contains a quick Arduino snippet.' },
  { q: 'model formats supported', a: 'We support TensorFlow, TensorFlow Lite, ONNX and standard Keras .h5/.h2 files. For on-device inference, convert to TFLite or other supported edge formats.' },
  { q: 'simulate cases', a: 'The About page includes a Simulate button that injects test BPM values so you can showcase how monitoring and alerts react to abnormal BPMs.' },
  { q: 'privacy edge inference', a: 'Edge inference keeps the data on-device to protect patient privacy. MyCardio supports local model options and a privacy-first approach; only opt-in telemetry would be sent to a cloud endpoint.' },
  { q: 'demo', a: 'Click the "Request Demo" button (header/About) to open a demo form. The form currently mocks sending a request and shows a confirmation dialog.' },

  // Health-related content below (NOTE: this is educational only; not medical advice)
  { q: 'tachycardia', a: 'Tachycardia means a fast heart rate, typically over 100 beats per minute (BPM) at rest. Causes can include fever, dehydration, stress, stimulant use, or cardiac conditions. If you experience chest pain, lightheadedness, fainting, or extreme shortness of breath, seek immediate medical attention.', source: 'https://www.heart.org' },
  { q: 'bradycardia', a: 'Bradycardia is a slow heart rate, commonly defined as less than 60 BPM at rest. It can be benign for healthy athletes but may indicate conduction issues for others. If you feel dizziness, confusion, or fainting, consult a healthcare professional.', source: 'https://www.heart.org' },
  { q: 'arrhythmia', a: 'Arrhythmias are irregular heart rhythms. Palpitations, skipped beats, or irregular pulse can signal arrhythmias. Some arrhythmias are benign, whereas others (like ventricular tachycardia) can be life-threatening. Any concerns should be evaluated clinically with ECG and diagnostics.', source: 'https://www.cdc.gov' },
  { q: 'atrial fibrillation', a: 'Atrial fibrillation (AFib) is an irregular and often rapid heart rhythm originating in the atria. It may cause palpitations, weakness, or breathlessness, and increases the risk of stroke. AFib is diagnosed with ECG and managed by clinicians with medications, anticoagulants, or procedures.', source: 'https://www.heart.org' },
  { q: 'pvcs', a: 'Premature ventricular contractions (PVCs) are extra heartbeats originating in the ventricles. Many people have occasional PVCs that are benign; frequent PVCs or those with symptoms should be evaluated.', source: 'https://www.heart.org' },
  { q: 'heart failure', a: 'Heart failure is the heart’s inability to pump blood effectively. Symptoms include fatigue, shortness of breath, leg swelling, and rapid weight gain. Management requires medical evaluation and long-term therapy.', source: 'https://www.heart.org' },
  { q: 'ecg', a: 'An ECG (electrocardiogram) records the electrical activity of the heart and is used to detect arrhythmias, heart attacks, and other conditions. MyCardio provides BPM and a waveform preview but is not a replacement for a clinical ECG.', source: 'https://www.heart.org' },
  { q: 'heart attack signs', a: 'Signs of a heart attack include chest discomfort or pressure, pain radiating to jaw/arm/back, shortness of breath, nausea, or sudden sweating. If you suspect a heart attack, call emergency services immediately.', source: 'https://www.heart.org' },
  { q: 'when to see a doctor', a: 'Seek immediate medical care for severe chest pain, fainting, blackouts, severe shortness of breath, or rapid, irregular pulses with dizziness. For persistent or recurring palpitations, consult a cardiologist for ECG and evaluation.' },
  { q: 'prevention', a: 'Preventive steps include maintaining a healthy lifestyle (balanced diet, exercise, quitting smoking), managing blood pressure and cholesterol, controlling diabetes, and following prescribed cardiac medications.', source: 'https://www.heart.org' },
  // Additional heart-disease related entries
  { q: 'hypertension', a: 'Hypertension (high blood pressure) occurs when the force of blood against arterial walls is too high. Lifestyle changes (weight loss, reduced sodium, increased physical activity), along with appropriate medications, can control blood pressure. A hypertensive emergency (e.g., >180/120 mmHg) with symptoms like chest pain or neurological issues requires immediate emergency care.', source: 'https://www.cdc.gov' },
  { q: 'cholesterol', a: 'High cholesterol contributes to plaque formation in arteries, increasing heart disease risk. Lifestyle changes and medications (such as statins) reduce risk; check lipids regularly and discuss targets with your clinician.', source: 'https://www.heart.org' },
  { q: 'statins', a: 'Statins lower LDL cholesterol and reduce cardiovascular risk. They are commonly prescribed for people with established cardiovascular disease or high LDL. Side effects may occur; discuss risks and benefits with a clinician.', source: 'https://www.heart.org' },
  { q: 'angina', a: 'Angina is chest discomfort from reduced blood flow to the heart. Stable angina occurs predictably with exertion and improves with rest; unstable angina is more concerning and may precede a heart attack. Seek immediate care for severe or worsening chest pain.', source: 'https://www.heart.org' },
  { q: 'valve disease', a: 'Valvular heart disease affects the heart valves, causing symptoms like breathlessness, palpitations, or fainting in advanced stages. Regular follow-up with echocardiography and cardiology is recommended when valve disease is diagnosed.', source: 'https://www.heart.org' },
  { q: 'cardiomyopathy', a: 'Cardiomyopathy is a disease of the heart muscle that can cause heart failure or arrhythmias. It may be genetic or acquired; evaluation includes ECG, echocardiography, and specialist care.', source: 'https://www.heart.org' },
  { q: 'lifestyle', a: 'Lifestyle tips: follow a Mediterranean/DASH diet, limit added salt and processed foods, exercise regularly (150 minutes/week), maintain a healthy weight, stop smoking, and limit alcohol. These steps significantly lower cardiovascular risk.', source: 'https://www.cdc.gov' },
  { q: 'not medical advice', a: 'I am a demo assistant and do not provide medical diagnosis. For personal medical advice, consult a licensed clinician.' }
];
// NOTE: Added source URLs for health entries to help demo with credible references (educational only)

function answerFromKB(input) {
  const t = input.toLowerCase().trim();
  // Check symptoms keywords
  const symptomResult = parseSymptoms(t);
  if (symptomResult) return symptomResult;
  // First: check if the user typed a BPM numeric reading like 'bpm 150' or 'i have 150 bpm'
  const bpmMatches = t.match(/(\d{2,3})\s*bpm|bpm\s*(\d{2,3})|\b(\d{2,3})\b/);
  if (bpmMatches) {
    const numStr = bpmMatches[1] || bpmMatches[2] || bpmMatches[3];
    if (numStr) {
      const bpm = parseInt(numStr, 10);
      if (!isNaN(bpm)) return analyzeBPM(bpm);
    }
  }
  let best = KB.find(k => t.includes(k.q));
  if (best) return best.a;
  // fallback: match keywords
  for (const k of KB) {
    const words = k.q.split(' ');
    if (words.some(w => t.includes(w))) return k.a;
  }
  return 'I can help explain how to connect hardware, simulate test cases, give high-level educational info on cardiac conditions, and suggest next steps — however, I cannot provide medical diagnoses. Try: "what is tachycardia"';
}

// Add an entry for device accuracy and limitations
KB.push({ q: 'accuracy', a: 'MyCardio demonstrates example accuracy for demo models, but the numbers are illustrative. Real-world accuracy depends on model validation, preprocessing, and device calibration. Always validate any clinical model with an appropriate dataset and clinical oversight.', source: 'https://www.heart.org' });

function parseSymptoms(text) {
  // Common worrisome symptoms indicating urgent evaluation
  const heartAttackKeywords = ['chest pain', 'chest pressure', 'radiating pain', 'left arm', 'jaw pain', 'sweating', 'crushing pain'];
  if (heartAttackKeywords.some(k => text.includes(k))) {
    return 'Chest pain or pressure combined with shortness of breath, nausea, or sweating can be a sign of a heart attack. Call emergency services right away and seek urgent medical care. (Source: https://www.heart.org)';
  }

  const palpitationsKeywords = ['palpitation', 'palpitations', 'skipped beat', 'irregular heartbeat', 'fluttering'];
  if (palpitationsKeywords.some(k => text.includes(k))) {
    return 'Palpitations or an irregular heartbeat may indicate an arrhythmia. This can be benign for some people, but if it is accompanied by dizziness, fainting, chest pain, or severe shortness of breath, seek medical evaluation. Otherwise, consider tracking episodes and share them with a clinician. (Source: https://www.cdc.gov)';
  }

  const lightheadedKeywords = ['lightheaded', 'dizzy', 'faint', 'fainting', 'syncope'];
  if (lightheadedKeywords.some(k => text.includes(k))) {
    return 'Lightheadedness or fainting can be a sign of low blood pressure, bradycardia, or other cardiac causes. If this happens suddenly or with chest pain, call emergency services. Otherwise consult a clinician for further evaluation.';
  }

  // Detect formatted blood pressure, e.g., "BP 180/110" or "blood pressure 145/90"
  const bpMatch = text.match(/\b(?:bp|blood pressure)\s*(\d{2,3})\s*\/\s*(\d{2,3})/i);
  if (bpMatch) {
    const sys = parseInt(bpMatch[1], 10);
    const dias = parseInt(bpMatch[2], 10);
    if (!isNaN(sys) && !isNaN(dias)) {
      if (sys >= 180 || dias >= 120) {
        return `A blood pressure reading of ${sys}/${dias} mmHg is dangerously high and may be a hypertensive emergency if accompanied by chest pain, shortness of breath, or neurological symptoms — seek immediate emergency care.`;
      }
      return `A blood pressure reading of ${sys}/${dias} mmHg is elevated; discuss lifestyle changes and follow-up with your clinician. If you have chest pain, shortness of breath, or neurological symptoms, seek urgent care.`;
    }
  }

  return null;
}

// Analyze a single numeric BPM and return a high-level educational response.
function analyzeBPM(bpm) {
  // NOTE: This is educational only; not a medical diagnosis.
  if (bpm <= 40) {
    return { text: `BPM ${bpm} is very low (bradycardia). In a resting adult this can indicate slowing of the heart rate which may require clinical evaluation if the person is symptomatic (dizziness, fainting, confusion). Seek medical evaluation promptly; in emergencies call local emergency services.`, source: 'https://www.heart.org', risk: 'high' };
  }
  if (bpm > 40 && bpm < 60) {
    return { text: `BPM ${bpm} is lower than typical resting ranges. For fit individuals (athletes) this may be normal. If you feel unwell (dizziness, fainting) or this is a new finding, consult a clinician.`, source: 'https://www.heart.org', risk: 'moderate' };
  }
  if (bpm >= 60 && bpm <= 100) {
    return { text: `BPM ${bpm} is within the normal resting range (60-100 BPM). If you have symptoms like chest pain or sudden shortness of breath, seek urgent care.`, source: 'https://www.cdc.gov', risk: 'normal' };
  }
  if (bpm > 100 && bpm <= 130) {
    return { text: `BPM ${bpm} indicates tachycardia (fast heart rate). Common causes include exercise, fever, anxiety, dehydration, stimulants (caffeine, nicotine), or underlying conditions. Try resting, hydrating, and avoiding stimulants; if you have chest pain, severe shortness of breath, or dizziness, seek immediate medical attention.`, source: 'https://www.heart.org', risk: 'moderate' };
  }
  if (bpm > 130) {
    return { text: `BPM ${bpm} is very fast and may be dangerous, especially when paired with chest pain, shortness of breath, lightheadedness, or fainting. Seek emergency medical care immediately.`, source: 'https://www.heart.org', risk: 'high' };
  }
  return { text: `BPM ${bpm} — please consult a clinician for a full assessment.`, risk: 'unknown' };
}

function precautionsMessage() {
  return `Precautions & Prevention (educational only):\n\n• Lifestyle: follow a Mediterranean/DASH diet, limit sodium and processed foods, aim for 150 minutes of moderate exercise per week, maintain a healthy weight, avoid tobacco, and limit alcohol.\n\n• Monitoring: check your blood pressure and BPM regularly, log readings, and share trends with your clinician.\n\n• Medication adherence: if you are prescribed medications (e.g., antihypertensives, statins, anticoagulants), take them exactly as advised; don’t stop suddenly without clinical guidance.\n\n• Emergency signs: seek immediate care for severe chest pain, severe shortness of breath, fainting, sudden weakness or confusion, or very high blood pressure with symptoms.\n\n• Device and model guidance: verify device placement and calibration, and understand that an app/model is not a substitute for clinical diagnosis.`;
}

export default function InfoChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Hi! I’m MyCardio assistant. Ask me about setup, models, and demo.' }]);
  const [text, setText] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function onOpen() { setOpen(o => !o); }
    window.addEventListener('openChat', onOpen);
    return () => window.removeEventListener('openChat', onOpen);
  }, []);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [messages, open]);

  // When the app dispatches simulateCase with a BPM, show an automatic educational analysis here
  useEffect(() => {
    function onSim(e) {
      const bpm = e?.detail?.bpm;
      if (bpm) {
        const a = analyzeBPM(bpm);
        const botMsg = { role: 'bot', text: (typeof a === 'string' ? a : a.text) };
        if (typeof a === 'object') {
          if (a.source) botMsg.source = a.source;
          if (a.risk) botMsg.risk = a.risk;
        }
        setOpen(true);
        setMessages(prev => [...prev, { role: 'bot', text: `Live reading: ${bpm} BPM` }, botMsg]);
      }
    }
    window.addEventListener('simulateCase', onSim);
    return () => window.removeEventListener('simulateCase', onSim);
  }, []);

  function send() {
    if (!text.trim()) return;
    const user = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, user]);
    setText('');
    // simple delay for mock response
      setTimeout(() => {
        const a = answerFromKB(user.text);
        // also find source if available
        const kb = KB.find(k => user.text.toLowerCase().includes(k.q));
      const botMessage = { role: 'bot' };
      if (typeof a === 'string') botMessage.text = a;
      else if (typeof a === 'object') {
        botMessage.text = a.text;
        if (a.source) botMessage.source = a.source;
        if (a.risk) botMessage.risk = a.risk;
      }
          if (kb?.source) {
            botMessage.source = kb.source;
          }
      setMessages(prev => [...prev, botMessage]);
      }, 550);
  }
  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function quickAction(action) {
    if (action === 'simulate') {
      // simulate a short sequence of BPM values
      const seq = [72, 78, 95, 110, 145, 128, 92, 78, 65];
      let i = 0;
      const id = setInterval(() => {
        window.dispatchEvent(new CustomEvent('simulateCase', { detail: { bpm: seq[i] } }));
        i += 1;
        if (i >= seq.length) clearInterval(id);
      }, 500);
      return;
    }
    if (action === 'analyze150') {
      // simulate a single high bpm
      const a = analyzeBPM(150);
      const botMsg = { role: 'bot' };
      botMsg.text = a.text || a;
      if (a.source) botMsg.source = a.source;
      if (a.risk) botMsg.risk = a.risk;
      setOpen(true);
      setMessages(prev => [...prev, { role: 'user', text: '150 bpm' }, botMsg]);
      return;
    }
    if (action === 'afib') {
      setText('what is atrial fibrillation');
      setTimeout(() => send(), 80);
      return;
    }
    if (action === 'seekhelp') {
      setText('when to see a doctor');
      setTimeout(() => send(), 80);
      return;
    }
    if (action === 'precautions') {
      const p = precautionsMessage();
      const botMsg = { role: 'bot', text: p, source: 'https://www.heart.org' };
      setOpen(true);
      setMessages(prev => [...prev, { role: 'user', text: 'precautions' }, botMsg]);
      return;
    }
  }

  if (!open) {
    return <button className="chat-button btn btn-danger rounded-circle" aria-label="Open chat" onClick={() => setOpen(true)}>💬</button>;
  }

  return (
    <div>
      <div className="chat-panel rounded" role="dialog" aria-label="MyCardio Assistant">
        <div className="chat-header">
          <div>
            <strong>MyCardio Assistant</strong>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Ask about setup, simulation, readings, and high-level heart health info (educational only).</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}><em>Not a medical device. Always contact a healthcare provider for advice.</em></div>
          </div>
          <div>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
          <button className="btn btn-outline-primary btn-sm" onClick={() => { quickAction('simulate') }}>Simulate Case</button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => { quickAction('analyze150') }}>Analyze 150 BPM</button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => { quickAction('afib') }}>What is AFib?</button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => { quickAction('seekhelp') }}>When to seek help</button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => { quickAction('precautions') }}>Precautions</button>
        </div>
        <div className="chat-messages" ref={ref}>
          {messages.map((m, idx) => (
              <div key={idx} className={`msg ${m.role === 'user' ? 'user' : 'bot'}`}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div>{m.text}</div>
                      {m.risk && (
                        <span className={`badge ms-2 ${m.risk === 'high' ? 'bg-danger' : m.risk === 'moderate' ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: 12 }}>{m.risk.toUpperCase()}</span>
                      )}
                    </div>
                    {m.source && (
                      <div style={{ marginTop: 8 }}>
                        <a href={m.source} target="_blank" rel="noreferrer" className="small">Learn more</a>
                      </div>
                    )}
                  </div>
              </div>
          ))}
        </div>
        <div className="chat-input">
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={onKeyDown} placeholder="Ask me (e.g., 'simulate cases')" className="form-control" style={{ flex: 1 }} />
          <button className="btn btn-danger ms-2" onClick={send}>Send</button>
        </div>
      </div>
      <button className="chat-button" aria-label="Open chat" onClick={() => setOpen(false)}>💬</button>
    </div>
  );
}
