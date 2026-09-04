import api from './client'

export const login = (data) => api.post('/admin/login', data).then((res) => res.data)
export const logout = () => api.post('/admin/logout').then((res) => res.data)
export const getMe = () => api.get('/admin/me').then((res) => res.data)
