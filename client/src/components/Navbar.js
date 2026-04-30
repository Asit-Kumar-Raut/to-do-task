"use client";
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { LogOut, Menu, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold hidden sm:block">
          <span className="color-username">__asit.0.___</span> Task Manager
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium leading-none mb-1">{user.name}</p>
              <p className="text-xs text-gray-500 leading-none">{user.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-2"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
