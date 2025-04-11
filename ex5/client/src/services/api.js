import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const sendPayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

export default api;