"use client";

import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Dashboard from "../dashboard/page.js";

const WeeklyTodoList = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const [tasks, setTasks] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  const [newTask, setNewTask] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Check user authentication and load tasks from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(parseInt(user.id));
      
      // Load tasks for this user
      const savedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } else {
      router.push("/");
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
    }
  }, [tasks, userId]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks(prev => ({
      ...prev,
      [selectedDay]: [
        ...prev[selectedDay],
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          userId: userId
        }
      ]
    }));
    setNewTask('');
  };

  const toggleTask = (day, taskId) => {
    setTasks(prev => ({
      ...prev,
      [day]: prev[day].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const deleteTask = (day, taskId) => {
    setTasks(prev => ({
      ...prev,
      [day]: prev[day].filter(task => task.id !== taskId)
    }));
  };

  const isCurrentDay = (day) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return day === today;
  };

  if (!userId) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row mr-14">
      {/* Left side - Dashboard */}
      <div className="w-full md:w-1/4 bg-gray-100 shadow-lg">
        <Dashboard />
      </div>
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Weekly To-Do List</h1>
        
        {/* Add Task Form */}
        <form onSubmit={addTask} className="mb-8 flex gap-4">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Add Task
          </button>
        </form>

        {/* Weekly Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daysOfWeek.map(day => (
            <div
              key={day}
              className={`bg-white rounded-lg shadow p-6 ${
                isCurrentDay(day) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
                {day}
                {isCurrentDay(day) && (
                  <span className="text-sm text-blue-500 font-normal">Today</span>
                )}
              </h2>
              
              <ul className="space-y-3">
                {tasks[day]?.length === 0 ? (
                  <li className="text-gray-400 text-sm">No tasks for {day}</li>
                ) : (
                  tasks[day]?.map(task => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between gap-2 group"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTask(day, task.id)}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          {task.completed ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                        <span className={`${
                          task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                        }`}>
                          {task.text}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => deleteTask(day, task.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTodoList;