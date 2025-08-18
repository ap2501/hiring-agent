import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// ===== USERS =====
export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_URL}/users/login`, credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/users`, userData);
  return res.data;
};

// ===== HISTORY =====
export const getHistory = async (token) => {
  const res = await axios.get(`${API_URL}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addHistory = async (historyData, token) => {
  const res = await axios.post(`${API_URL}/history`, historyData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteHistory = async (id, token) => {
  const res = await axios.delete(`${API_URL}/api/history/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
