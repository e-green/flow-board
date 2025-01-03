"use client";
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Dashboard from "../dashboard/page.js";

const ProgressBar = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  return (
    <div className="mt-3 mb-2">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{completed} of {total} tasks completed</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-yellow-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

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

  // Authentication and localStorage effects remain the same
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(parseInt(user.id));
      
      const savedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } else {
      router.push("/");
    }
  }, []);

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

  const getCompletedTasks = (day) => {
    return tasks[day].filter(task => task.completed).length;
  };

  if (!userId) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Dashboard - Now responsive */}
      <div className="w-full lg:w-64 bg-gray-100 shadow-lg lg:min-h-screen">
        <Dashboard />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Weekly To-Do List</h1>
          
          {/* Add Task Form */}
          <form onSubmit={addTask} className="mb-6 flex flex-col sm:flex-row gap-3">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white text-gray-800 w-full sm:w-auto"
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
              className="flex-1 px-4 py-2 border rounded-lg text-gray-800"
            />
            
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <PlusCircle size={20} />
              <span>Add Task</span>
            </button>
          </form>

          {/* Weekly Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {daysOfWeek.map(day => (
              <div
                key={day}
                className={`bg-white rounded-lg shadow p-4 lg:p-6 ${
                  isCurrentDay(day) ? 'ring-2 ring-blue-900' : ''
                }`}
              >
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-3 flex items-center justify-between">
                  {day}
                  {isCurrentDay(day) && (
                    <span className="text-sm text-blue-900 font-normal">Today</span>
                  )}
                </h2>

                {/* Progress Bar */}
                <ProgressBar 
                  completed={getCompletedTasks(day)} 
                  total={tasks[day].length} 
                />
                
                <ul className="space-y-2">
                  {tasks[day]?.length === 0 ? (
                    <li className="text-gray-400 text-sm">No tasks for {day}</li>
                  ) : (
                    tasks[day]?.map(task => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between gap-2 group"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button
                            onClick={() => toggleTask(day, task.id)}
                            className="text-gray-400 hover:text-blue-500 flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle className="text-green-500" size={20} />
                            ) : (
                              <Circle size={20} />
                            )}
                          </button>
                          <span className={`${
                            task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                          } truncate`}>
                            {task.text}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => deleteTask(day, task.id)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 sm:visible invisible"
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
    </div>
  );
};

export default WeeklyTodoList;