<script setup>
defineProps({
  locations: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['view', 'delete'])
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body p-0">
      <div v-if="loading" class="p-3">Loading locations...</div>
      <div v-else-if="!locations.length" class="p-3">No saved locations found.</div>
      <div v-else class="table-responsive">
        <table class="table table-striped table-hover mb-0 align-middle">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Longitude</th>
              <th>Latitude</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="location in locations" :key="location.id">
              <td>{{ location.id }}</td>
              <td>{{ location.name }}</td>
              <td>{{ location.address }}</td>
              <td>{{ location.longitude }}</td>
              <td>{{ location.latitude }}</td>
              <td class="text-end">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="emit('view', location)">View in Map</button>
                  <button class="btn btn-sm btn-outline-danger" @click="emit('delete', location)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
