import axios from "axios";
import { BASE_URL } from "./constants";
const role = localStorage.getItem("role");
const user = JSON.parse(localStorage.getItem("user"));
// Function to create a new work log
export async function createWorkLog(workLogData) {
    try {
        const response = await axios.post(`${BASE_URL}/workLog`, workLogData); // Updated endpoint
        console.log("response", response);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to update an existing work log
export async function updateWorkLog(workLogId, workLogData) {
    try {
        const response = await axios.put(`${BASE_URL}/workLog/${workLogId}`, workLogData); // Updated endpoint
        console.log("response", response);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get all work logs
export async function getAllWorkLogs() {
    try {
        const response = await axios.get(`${BASE_URL}/workLog`); // Updated endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get a work log by its ID
export async function getWorkLogById(workLogId) {
    try {
        const response = await axios.get(`${BASE_URL}/workLog/${workLogId}`); // Updated endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get work logs by biller ID and job ID
export async function getWorkLogsByBillerAndJobId(userId, jobId) {
    try {
        const response = await axios.get(`${BASE_URL}/workLog/biller-by-job/${user.userId}/${jobId}`); // Updated endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get work logs by biller ID
export async function getWorkLogsByBillerId(billerId) {
    try {
        const response = await axios.get(`${BASE_URL}/workLog/biller/${user.userId}`); // Updated endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getWorkLogsByClientId(clientId) {
    try {
        const response = await axios.get(`${BASE_URL}/workLog/client/${user.userId}`); // Updated endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to delete a work log by work log ID
export async function deleteWorkLog(workLogId) {
    try {
        const response = await axios.delete(`${BASE_URL}/workLog/${workLogId}`); // Updated endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
}
