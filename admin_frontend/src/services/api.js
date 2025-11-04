import axios from "axios";

const BASE_URL = "http://192.168.88.16:8080";

const api = axios.create({
  baseURL: BASE_URL,
});

export { BASE_URL };
export default api;
