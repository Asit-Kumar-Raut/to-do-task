"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Clock } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [intervals, setIntervals] = useState([]);

  const addInterval = () => {
    setIntervals([...intervals, { startTime: '', endTime: '', completed: false }]);
  };

  const updateInterval = (index, field, value) => {
    const newIntervals = [...intervals];
    newIntervals[index][field] = value;
    setIntervals(newIntervals);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, priority, dueDate, intervals });
    // Reset
    setTitle(''); setDescription(''); setPriority('Medium'); setDueDate(''); setIntervals([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input 
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="What needs to be done?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <textarea 
                    value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    placeholder="Add details..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select 
                      value={priority} onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input 
                      type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                {/* 5-Min Scheduler Intervals */}
                <div>
                  <div className="flex justify-between items-center mb-2 mt-4">
                    <label className="block text-sm font-medium">5-Minute Scheduler Intervals</label>
                    <button type="button" onClick={addInterval} className="text-primary text-sm flex items-center gap-1 hover:underline">
                      <Plus size={16} /> Add Interval
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {intervals.map((interval, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-gray-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        <Clock size={16} className="text-gray-400" />
                        <input 
                          type="time" value={interval.startTime} onChange={(e) => updateInterval(idx, 'startTime', e.target.value)}
                          className="flex-1 bg-transparent border-b border-gray-300 dark:border-slate-600 outline-none px-1 py-0.5 text-sm"
                        />
                        <span className="text-gray-400 text-sm">to</span>
                        <input 
                          type="time" value={interval.endTime} onChange={(e) => updateInterval(idx, 'endTime', e.target.value)}
                          className="flex-1 bg-transparent border-b border-gray-300 dark:border-slate-600 outline-none px-1 py-0.5 text-sm"
                        />
                        <button type="button" onClick={() => {
                          const newIntervals = [...intervals];
                          newIntervals.splice(idx, 1);
                          setIntervals(newIntervals);
                        }} className="text-red-400 hover:text-red-600 p-1">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button form="task-form" type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/30 transition-colors">
                Save Task
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
