<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  location: {
    type: Object,
    default: null,
  },
  addressLoading: {
    type: Boolean,
    default: false,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'submit'])
const name = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      name.value = ''
    }
  },
)

const canSubmit = computed(() => {
  return Boolean(name.value.trim()) && !props.submitting && !props.addressLoading
})

const onSubmit = () => {
  if (!canSubmit.value) {
    return
  }

  emit('submit', name.value.trim())
}
</script>

<template>
  <div v-if="open">
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Save Location</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="emit('close')"></button>
          </div>
          <div class="modal-body">
            <p class="mb-2"><strong>Longitude:</strong> {{ location?.lng }}</p>
            <p class="mb-2"><strong>Latitude:</strong> {{ location?.lat }}</p>
            <p class="mb-3">
              <strong>Address:</strong>
              <span v-if="addressLoading">Fetching address...</span>
              <span v-else>{{ location?.address || 'Address not found.' }}</span>
            </p>

            <div class="mb-2">
              <label for="location-name" class="form-label">Name</label>
              <input
                id="location-name"
                v-model="name"
                type="text"
                class="form-control"
                placeholder="Enter a location name"
                :disabled="submitting"
              />
            </div>

            <div v-if="errorMessage" class="alert alert-danger py-2 mb-0">
              {{ errorMessage }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" :disabled="submitting" @click="emit('close')">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" :disabled="!canSubmit" @click="onSubmit">
              {{ submitting ? 'Saving...' : 'Save Location' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>
