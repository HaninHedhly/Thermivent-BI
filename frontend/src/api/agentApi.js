// src/api/agentApi.js
import axios from "axios";

const AGENT_BASE_URL = import.meta.env.VITE_AGENT_API_URL || "http://localhost:8000";

const agentAxios = axios.create({
  baseURL: AGENT_BASE_URL,
  timeout: 60000, // 60s — Gemini peut être lent
});

export const sendMessageToAgent = async (message, sessionId = "default") => {
  try {
    const response = await agentAxios.post("/chat", {
      message,
      session_id: sessionId,
    });
    return response.data;
  } catch (error) {
    // Erreur réseau (serveur Python éteint, timeout...)
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      return {
        response: {
          output: "Le serveur IA est inaccessible. Vérifiez que FastAPI tourne sur le port 8000.",
          sql_query: null,
          success: false,
          error_type: "server_offline",
        },
        success: false,
      };
    }
    if (error.code === "ECONNABORTED") {
      return {
        response: {
          output: "La requête a pris trop de temps. Réessayez dans quelques secondes.",
          sql_query: null,
          success: false,
          error_type: "timeout",
        },
        success: false,
      };
    }
    throw error;
  }
};

export const clearAgentSession = async (sessionId) => {
  const response = await agentAxios.delete(`/chat/${sessionId}`);
  return response.data;
};

export const checkAgentHealth = async () => {
  const response = await agentAxios.get("/health");
  return response.data;
};