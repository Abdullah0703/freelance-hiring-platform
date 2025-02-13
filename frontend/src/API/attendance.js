import axios from "axios";
import { BASE_URL } from "./constants";

export const vatTax = 5 / 100;
const token = localStorage.getItem("token");


export async function getAllAttendance() {
    try {
        const response = await axios.get(`${BASE_URL}/attendance`, {
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


export async function getAllAttendancebyId(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/attendance/${userId}`, {
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


export const createAttendance = async (userId) => {
    try {

        console.log("userId", userId);
        const response = await axios.post(
            `${BASE_URL}/attendance/${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; // Return the response data
    } catch (error) {
        throw error;
    }
};


export const updateAttendance = async (attendanceId) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/attendance/${attendanceId}`,
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

export async function deleteAttendanceById(attendanceId) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/attendance/${attendanceId}`
        );
        return response.data; // Return the data from the API response
    } catch (error) {
        throw error;
    }
}





