import api from './client'

export const getOrders = (params) => api.get('/orders', { params }).then((res) => res.data)
export const getOrder = (id) => api.get(`/orders/${id}`).then((res) => res.data)
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}`, { status }).then((res) => res.data)
export const deleteOrder = (id) => api.delete(`/orders/${id}`).then((res) => res.data)
