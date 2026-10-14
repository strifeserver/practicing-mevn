<script setup>
defineProps({
  tasks: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle', 'edit', 'delete'])
</script>

<template>
  <div class="card">
    <div v-if="loading" class="status-msg">Loading tasks...</div>
    <div v-else-if="tasks.length === 0" class="status-msg">No tasks found.</div>
    <ul v-else class="task-list">
      <li v-for="task in tasks" :key="task._id" class="task-item">
        <div class="task-left">
          <input
            type="checkbox"
            :checked="task.completed"
            @change="$emit('toggle', task)"
          />
          <span :class="{ completed: task.completed }">
            {{ task.title }}
          </span>
        </div>

        <div class="task-actions">
          <button class="btn-edit" @click="$emit('edit', task)">Edit</button>
          <button class="btn-delete" @click="$emit('delete', task._id)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.status-msg {
  text-align: center;
  color: #6b7280;
  padding: 12px 0;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  border-bottom: 1px solid #f3f4f6;
}

.task-item:last-child {
  border-bottom: none;
}

.task-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.completed {
  text-decoration: line-through;
  color: #9ca3af;
}

.task-actions {
  display: flex;
  gap: 6px;
}

button {
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}

.btn-edit {
  background: #3b82f6;
  color: #fff;
}

.btn-delete {
  background: #ef4444;
  color: #fff;
}
</style>
