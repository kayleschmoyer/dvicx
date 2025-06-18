import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.7.185:3000/api',
});

export async function getWorkOrders(mechanicId: string, token?: string) {
  const response = await api.get(`/work-orders/${mechanicId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
}

export async function getMechanics(companyId: number) {
  const res = await api.get(`/mechanics/${companyId}`);
  return res.data;
}

export async function verifyMechanicLogin(data: {
  companyId: number;
  mechanicNumber: number;
  pin: string;
}) {
  const res = await api.post('/mechanics/login', data);
  return res.data;
}

export async function loginMechanic(data: { mechanicId?: number; pin?: string }) {
  const res = await api.post('/auth/login', data);
  return res.data;
}

export async function getLineItems(orderId: number) {
  const response = await api.get(`/line-items/${orderId}`);
  return response.data;
}

export async function submitInspection(data: any) {
  const response = await api.post('/inspections/submit', data);
  return response.data;
}

export default api;
