'use client';
import { useState, useEffect } from 'react';
import Dashboard from '../../dashboard/page.js';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(null);

  // Retrieve userId from the 'user' object stored in local storage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id); // Assuming 'id' is the field name for the userId
    }
  }, []);

  const handleCreateTask = async () => {
    if (!userId) {
      alert('User not logged in');
      return;
    }

    const response = await fetch('/api/task/create-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, userId }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Task created successfully');
      setTitle(''); // Clear the title input
      setDescription(''); // Clear the description input
    } else {
      alert(`Error creating task: ${data.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left side - Dashboard */}
      <div className="w-1/4 bg-gray-100 shadow-lg">
        <Dashboard />
      </div>

      {/* Right side - TaskForm */}
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create a New Task</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">Task Title</label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">Task Description</label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleCreateTask}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
