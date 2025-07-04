import React, { useState, useRef, useEffect } from "react";
import Modal from "@cloudscape-design/components/modal";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import Spinner from "@cloudscape-design/components/spinner";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import { fetchChatbotReply } from "../../api/chatbotApi";

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
      const reply = await fetchChatbotReply([...messages, userMessage]);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: reply || "Sorry, I couldn't get a response." },
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
    <Modal
      visible={visible}
      onDismiss={onClose}
      header="AWS Pricing Assistant"
      footer={
        <SpaceBetween direction="horizontal" size="xs">
          <Input
            value={input}
            onChange={({ detail }) => setInput(detail.value)}
            onKeyDown={(e) => {
              // Cloudscape Input uses e.detail.key, not e.key
              // TypeScript workaround for the custom event type
              if ((e as any).detail?.key === "Enter") handleSend();
            }}
            placeholder="Type your question..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? <Spinner /> : "Send"}
          </Button>
        </SpaceBetween>
      }
    >
      <div style={{ maxHeight: 350, overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <Box key={idx} margin={{ bottom: "xs" }}>
            <span
              style={{
                color: msg.role === "user" ? "#0070f3" : "#444",
                fontWeight: "bold",
              }}
            >
              {msg.role === "user" ? "You" : "Bot"}:
            </span>{" "}
            {msg.content}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </Modal>
  );
};

export default ChatbotModal;
