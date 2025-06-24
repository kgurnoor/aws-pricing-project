import React, { useState } from "react";
import ChatbotModal from "./ChatbotModal";

const Navbar: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <nav style={{ /* your navbar styles */ }}>
      {/* ...your other navbar content... */}
      <button onClick={() => setShowChatbot(true)}>Chatbot</button>
      <ChatbotModal visible={showChatbot} onClose={() => setShowChatbot(false)} />
    </nav>
  );
};

export default Navbar;
