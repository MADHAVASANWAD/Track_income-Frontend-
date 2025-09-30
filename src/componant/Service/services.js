import axios from "axios";
import { getToken } from "../../auth";

const baseurl = "http://localhost:8081";

const token= getToken();

export const api = axios.create({
    baseURL: baseurl,
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})