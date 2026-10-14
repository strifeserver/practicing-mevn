const mongoose = require('mongoose');

// Define Schema for Task
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // automatically creates createdAt and updatedAt
  }
);

// Export Mongoose Model
module.exports = mongoose.model('Task', TaskSchema);
