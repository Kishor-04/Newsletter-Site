import axios from "axios";

const API_URL = "http://localhost:5000/api/newsletters";

export const fetchNewsletters = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createNewsletter = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
