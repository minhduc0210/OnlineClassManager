import { api } from "./AuthService";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchCreatePost = async (classroomID, inputs) => {
  const result = await api.post(`${BASE_URL}/posts/${classroomID}`, inputs);
  return result;
};

export const fetchPostsByClassroom = async (classroomID) => {
  const result = await api.get(`${BASE_URL}/posts/${classroomID}`);
  return result;
};

export const fetchDownloadPostFile = (filename) => {
  const filePath = `${BASE_URL}/posts/download/${filename}`;
  return filePath;
};

export const fetchDeletePost = async (classroomID, postID) => {
  const result = await api.delete(`${BASE_URL}/posts/${classroomID}/${postID}`);
  return result
};