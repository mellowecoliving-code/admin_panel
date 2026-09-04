import api from './client'

export const getProfile = () => api.get('/admin/me').then((res) => res.data)
export const updateProfile = (data) => api.put('/admin/me', data).then((res) => res.data)
export const changePassword = (data) => api.put('/admin/me/password', data).then((res) => res.data)
