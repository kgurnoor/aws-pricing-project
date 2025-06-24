import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

interface Message {
  role: "user" | "bot";
  content: string;
}

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible) {
      setMessages([
        {
          role: "bot",
          content:
            "Hi! I’m your AWS Pricing Assistant. Ask me about AWS pricing, cost optimization, or how to use this app.",
        },
      ]);
    }
  }, [visible]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        ...messages.map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
        { role: "user", parts: [{ text: input }] },
      ]);
      const response = result.response.text();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: response || "Sorry, I couldn't get a response." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "There was an error contacting Gemini API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 0 24px rgba(0,0,0,0.2)",
          padding: 24,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          ×
        </button>
        <div
          style={{
            maxHeight: 350,
            overflowY: "auto",
            marginBottom: 16,
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                margin: "8px 0",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: 12,
                  background:
                    msg.role === "user" ? "#d1e7fd" : "#f1f1f1",
                  color: "#222",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type your question..."
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "#0070f3",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
