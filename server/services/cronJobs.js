const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendReminderEmail } = require('./emailService');

const startCronJobs = () => {
  // 1. Run every minute to check for tasks due in the next 15 minutes
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const in15Minutes = new Date(now.getTime() + 15 * 60000);

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
      console.error('Error running 15-min reminder cron job:', error);
    }
  });

  // 2. Run every hour to check for tasks due "tomorrow" that haven't been reminded
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);

      const tasksToRemind = await Task.find({
        status: 'Pending',
        reminderSent: false,
        dueDate: {
          $gte: tomorrowStart,
          $lte: tomorrowEnd
        }
      }).populate('user', 'name email');

      for (const task of tasksToRemind) {
        if (task.user && task.user.email) {
          await sendReminderEmail(task.user.email, task.title + " (Due Tomorrow)", task.user.name);
          // We don't mark reminderSent = true here if we still want the 15-min reminder,
          // but if we do, the 15-min won't fire. Let's just send the email.
        }
      }
    } catch (error) {
      console.error('Error running tomorrow reminder cron job:', error);
    }
  });

  // 3. Run every minute to check 5-minute intervals
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      const tasksToRemind = await Task.find({
        status: 'Pending',
        'intervals': {
          $elemMatch: {
            startTime: currentTime,
            completed: false,
            reminderSent: false
          }
        }
      }).populate('user', 'name email');

      for (const task of tasksToRemind) {
        let taskModified = false;
        
        for (const interval of task.intervals) {
          if (interval.startTime === currentTime && !interval.completed && !interval.reminderSent) {
            if (task.user && task.user.email) {
              await sendReminderEmail(
                task.user.email, 
                `${task.title} (Interval ${interval.startTime} - ${interval.endTime})`, 
                task.user.name
              );
              interval.reminderSent = true;
              taskModified = true;
            }
          }
        }

        if (taskModified) {
          await task.save();
        }
      }
    } catch (error) {
      console.error('Error running interval reminder cron job:', error);
    }
  });

  console.log('Cron jobs started. Monitoring 15-minute, tomorrow deadlines, and 5-minute intervals.');
};

module.exports = { startCronJobs };
