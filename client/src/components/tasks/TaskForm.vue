<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  editingId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const onInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const onSubmit = () => {
  emit('submit')
}

const onCancel = () => {
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="form-group">
    <input
      type="text"
      :value="modelValue"
      @input="onInput"
      :placeholder="editingId ? 'Edit task title...' : 'Enter new task...'"
      required
    />
    <button type="submit" class="btn-primary">
      {{ editingId ? 'Update Task' : 'Add Task' }}
    </button>
    <button
      type="button"
      v-if="editingId"
      class="btn-secondary"
      @click="onCancel"
    >
      Cancel
    </button>
  </form>
</template>

<style scoped>
.form-group {
  display: flex;
  gap: 8px;
}

.form-group input {
  flex: 1;
  padding: 10px 12px;
  font-size: 15px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
}

button {
  padding: 9px 14px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-secondary {
  background: #6b7280;
  color: #fff;
}
</style>
