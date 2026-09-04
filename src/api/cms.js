import api from './client'

export const getAllSections = () => api.get('/cms').then((res) => res.data)
export const getSection = (section) => api.get(`/cms/${section}`).then((res) => res.data)
export const updateSection = (section, data) =>
  api.put(`/cms/${section}`, data).then((res) => res.data)

export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api
    .post('/cms/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)
}
