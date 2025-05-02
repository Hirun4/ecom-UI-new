import axios from "axios";
import { API_BASE_URL } from "./constant";

export const loginAPI = async (body) => {
  const url = API_BASE_URL + "/api/auth/login";
  console.log("Login API called with URL:", url);
  console.log("Request body:", body);
  try {
    const response = await axios(url, {
      method: "POST",
      data: body,
    });
    console.log("API response received:", response);
    return response?.data;
  } catch (err) {
    console.error("API error response:", err.response);
    console.error("API error message:", err.message);

    throw new Error(err.response?.data?.message || err.message);
  }
};

export const registerAPI = async (body) => {
  const url = API_BASE_URL + "/api/auth/register";
  try {
    const response = await axios(url, {
      method: "POST",
      data: body,
    });
    return response?.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const verifyAPI = async (body) => {
  const url = API_BASE_URL + "/api/auth/verify";
  try {
    const response = await axios(url, {
      method: "POST",
      data: body,
    });
    return response?.data;
  } catch (err) {
    throw new Error(err);
  }
};
