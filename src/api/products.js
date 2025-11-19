import axios from 'axios';

// Base URL del microservicio de productos
const baseURL = import.meta.env?.VITE_PRODUCT_BASEURL || 'http://localhost:8085';

export const api = axios.create({
  baseURL,
});

// Obtiene lista de productos: soporta respuesta plana (array) o paginada (Spring Page)
export async function getProducts() {
  const { data } = await api.get('/api/v1/products');
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
}

// Obtiene un producto por ID
export async function getProduct(id) {
  const { data } = await api.get(`/api/v1/products/${id}`);
  return data;
}

