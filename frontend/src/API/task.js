import axios from "axios";
import { BASE_URL } from "./constants";


// Function to create a new task
export async function createTask(taskData) {
    try {
        const response = await axios.post(`${BASE_URL}/task`, taskData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to update task
export async function updateTask(taskData) {
    try {
        const response = await axios.put(`${BASE_URL}/task`, taskData);
        return response.data;
    } catch (error) {
        throw error;
    }
}


// Function to assign a task to users
export async function assignTask(assignedTo, assignedBy, taskId) {
    try {
        console.log(assignedTo, assignedBy, taskId);
        const response = await axios.post(`${BASE_URL}/task/assign`, {
            taskId: taskId,
            assignedBy: assignedBy,
            assignedTo: assignedTo
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


// Function to get all task
export async function getAllTasks() {
    try {
        const response = await axios.get(`${BASE_URL}/worklog`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get all task assigned to a user by user ID
export async function getAllTasksByUserId(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/task/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to update task status
export async function updateTaskStatus(taskId, newStatus) {
    try {
        const response = await axios.put(`${BASE_URL}/task/status`, { taskId, status: newStatus });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to delete a task by task ID
export async function deleteTask(taskId) {
    try {
        const response = await axios.delete(`${BASE_URL}/task/${taskId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
