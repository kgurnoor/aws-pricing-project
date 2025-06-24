const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Helper function to safely read and send JSON files
function sendJsonFile(res, filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(404).json({ error: 'File not found or invalid JSON' });
  }
}

// API 1: Get all AWS services (index.json)
app.get('/api/getAllServices', (req, res) => {
  const filePath = path.join(__dirname, 'index.json');
  sendJsonFile(res, filePath);
});

// API 2: Get Verified Permissions pricing data
// Example: /api/verifiedpermissions/index-version
app.get('/api/verifiedpermissions/:file', (req, res) => {
  const { file } = req.params;
  const allowedFiles = ['index-version', 'index-current-version', 'index-current-region'];
  if (!allowedFiles.includes(file)) {
    return res.status(400).json({ error: 'Invalid file requested' });
  }
  const filePath = path.join(__dirname, 'pricelists', 'verifiedpermissions', `${file}.json`);
  sendJsonFile(res, filePath);
});

// Optional: Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
