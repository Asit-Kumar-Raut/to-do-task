const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendReminderEmail } = require('./emailService');

const startCronJobs = () => {
  // Run every minute to check for tasks due in the next 15 minutes
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const in15Minutes = new Date(now.getTime() + 15 * 60000);

      // Find tasks that are pending, have a due date, and aren't reminded yet
      const tasksToRemind = await Task.find({
        status: 'Pending',
        reminderSent: false,
        dueDate: {
          $gte: now,
          $lte: in15Minutes
        }
      }).populate('user', 'name email');

      for (const task of tasksToRemind) {
        if (task.user && task.user.email) {
          await sendReminderEmail(task.user.email, task.title, task.user.name);
          task.reminderSent = true;
          await task.save();
        }
      }
    } catch (error) {
      console.error('Error running reminder cron job:', error);
    }
  });
  console.log('Cron jobs started.');
};

module.exports = { startCronJobs };
