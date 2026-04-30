import React from 'react';
import { Calendar, CheckSquare, Clock, LayoutDashboard, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'daily', label: 'Daily To-Do', icon: CheckSquare },
  { id: 'weekly', label: 'Weekly Planner', icon: Calendar },
  { id: 'timeline', label: '5-Min Timeline', icon: Clock },
  { id: 'all', label: 'All Tasks', icon: ListTodo },
];

export default function Sidebar({ isOpen, closeSidebar, activeTab, setActiveTab }) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-slate-800 lg:hidden">
          <h2 className="text-lg font-bold"><span className="color-username">__asit.0.___</span></h2>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) closeSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                  isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-primary' : ''} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator" 
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" 
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
