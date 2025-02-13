import axios from 'axios';
import { BASE_URL } from "./constants";

export async function fetchNotifications(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/api/notifications/${userId}`);
        console.log("Response from fetchNotificationsForAdmin:", response);
        return response.data; // Return the data from the API response
    } catch (error) {
        throw error;
    }
};
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axios.patch(`${BASE_URL}/api/notifications/${notificationId}/read`);
        return response.data; // Assuming your API returns { success: true }
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw new Error('Failed to mark notification as read');
    }
};
export const getUnreadNotificationsCount = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/notifications/${userId}/unread-count`);
        return response.data; // Assuming your API returns { count: number }
    } catch (error) {
        console.error('Error fetching unread notifications count:', error);
        throw new Error('Failed to fetch unread notifications count');
    }
};
