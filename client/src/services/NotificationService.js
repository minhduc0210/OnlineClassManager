import { api } from "./AuthService";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchGetNotifications = async () => {
  const result = await api.get(`${BASE_URL}/notifications`);
  return result;
};

export const fetchMarkNotificationAsRead = async (notificationID) => {
  const result = await api.put(`${BASE_URL}/notifications/${notificationID}`);
  return result;
};