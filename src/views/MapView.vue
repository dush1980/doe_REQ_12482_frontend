<script setup>
import L from 'leaflet'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import LocationFormModal from '../components/LocationFormModal.vue'
import { getApiErrorMessage } from '../services/apiError'
import { reverseGeocode } from '../services/geocodingApi'
import { createLocation, fetchLocations } from '../services/locationApi'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const route = useRoute()
const mapElement = ref(null)
const map = ref(null)
const markersLayer = ref(null)
const isSubmitting = ref(false)
const isAddressLoading = ref(false)
const formError = ref('')
const loadError = ref('')
const selectedLocation = reactive({
  lat: null,
  lng: null,
  address: '',
})
const isFormOpen = ref(false)
const locations = ref([])

const selectedCoordsReady = computed(() => {
  return selectedLocation.lat !== null && selectedLocation.lng !== null
})

const parseCoordinate = (value) => {
  const numericValue = Number(value)
  return Number.isNaN(numericValue) ? null : numericValue
}

const loadLocations = async () => {
  loadError.value = ''

  try {
    const data = await fetchLocations()
    locations.value = Array.isArray(data) ? data : []
    renderLocationMarkers()
  } catch (error) {
    console.error('Failed to load locations:', error)
    loadError.value = getApiErrorMessage(error, 'Failed to load locations.')
  }
}

const renderLocationMarkers = () => {
  if (!markersLayer.value) {
    return
  }

  markersLayer.value.clearLayers()

  locations.value.forEach((location) => {
    const lat = Number(location.latitude)
    const lng = Number(location.longitude)

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return
    }

    const marker = L.marker([lat, lng])
    marker.bindPopup(`<strong>${location.name || 'Unnamed'}</strong><br/>${location.address || ''}`)
    marker.addTo(markersLayer.value)
  })
}

const focusFromQuery = () => {
  if (!map.value) {
    return
  }

  const lat = parseCoordinate(route.query.lat)
  const lng = parseCoordinate(route.query.lng)

  if (lat === null || lng === null) {
    return
  }

  map.value.flyTo([lat, lng], 15)
  L.popup()
    .setLatLng([lat, lng])
    .setContent(`Selected location<br/>Longitude: ${lng}<br/>Latitude: ${lat}`)
    .openOn(map.value)
}

const resetSelection = () => {
  selectedLocation.lat = null
  selectedLocation.lng = null
  selectedLocation.address = ''
}

const onMapClick = async (event) => {
  formError.value = ''
  selectedLocation.lat = Number(event.latlng.lat.toFixed(6))
  selectedLocation.lng = Number(event.latlng.lng.toFixed(6))
  selectedLocation.address = ''
  isFormOpen.value = true
  isAddressLoading.value = true

  try {
    selectedLocation.address = await reverseGeocode(selectedLocation.lat, selectedLocation.lng)
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    selectedLocation.address = ''
    formError.value = 'Unable to fetch address. You can still save this location.'
  } finally {
    isAddressLoading.value = false
  }
}

const closeForm = (force = false) => {
  if (isSubmitting.value && !force) {
    return
  }

  isFormOpen.value = false
  formError.value = ''
  resetSelection()
}

const submitLocation = async (name) => {
  if (!selectedCoordsReady.value) {
    return
  }

  isSubmitting.value = true
  formError.value = ''

  try {
    await createLocation({
      name,
      longitude: selectedLocation.lng,
      latitude: selectedLocation.lat,
      address: selectedLocation.address,
    })

    closeForm(true)
    await loadLocations()
  } catch (error) {
    console.error('Failed to save location:', error)
    formError.value = getApiErrorMessage(error, 'Failed to save location. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await nextTick()

  map.value = L.map(mapElement.value).setView([-33.8688, 151.2093], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)

  markersLayer.value = L.layerGroup().addTo(map.value)
  map.value.on('click', onMapClick)

  await loadLocations()
  focusFromQuery()
})

watch(
  () => [route.query.lat, route.query.lng],
  () => {
    focusFromQuery()
  },
)

onBeforeUnmount(() => {
  if (!map.value) {
    return
  }

  map.value.off('click', onMapClick)
  map.value.remove()
  map.value = null
})
</script>

<template>
  <section>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="h4 mb-0">Map</h2>
      <small class="text-muted">Click anywhere on the map to save a location.</small>
    </div>

    <div v-if="loadError" class="alert alert-danger">{{ loadError }}</div>

    <div ref="mapElement" class="map-container rounded border shadow-sm"></div>

    <LocationFormModal
      :open="isFormOpen"
      :location="selectedLocation"
      :address-loading="isAddressLoading"
      :submitting="isSubmitting"
      :error-message="formError"
      @close="closeForm"
      @submit="submitLocation"
    />
  </section>
</template>

<style scoped>
.map-container {
  height: min(70vh, 680px);
  width: 100%;
  background: #e9ecef;
}
</style>
