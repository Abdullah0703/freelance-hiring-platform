import axios from "axios";
import { BASE_URL } from "./constants";
export const BASE_URL_FRONTEND = "http://localhost:3001";

export const vatTax = 5 / 100;
const token = localStorage.getItem("token");


export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      credentials,
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


export const signupUser = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/signup`,
      data,
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