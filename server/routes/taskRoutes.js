const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Routes map HTTP requests to Controller functions
router.get('/', taskController.getTasks);          // GET /api/tasks?search=...
router.post('/', taskController.createTask);       // POST /api/tasks
router.put('/:id', taskController.updateTask);     // PUT /api/tasks/:id
router.delete('/:id', taskController.deleteTask);  // DELETE /api/tasks/:id

module.exports = router;
