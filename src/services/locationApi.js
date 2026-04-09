import apiClient from './apiClient'

export const fetchLocations = async () => {
  const response = await apiClient.get('/locations')
  return response.data
}

export const createLocation = async (payload) => {
  const response = await apiClient.post('/location', payload)
  return response.data
}

export const deleteLocationById = async (id) => {
  await apiClient.delete('/location', {
    data: { id },
  })
}
