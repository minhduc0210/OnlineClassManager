import axios from "axios"
import { jwtDecode } from "jwt-decode"

//Base URL
const BASE_URL = process.env.REACT_APP_BASE_URL

async function tokenRefresh() {
  const token = localStorage.getItem("refresh-token")
  const result = await axios.post(
    `${BASE_URL}/users/refreshtoken`,
    {},
    { headers: { refreshtoken: token } }
  );
  return result;
}

export const api = axios.create()
api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("access-token")
    let currentDate = new Date()
    const decodedToken = jwtDecode(accessToken)
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      const res = await tokenRefresh()
      localStorage.setItem("access-token", res.data.accessToken)
      localStorage.setItem("refresh-token", res.data.refreshToken)
      config.headers.authorization = `Bearer ${res.data.accessToken}`
    } else {
      config.headers.authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error, "sss")
  }
);

export const fetchRegister = async (inputs) => {
    const result = await axios.post(`${BASE_URL}/users/register`, inputs)
    return result;
  };