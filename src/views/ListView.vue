<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import LocationTable from '../components/LocationTable.vue'
import { getApiErrorMessage } from '../services/apiError'
import { deleteLocationById, fetchLocations } from '../services/locationApi'

const router = useRouter()
const locations = ref([])
const loading = ref(false)
const errorMessage = ref('')

const loadLocations = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await fetchLocations()
    locations.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch locations:', error)
    errorMessage.value = getApiErrorMessage(error, 'Failed to load locations. Please refresh and try again.')
  } finally {
    loading.value = false
  }
}

const viewLocation = (location) => {
  router.push({
    name: 'map',
    query: {
      id: location.id,
      lat: location.latitude,
      lng: location.longitude,
    },
  })
}

const deleteLocation = async (location) => {
  const confirmed = window.confirm(`Delete location "${location.name}"?`)

  if (!confirmed) {
    return
  }

  try {
    await deleteLocationById(location.id)
    await loadLocations()
  } catch (error) {
    console.error('Failed to delete location:', error)
    errorMessage.value = getApiErrorMessage(error, 'Failed to delete location. Please try again.')
  }
}

onMounted(() => {
  loadLocations()
})
</script>

<template>
  <section>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="h4 mb-0">List</h2>
      <button class="btn btn-outline-secondary" :disabled="loading" @click="loadLocations">Refresh</button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <LocationTable :locations="locations" :loading="loading" @view="viewLocation" @delete="deleteLocation" />
  </section>
</template>
