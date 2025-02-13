import axios from "axios";
import { BASE_URL } from "./constants";

export const BASE_URL_FRONTEND = "http://localhost:3001";

export const vatTax = 5 / 100;
const token = localStorage.getItem("token");


export async function getAllClients() {
    try {
        const response = await axios.get(`${BASE_URL}/user/clients`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data; // Return the data from the API response
    } catch (error) {
        throw error;
    }
}

export async function deleteClientById(employeeId) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/user/${employeeId}`
        );
        return response.data; // Return the data from the API response
    } catch (error) {
        throw error;
    }
}
export const getClientDashboardData = async (clientId) => {
    try {
        const response = await axios.get(`${BASE_URL}/dashboard/client-dashboard/${clientId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data; 
    } catch (error) {
        throw error;
    }
};
export const createClient = async (employeeData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/signup`,
            employeeData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; // Return the response data
    } catch (error) {
        throw error;
    }
};


export const updateClient = async (id, updatedData) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/user/${id}`,
            updatedData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
