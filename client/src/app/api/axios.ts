import axios from "axios";
import { API_URL } from "@/app/env";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export default api;
