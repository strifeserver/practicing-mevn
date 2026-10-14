# MEVN Stack - Simple Task CRUD with Dynamic Search Filter

A minimal, beginner-friendly **MEVN** (MongoDB, Express, Vue 3, Node.js) application built with an **MVC (Model-View-Controller)** pattern.

Includes:
- **C**reate: Add tasks
- **R**ead: View all tasks + real-time title search filter
- **U**pdate: Toggle completion checkbox or edit task title
- **D**elete: Remove tasks

---

## Architecture Overview (MVC)

```text
practice-mevn/
├── server/                           # Backend (Express + Node + Mongoose)
│   ├── .env                          # Environment variables (Mongo URI & Port)
│   ├── server.js                     # App entry point & MongoDB Atlas connection
│   ├── models/
│   │   └── Task.js                   # [M]odel: Defines data structure (Schema)
│   ├── controllers/
│   │   └── taskController.js         # [C]ontroller: Database CRUD & filter logic
│   └── routes/
│       └── taskRoutes.js             # Routes: Maps HTTP endpoints to Controller methods
│
└── client/                           # Frontend (Vue 3 + Vite)
    ├── index.html                    # Root HTML
    ├── vite.config.js                # Vite dev server configuration (port 5173)
    └── src/
        ├── main.js                   # Mounts Vue application
        └── App.vue                   # [V]iew: Form, filter input, and task list
```

---

## How the CRUD Flow Works

### 1. Model (`server/models/Task.js`)
Defines the Mongoose Schema stored in MongoDB Atlas:
```javascript
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });
```

### 2. Controller (`server/controllers/taskController.js`)
All database interaction happens here:
* **Search / Filter & Read (`getTasks`)**: Checks `req.query.search`. If provided, it performs a case-insensitive regex search:
  ```javascript
  const { search } = req.query;
  const query = search ? { title: { $regex: search, $options: 'i' } } : {};
  const tasks = await Task.find(query).sort({ createdAt: -1 });
  ```
* **Create (`createTask`)**: `Task.create({ title: req.body.title })`
* **Update (`updateTask`)**: `Task.findByIdAndUpdate(req.params.id, req.body, { new: true })`
* **Delete (`deleteTask`)**: `Task.findByIdAndDelete(req.params.id)`

### 3. Routes (`server/routes/taskRoutes.js`)
Connects standard REST HTTP methods to controller functions:
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks?search=gym` | Filter tasks matching query |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update title or completed status |
| `DELETE` | `/api/tasks/:id` | Delete task by ID |

### 4. View (`client/src/App.vue`)
The frontend is built with Vue 3's Composition API (`<script setup>`):
* **State**: `tasks`, `taskTitle`, `searchQuery`, `editingId`, `loading`.
* **Dynamic Search Filter**: The filter input uses `v-model="searchQuery"` and triggers `@input="fetchTasks"`. Whenever you type, Vue sends a request to `/api/tasks?search=<query>` and updates the list in real-time.
* **Toggle & Edit**: Checkbox clicks trigger `PUT` with `{ completed: !task.completed }`. Editing loads the task into the input form and sends a `PUT` on submit.

---

## Step-by-Step Setup & How to Run

### Prerequisites
- Node.js (v18 or v20+) & npm
- A MongoDB Atlas account (or local MongoDB)

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Database Access**, create a user (e.g. `mevn`) with read/write privileges.
3. Under **Network Access**, click **Add IP Address** and add your IP or `0.0.0.0/0` (allow from anywhere).
4. Get your connection string and add it to `server/.env`:
   ```env
   PORT=5050
   MONGO_URI=mongodb://<username>:<password>@cluster0-shard-00-00.lcxk2.mongodb.net:27017,cluster0-shard-00-01.lcxk2.mongodb.net:27017,cluster0-shard-00-02.lcxk2.mongodb.net:27017/practice_mevn?ssl=true&replicaSet=atlas-vchl7u-shard-0&authSource=admin&appName=Cluster0
   ```

---

### 2. Run the Backend API (Terminal 1)
```bash
cd server
npm install
npm run dev    # or 'npm start'
```
* Backend runs at: `http://localhost:5050`
* Test endpoint: `http://localhost:5050/api/tasks`

---

### 3. Run the Frontend Client (Terminal 2)
```bash
cd client
npm install
npm run dev
```
* Frontend runs at: `http://localhost:5173`
* Open your browser and go to `http://localhost:5173` (or your machine's LAN IP `http://<your-lan-ip>:5173`).

---

## Git Setup (Push to GitHub)

From the project root:
```bash
git init
git add .
git commit -m "Initial commit: Simplest MEVN Task CRUD with MVC and filter"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```
*(Make sure `server/.env` and `node_modules` remain in `.gitignore` so your database credentials are not committed).*
