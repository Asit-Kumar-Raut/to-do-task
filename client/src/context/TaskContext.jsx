import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/axios';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
      const socket = io('http://localhost:5000');
      
      socket.on('taskUpdated', () => {
        fetchTasks();
      });

      return () => {
        socket.disconnect();
      };
    } else {
      setTasks([]);
    }
  }, [user]);

  const addTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
    } catch (error) {
      throw error;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await api.put(`/tasks/${id}`, taskData);
    } catch (error) {
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
