import axios from "axios";
import { BASE_URL } from "./constants";

export const BASE_URL_FRONTEND = "http://localhost:3001";

export const vatTax = 5 / 100;
const token = localStorage.getItem("token");


export async function getAllBiller() {
  try {
    const response = await axios.get(`${BASE_URL}/user/billers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("response.data", response.data)
    return response.data; // Return the data from the API response
  } catch (error) {
    throw error;
  }
}

export async function deleteBillerById(employeeId) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/user/${employeeId}`
    );
    return response.data; // Return the data from the API response
  } catch (error) {
    throw error;
  }
}
export async function getAllBillerById(billerId) {
  try {
    const response = await axios.get(`${BASE_URL}/user/${billerId}`);
    return response.data; // Return the data from the API response
  } catch (error) {
    throw error;
  }
}
export const createBiller = async (employeeData) => {
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

export const updateBiller = async (id, updatedData) => {
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

export const getCompletedJobs = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/job/biller/${id}`)
    return response.data;
  } catch (error) {
    throw error;
  }
}
