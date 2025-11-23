import axios from 'axios'

const baseURL = (import.meta.env?.VITE_PAYMENT_BASEURL ?? 'http://localhost:8083').trim()

export const paymentApi = axios.create({ baseURL })

export async function getPayments() {
  const { data } = await paymentApi.get('/api/payments')
  return Array.isArray(data) ? data : []
}

export async function getPayment(id) {
  const { data } = await paymentApi.get(`/api/payments/${id}`)
  return data
}