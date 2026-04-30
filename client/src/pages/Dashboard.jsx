import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus } from 'lucide-react';
import { isToday, isThisWeek, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  // Filter Tasks based on tab
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'dashboard' || activeTab === 'all') return true;
    if (!task.dueDate) return false;
    
    const date = parseISO(task.dueDate);
    if (activeTab === 'daily') return isToday(date);
    if (activeTab === 'weekly') return isThisWeek(date);
    if (activeTab === 'timeline') return task.intervals && task.intervals.length > 0;
    
    return true;
  });

  const handleAddTask = async (data) => {
    await addTask(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setSidebarOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto pb-24">
            
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight capitalize">
                  {activeTab.replace('-', ' ')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  You have {filteredTasks.filter(t => t.status !== 'Completed').length} pending tasks.
                </p>
              </div>
              <button 
                onClick={() => setModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all transform hover:-translate-y-0.5"
              >
                <Plus size={20} /> Add Task
              </button>
            </div>

            {/* Mobile Add Task FAB */}
            <button 
              onClick={() => setModalOpen(true)}
              className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/40 z-40"
            >
              <Plus size={24} />
            </button>

            {tasksLoading ? (
              <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                <img src="https://illustrations.popsy.co/amber/freelancer.svg" alt="Empty" className="w-48 h-48 mx-auto opacity-50 dark:invert" />
                <h3 className="text-xl font-bold mt-4">No tasks found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">Create your first task and stay organized. A clear mind leads to a productive day!</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filteredTasks.map(task => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      onUpdate={updateTask} 
                      onDelete={deleteTask} 
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6">Visual Timeline</h3>
                <div className="relative border-l-2 border-primary/30 ml-4 pl-6 space-y-8">
                  {filteredTasks.map(task => 
                    task.intervals.map((interval, idx) => (
                      <div key={`${task._id}-${idx}`} className="relative">
                        <div className="absolute -left-[35px] w-4 h-4 bg-primary rounded-full border-4 border-white dark:border-slate-950 shadow"></div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                          <p className="text-sm font-bold text-primary mb-1">
                            {interval.startTime || '??:??'} - {interval.endTime || '??:??'}
                          </p>
                          <p className="font-medium">{task.title}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
      
      <TaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddTask} />
    </div>
  );
}
