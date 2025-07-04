// frontend/api/chatbotApi.ts
import apiClient from './apiClient';

export const fetchChatbotReply = async (messages: {role: string, content: string}[]) => {
  const response = await apiClient.post('/chatbot', { messages });
  return response.data.reply;
};
