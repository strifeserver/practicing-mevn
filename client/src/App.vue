<script setup>
import { ref, onMounted } from 'vue'
import TaskForm from './components/tasks/TaskForm.vue'
import TaskList from './components/tasks/TaskList.vue'

// Target backend API running on port 5050
const API_URL = `http://${window.location.hostname}:5050/api/tasks`

const tasks = ref([])
const taskTitle = ref('')
const searchQuery = ref('')
const editingId = ref(null)
const loading = ref(false)

// 1. READ: Fetch tasks (supports ?search= query filter)
const fetchTasks = async () => {
  try {
    loading.value = true
    const url = searchQuery.value.trim()
      ? `${API_URL}?search=${encodeURIComponent(searchQuery.value.trim())}`
      : API_URL

    const res = await fetch(url)
    tasks.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch tasks:', err)
  } finally {
    loading.value = false
  }
}

// 2. CREATE or UPDATE
const saveTask = async () => {
  if (!taskTitle.value.trim()) return

  if (editingId.value) {
    // UPDATE existing task title
    await fetch(`${API_URL}/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskTitle.value })
    })
    editingId.value = null
  } else {
    // CREATE new task
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskTitle.value })
    })
  }

  taskTitle.value = ''
  fetchTasks()
}

// 3. UPDATE: Toggle completed status
const toggleComplete = async (task) => {
  await fetch(`${API_URL}/${task._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !task.completed })
  })
  fetchTasks()
}

// Edit Mode helpers
const startEdit = (task) => {
  editingId.value = task._id
  taskTitle.value = task.title
}

const cancelEdit = () => {
  editingId.value = null
  taskTitle.value = ''
}

// 4. DELETE
const deleteTask = async (id) => {
  if (!confirm('Are you sure you want to delete this task?')) return

  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  fetchTasks()
}

// Load initial tasks on mount
onMounted(() => {
  fetchTasks()
})
</script>

<template>
  <div class="container">
    <h1>MEVN Task Manager</h1>

    <div class="card">
      <!-- 1. REALTIME SEARCH FILTER INPUT -->
      <label><strong>Search / Filter:</strong></label>
      <input
        type="text"
        class="filter-input"
        v-model="searchQuery"
        @input="fetchTasks"
        placeholder="Type to filter tasks dynamically..."
      />

      <!-- 2. SEGREGATED TASK FORM COMPONENT -->
      <TaskForm
        v-model="taskTitle"
        :editing-id="editingId"
        @submit="saveTask"
        @cancel="cancelEdit"
      />
    </div>

    <!-- 3. SEGREGATED TASK LIST COMPONENT -->
    <TaskList
      :tasks="tasks"
      :loading="loading"
      @toggle="toggleComplete"
      @edit="startEdit"
      @delete="deleteTask"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #333;
}
h1 {
  text-align: center;
  margin-bottom: 24px;
}
.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}
input[type="text"] {
  padding: 10px 12px;
  font-size: 15px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
}
.filter-input {
  width: 100%;
  margin-top: 6px;
  margin-bottom: 16px;
}
</style>
