import React from 'react';
import { Calendar, Clock, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function TaskCard({ task, onUpdate, onDelete }) {
  const isCompleted = task.status === 'Completed';

  const toggleStatus = () => {
    onUpdate(task._id, { status: isCompleted ? 'Pending' : 'Completed' });
  };

  const priorityColors = {
    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`p-5 rounded-2xl border transition-all ${
        isCompleted 
        ? 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-800 opacity-60' 
        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <button onClick={toggleStatus} className={`mt-0.5 transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-primary'}`}>
            <CheckCircle size={22} className={isCompleted ? 'fill-green-100 dark:fill-green-900/20' : ''} />
          </button>
          <div>
            <h3 className={`font-semibold text-lg leading-tight ${isCompleted ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => onDelete(task._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-medium">
        <span className={`px-2.5 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        
        {task.dueDate && (
          <div className="flex items-center text-gray-500 gap-1 bg-gray-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-full">
            <Calendar size={14} />
            <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
        )}

        {task.intervals && task.intervals.length > 0 && (
          <div className="flex items-center text-primary gap-1 bg-primary/10 px-2.5 py-1 rounded-full">
            <Clock size={14} />
            <span>{task.intervals.length} Intervals</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
