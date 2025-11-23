import axios from 'axios'

const baseURL = (import.meta.env?.VITE_COUPONS_BASEURL ?? 'http://localhost:8084').trim()

export const couponsApi = axios.create({ baseURL })

const toClient = (dto) => ({
  id: dto?.id,
  codigo: dto?.discount_code ?? '',
  porcentajeDescuento: dto?.discount_value ?? 0,
  estado: dto?.state ?? 'HABILITADO',
})

const toServer = (model) => ({
  discount_code: model?.codigo,
  discount_value: model?.porcentajeDescuento,
  state: model?.estado,
})

export async function getCoupons() {
  const { data } = await couponsApi.get('/api/v1/coupons')
  const list = Array.isArray(data) ? data : []
  return list.map(toClient)
}

export async function getCoupon(id) {
  const { data } = await couponsApi.get(`/api/v1/coupons/${id}`)
  return toClient(data)
}

export async function createCoupon(couponData) {
  const payload = toServer(couponData)
  const { data } = await couponsApi.post('/api/v1/coupons', payload)
  return toClient(data)
}

export async function updateCoupon(id, updates) {
  const payload = toServer(updates)
  const { data } = await couponsApi.put(`/api/v1/coupons/${id}`, payload)
  return toClient(data)
}

export async function deleteCoupon(id) {
  await couponsApi.delete(`/api/v1/coupons/${id}`)
}

export async function findCouponByCode(code) {
  const list = await getCoupons()
  const upper = String(code || '').trim().toUpperCase()
  return list.find(c => String(c.codigo || '').toUpperCase() === upper) || null
}