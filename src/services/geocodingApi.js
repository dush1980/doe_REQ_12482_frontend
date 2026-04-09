import axios from 'axios'

const geocodingClient = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
  timeout: 15000,
})

export const reverseGeocode = async (lat, lon) => {
  const response = await geocodingClient.get('/reverse', {
    params: {
      format: 'jsonv2',
      lat,
      lon,
    },
  })

  return response.data?.display_name || ''
}
