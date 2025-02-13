import axios from "axios";

import { BASE_URL } from "./constants";


let sender = null;


const currentuser = JSON.parse(localStorage.getItem("user"));

if (currentuser) {
    sender = currentuser.userId;

} else {
    // Handle the case where currentuser doesn't exist in local storage
    console.error("currentuser not found in local storage");
}
export const getcontacts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/chat/contacts/${sender}`);
        const data = response.data;
        if (data) {
            return data;
        } else {
            throw new Error("Error retrieving contacts");
        }
    } catch (error) {
        console.error("Error retrieving contacts:", error);
        throw error;
    }
};


export const getmessages = async (receiver) => {
    try {
        const response = await axios.get(`${BASE_URL}/chat/message/${sender}/${receiver}`);
        console.log(response);
        const data = response.data;
        if (data) {
            return data;
        } else {
            console.log(response);

            throw new Error("Error here");
        }
    } catch (error) {
        console.error("Error here", error);
        throw error;
    }
};



export const addContact = async (contactId, userId) => {
    try {
        console.log("Aaaaaaaaaaaaaaa", contactId)
        const response = await axios.post(`${BASE_URL}/chat/contacts`, { contactId: contactId, userId: userId });
        return response.data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }

};


export const sendMessage = async (senderId, receiverId, content, getmsgs) => {
    try {
        const response = await axios.post(`${BASE_URL}/chat/message/send`, { sender: senderId, receiver: receiverId, content: content }, {
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
        });
        getmsgs(receiverId);
        return response.data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }

};