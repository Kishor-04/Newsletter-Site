import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createNewsletter = async (formData) => {
    return await axios.post(`${API_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const fetchNewsletters = async () => {
    return await axios.get(`${API_URL}`);
};
