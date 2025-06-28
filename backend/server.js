const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

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
    res.status(404).json({ error: 'File not found or invalid JSON' });
  }
});

//for durationSelector
app.get('/api/durations', (req, res) => {
  const filePath = path.join(__dirname, 'pricelists', 'verifiedpermissions', 'index-current-version.json');
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const termKeys = data.terms ? Object.keys(data.terms) : [];
    // You can map these keys to user-friendly labels if needed
    const options = termKeys.map(key => ({
      label: key === "OnDemand" ? "On-Demand" : key, // Add more mappings as needed
      value: key
    }));
    res.json(options);
  } catch (err) {
    res.status(500).json({ error: 'Could not extract durations.' });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
