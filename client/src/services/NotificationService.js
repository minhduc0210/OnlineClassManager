import { api } from "./AuthService";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchGetNotifications = async () => {
  const result = await api.get(`${BASE_URL}/notifications`);
  return result;
};