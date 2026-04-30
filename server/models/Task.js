const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  dueDate: {
    type: Date,
  },
  intervals: [{
    startTime: String, // e.g., '09:00'
    endTime: String,   // e.g., '09:05'
    completed: { type: Boolean, default: false }
  }],
  category: {
    type: String,
    enum: ['Work', 'Study', 'Personal', 'Other'],
    default: 'Other',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
