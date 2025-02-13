import axios from "axios";

export const BASE_URL = "https://backend.cognisoftlabs.com";


export async function getAnnouncementByEmployee() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${BASE_URL}/api/employee/announcements`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
