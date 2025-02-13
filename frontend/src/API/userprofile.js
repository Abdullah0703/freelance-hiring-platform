// src/API/userAPI.js
import axios from 'axios';
import { BASE_URL } from "./constants";

export async function updateUser(id, userData) {
    try {
        const response = await axios.put(`${BASE_URL}/user/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export const fetchUserById = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}`);
        return response;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
    }
};

export const uploadProfilePicture = async (formData, userId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/profile-picture/${userId}`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error(data.message || 'Error uploading profile picture');
      }
  
      return data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  };