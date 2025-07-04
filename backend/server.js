const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const geminiApiKey = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

/**
 * GET /api/getAllServices
 * Returns the list of all AWS services from index.json
 */
app.get('/api/getAllServices', (req, res) => {
  const filePath = path.join(__dirname, 'index.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading index.json:', err);
    res.status(404).json({ error: 'File not found or invalid JSON' });
  }
});

/**
 * GET /api/verifiedpermissions/:file
 * Returns the requested Verified Permissions pricing file
 * Allowed files: index-version, index-current-version, index-current-region
 */
app.get('/api/verifiedpermissions/:file', (req, res) => {
  const allowedFiles = [
    'index-version',
    'index-current-version',
    'index-current-region'
  ];
  const { file } = req.params;
  if (!allowedFiles.includes(file)) {
    return res.status(400).json({ error: 'Invalid file requested' });
  }
  const filePath = path.join(__dirname, 'pricelists', 'verifiedpermissions', `${file}.json`);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(`Error reading ${file}.json:`, err);
    res.status(404).json({ error: 'File not found or invalid JSON' });
  }
});

// For durationSelector
app.get('/api/durations', (req, res) => {
  const filePath = path.join(__dirname, 'pricelists', 'verifiedpermissions', 'index-current-version.json');
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const termKeys = data.terms ? Object.keys(data.terms) : [];
    const options = termKeys.map(key => ({
      label: key === "OnDemand" ? "On-Demand" : key,
      value: key
    }));
    res.json(options);
  } catch (err) {
    console.error('Error extracting durations:', err);
    res.status(500).json({ error: 'Could not extract durations.' });
  }
});

/**
 * POST /api/chatbot
 * Proxy to Gemini API (Google Generative AI)
 */
app.post('/api/chatbot', async (req, res) => {
  // Debug: Print incoming request
  console.log('Received /api/chatbot request:', req.body);

  if (!geminiApiKey) {
    console.error('Gemini API key not configured.');
    return res.status(500).json({ reply: "Gemini API key not configured." });
  }
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    console.error('Invalid request format:', req.body);
    return res.status(400).json({ reply: "Invalid request format." });
  }
  try {
    // Debug: Print model and key (mask key for safety)
    console.log('Using Gemini API key:', geminiApiKey.slice(0, 8) + '...');
    console.log('Messages:', messages);

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    console.log('Gemini API response:', response.text());

    res.json({ reply: response.text() });
  } catch (err) {
    // Print full error for debugging
    console.error('Gemini API Error:', err?.response?.data || err.message || err);
    res.status(500).json({ reply: "Error contacting Gemini API." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
