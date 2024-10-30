"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // Correct usage for app directory

export default function CreateSubTask() {
  const [formData, setFormData] = useState({ title: '' });
  const [taskId, setTaskId] = useState(null);
  const router = useRouter();

  // Extract taskId from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskIdFromQuery = params.get('taskId'); // Get taskId from the query

    if (taskIdFromQuery) {
      const parsedTaskId = parseInt(taskIdFromQuery, 10);
      if (!isNaN(parsedTaskId)) {
        setTaskId(parsedTaskId); // Set taskId if it's a valid number
      } else {
        console.error('Invalid taskId:', taskIdFromQuery);
      }
    }
  }, []); // No dependencies; run once on mount

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSubTask = async () => {
    if (!taskId) {
      toast.error('Task ID is missing.', { position: 'top-right', autoClose: 2000 });
      return;
    }
    try {
      await axios.post(`/api/task/create-subtask`, { title: formData.title, taskId });
      toast.success('Subtask created successfully', { position: 'top-right', autoClose: 2000 });
      router.back();
    } catch (error) {
      toast.error('Error creating subtask', { position: 'top-right', autoClose: 2000 });
      console.error('Error creating subtask:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Subtask</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
          />
        </div>
        <button
          onClick={handleCreateSubTask}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Create Subtask
        </button>
      </div>
    </div>
  );
}
