import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";

export const fetchUserDetails = async () => {
  const url = API_BASE_URL + "/api/user/profile";
  try {
    const response = await axios(url, {
      method: "GET",
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const addAddressAPI = async (data) => {
  const url = API_BASE_URL + "/api/address";
  try {
    const response = await axios(url, {
      method: "POST",
      data: data,
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const updateAddressAPI = async (id, data) => {
  const url = API_BASE_URL + `/api/address/update/${id}`; // Include the address ID in the URL
  try {
    const response = await axios(url, {
      method: "PUT",
      data: data, // Send the updated address data
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err); // Handle errors
  }
};

export const deleteAddressAPI = async (id) => {
  const url = API_BASE_URL + `/api/address/${id}`;
  try {
    const response = await axios(url, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchOrderAPI = async (phone) => {
    console.log('[fetchOrderAPI] Function called');
    const url = `${API_BASE_URL}/api/order1/orders/by-phone/${phone}`;
    console.log('[fetchOrderAPI] Fetching orders for phone:', phone);
    console.log('[fetchOrderAPI] URL:', url);

    try {
        const response = await axios.get(url, {
            headers: getHeaders()
        });
        console.log('[fetchOrderAPI] Response data:', response?.data);
        return response?.data;
    } catch (err) {
        console.error('[fetchOrderAPI] Error fetching orders:', err);
        throw new Error(err);
    }
};

export const cancelOrderAPI = async (id) => {
  const url = API_BASE_URL + `/api/order/cancel/${id}`;
  try {
    const response = await axios(url, {
      method: "POST",
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const updateUserDetailsAPI = async (data, id) => {
  const url = API_BASE_URL + `/api/user/profile/update/${id}`;
  try {
    const response = await axios(url, {
      method: "PUT",
      data: data,
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err);
  }
};
