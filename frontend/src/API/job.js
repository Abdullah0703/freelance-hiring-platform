import axios from "axios";
import { BASE_URL } from "./constants";

export const BASE_URL_FRONTEND = "http://localhost:3001";

export const vatTax = 5 / 100;
const token = localStorage.getItem("token");

const role = localStorage.getItem("role");
const user = JSON.parse(localStorage.getItem("user"));



export async function getAllJobs() {
    try {

        if (role == 'ADMIN') {
            const response = await axios.get(`${BASE_URL}/job`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data; 
        } else if (role == "CLIENT") {
            const response = await axios.get(`${BASE_URL}/job/client/${user.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.data; 
        } else {
            const response = await axios.get(`${BASE_URL}/job/biller/${user.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data; // Return the data from the API response
        }
    } catch (error) {
        throw error;
    }
}

export async function deleteJobById(jobId) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/job/${jobId}`
        );
        return response.data; // Return the data from the API response
    } catch (error) {
        throw error;
    }
}

export const createJob = async (jobData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/job`,
            jobData,
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


export const updateJob = async (id, updatedData) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/job/${id}`,
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

export const getJobsAssignedToBiller = async (billerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/job/biller/${billerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.jobs; // Return the jobs assigned to the biller
    } catch (error) {
        throw error;
    }
}

export const createJobAssignment = async (jobAssignmentData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/jobAssignment`, // Adjust the endpoint if necessary
            jobAssignmentData,
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

export const getBillersByJobId = async (jobId) => {
    try {
        const response = await axios.get(`${BASE_URL}/jobAssignment/${jobId}`);
        return response.data; // Assuming the API returns an array of billers
    } catch (error) {
        console.error('Error fetching billers by job ID:', error);
        throw error;
    }
};
