// frontend/src/api/agentApi.js
import axios from "axios";

const AGENT_BASE_URL = import.meta.env.VITE_AGENT_API_URL || "http://localhost:8000";

/**
 * Envoie un message au chatbot IA et retourne la réponse
 * @param {string} message - La question de l'analyste
 * @param {string} sessionId - ID de session pour la mémoire conversationnelle
 */
export const sendMessageToAgent = async (message, sessionId = "default") => {
  const response = await axios.post(`${AGENT_BASE_URL}/chat`, {
    message,
    session_id: sessionId,
  });
  return response.data;
};

/**
 * Efface l'historique de conversation d'une session
 * @param {string} sessionId
 */
export const clearAgentSession = async (sessionId) => {
  const response = await axios.delete(`${AGENT_BASE_URL}/chat/${sessionId}`);
  return response.data;
};

/**
 * Vérifie que l'agent IA est disponible
 */
export const checkAgentHealth = async () => {
  const response = await axios.get(`${AGENT_BASE_URL}/health`);
  return response.data;
};