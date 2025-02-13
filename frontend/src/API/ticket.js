import axios from "axios";
import { BASE_URL } from "./constants";
export const BASE_URL_FRONTEND = "http://localhost:3001";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const user = JSON.parse(localStorage.getItem("user"));

// Create a new ticket
export const createTicket = async (ticketData) => {
    try {
        console.log("ticket data from the API", ticketData)
        const response = await axios.post(
            `${BASE_URL}/ticket`,
            ticketData,
            {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Response data from the API")
        return response.data; // Return the created ticket data
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};

// Get all tickets
export const getAllTickets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/ticket`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data; // Return the list of tickets and statistics
    } catch (error) {
        console.error('Error retrieving all tickets:', error);
        throw error;
    }
};

// Get tickets for a specific client
export const getClientTickets = async (clientId) => {
    try {
        const response = await axios.get(`${BASE_URL}/Ticket/${clientId}`, {
            headers: {
                // Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data; // Return the list of tickets for the client
    } catch (error) {
        console.error('Error retrieving client tickets:', error);
        throw error;
    }
};

// Mark a ticket as resolved by admin
export const markResolvedByAdmin = async (ticketId) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/Ticket/${ticketId}/resolvebyAdmin`,
            {},
            {
                headers: {
                    // Authorization: `Bearer ${token}`,
                     "Content-Type": "application/json",
                },
            }
        );
        return response.data; // Return the updated ticket data
    } catch (error) {
        console.error('Error marking ticket as resolved by admin:', error);
        throw error;
    }
};

// Mark a ticket as resolved by client
export const markResolvedByClient = async (ticketId) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/Ticket/${ticketId}/resolvebyClient`,
            {},
            {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; // Return the updated ticket data
    } catch (error) {
        console.error('Error marking ticket as resolved by client:', error);
        throw error;
    }
};

export const editTicket = async (ticketId, updatedData) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/Ticket/${ticketId}/edit`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; // Return the updated ticket data
    } catch (error) {
        console.error('Error editing ticket:', error);
        throw error;
    }
    
};

export const deleteTicket = async (ticketId) => {
    console.log("Ticket id check:",ticketId)
    try {
        const response = await axios.delete(`${BASE_URL}/Ticket/${ticketId}`, {
            headers: {
                // Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data; // Return the success message or deleted ticket data
    } catch (error) {
        console.error('Error deleting ticket:', error);
        throw error;
    }
};