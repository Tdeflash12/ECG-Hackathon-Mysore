/* eslint-env node */
/* global process */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/contact', (req, res) => {
  const { name, email, message, projectType } = req.body || {};
  console.log('Contact request:', { name, email, projectType, message });
  // Mock reply
  res.json({ success: true, message: 'Thank you — we received your demo request and will contact you.' });
});

app.post('/api/predict', (req, res) => {
  // Very simple mock prediction based on BPM in the body
  const { bpm } = req.body || {};
  const b = Number(bpm || 72);
  let risk = 'Low';
  if (b < 50 || b > 120) risk = 'High';
  else if (b > 100) risk = 'Moderate';
  res.json({ bpm: b, prediction: risk });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Mock API listening on ${port}`));
