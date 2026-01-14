const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('API - Token from localStorage:', token);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  console.log('API - Headers being sent:', headers);
  return headers;
};

export const api = {
  post: async (endpoint, data) => {
    console.log(`API - POST ${endpoint}`, data);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    console.log(`API - Response status: ${response.status} ${response.statusText}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`API - Error response:`, errorText);
      throw new Error(errorText);
    }
    const result = await response.json();
    console.log(`API - Success response:`, result);
    return result;
  },
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  postFile: async (endpoint, formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }
};