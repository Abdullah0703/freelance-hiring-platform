import axios from "axios";
import { BASE_URL } from "./constants";

export async function getDashbaordData() {
    try {
        const response = await axios.get(`${BASE_URL}/dashboard`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data; 
    } catch (error) {
        throw error;
    }
}