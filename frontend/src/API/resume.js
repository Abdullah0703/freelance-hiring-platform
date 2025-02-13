import axios from "axios";
import { apiKey, apiUrl, BASE_URL } from './constants';
import Tesseract from 'tesseract.js';
import { pdfjs } from 'react-pdf';
export const BASE_URL_FRONTEND = "http://localhost:3001"; // Assuming the frontend server is running on this port
const token = localStorage.getItem("token");

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


// Function to get all resumes
export const getAllResumes = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/resume`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("response", response)

        return response.data; // Return the data from the API response
    } catch (error) {
        throw error;
    }
};

// Function to delete a resume by ID
export const deleteResumeById = async (resumeId) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/resume/${resumeId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; // Return the data from the API response
    } catch (error) {
        throw error;
    }
};

// Function to upload a resume
export const uploadResume = async (resumeData) => {
    try {
        const formData = new FormData();
        formData.append("pdf", resumeData.pdf);
        formData.append("resumeDetails", JSON.stringify(resumeData.resumeDetails));

        const response = await axios.post(
            `${BASE_URL}/resume`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        console.log("response", response)
        return response.data; // Return the data from the API response
    } catch (error) {
        throw error;
    }
};


export const getPDFText = async (pdfFile, pageNumber) => {
    const pdfData = await pdfjs.getDocument(URL.createObjectURL(pdfFile)).promise;
    const pdfPage = await pdfData.getPage(pageNumber);
    const textContent = await pdfPage.getTextContent();
    return textContent.items.map((item) => item.str).join(' ');
};

export const getImageText = async (imageFile) => {
    const { data: { text } } = await Tesseract.recognize(
        URL.createObjectURL(imageFile),
        'eng',
        { logger: (info) => console.log(info) } // Optional: Log Tesseract.js progress
    );
    return text;
};


function parseChatCompletionResponse(response) {
    if (response && response.choices && response.choices.length > 0) {
        const assistantMessage = response.choices[0].message;
        if (assistantMessage && assistantMessage.role === "assistant") {
            try {
                console.log("assistantMessage", assistantMessage);
                // Remove escape characters for double quotes and surrounding curly braces
                let jsonString = assistantMessage.content.replace(/\\(.)/g, "$1");

                const contentObject = JSON.parse(jsonString);
                return contentObject;
            } catch (error) {
                console.error("Error parsing assistant content:", error);
                return null;
            }
        }
    }
    return null;
}

export const sendToOpenAI = async (convertedText, setResumeData, setBtnLoading) => {
    setBtnLoading(true);
    const requestData = {
        messages: [
            { role: 'system', content: 'Assistant is an AI chatbot that helps users turn a natural language list into JSON format. After users input a list they want in JSON format, it will provide suggested list of attribute labels if the user has not provided any, then ask the user to confirm them before creating the list.' },
            {
                role: 'user', content: convertedText
            },
        ],
        max_tokens: 2000,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 0.95,
        stop: null
    };

    const headers = {
        'Content-Type': 'application/json',
        'api-key': apiKey
    };

    try {
        const response = await axios.post(apiUrl, requestData, { headers });
        const responseData = response.data;
        const assistantContent = parseChatCompletionResponse(responseData);
        console.log('Assistant Content:', assistantContent);
        setResumeData(assistantContent);
        setBtnLoading(false);

        return assistantContent;

        // Handle the response data here
    } catch (error) {
        if (error.response) {
            setBtnLoading(false);

            console.error('Error:', error.response.status, error.response.data);
        } else if (error.request) {
            setBtnLoading(false);

            console.error('Error making the request:', error.request);
        } else {
            setBtnLoading(false);

            console.error('General error:', error.message);
        }
    }
};
