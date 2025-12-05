import axios from "axios";

const API_BASE_URL = "http://192.168.1.9:8080/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});
