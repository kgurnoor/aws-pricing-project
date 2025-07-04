// backend/routes/chatbot.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const apiKey = process.env.GEMINI_API_KEY;

router.post('/chatbot', async (req, res) => {
  const { messages } = req.body;
  if (!apiKey) {
    return res.status(500).json({ reply: "Gemini API key not configured." });
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))
    });
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (err) {
    res.status(500).json({ reply: "Error contacting Gemini API." });
  }
});

module.exports = router;
