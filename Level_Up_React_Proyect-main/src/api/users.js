import axios from 'axios'

const baseURL = (import.meta.env?.VITE_AUTH_BASEURL ?? 'http://localhost:8081').trim()

export const usersApi = axios.create({ baseURL })

export async function getUsers() {
  const { data } = await usersApi.get('/api/users')
  return Array.isArray(data) ? data : []
}

export async function updateUser(id, updates) {
  const { data } = await usersApi.put(`/api/users/${id}`, updates)
  return data
}

export async function registerUser({ name, email, password, role }) {
  const { data } = await usersApi.post('/api/auth/register', { name, email, password, role })
  return data
}

export async function deleteUser(id) {
  await usersApi.delete(`/api/users/${id}`)
}