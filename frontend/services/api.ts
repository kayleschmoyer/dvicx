import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
});

export async function getWorkOrders(mechanicId: string) {
  const response = await api.get(`/work-orders/${mechanicId}`);
  return response.data;
}

export async function getLineItems(orderId: number) {
  const response = await api.get(`/line-items/${orderId}`);
  return response.data;
}

export async function submitInspection(data: any) {
  const response = await api.post('/inspections', data);
  return response.data;
}

export default api;
