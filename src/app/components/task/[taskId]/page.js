// src/app/components/task/[taskId]/page.js

"use client"; // This marks the component as a Client Component
import axios from 'axios'; // Import axios
import { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'; // Updated import
import Dashboard from "../../dashboard/page.js"; // Import the Dashboard component

export default function TaskDetails({ params }) {
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [formData, setFormData] = useState({ title: '', description: '', logo: '', coverImage: '' });
  const { taskId } = params;

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails(taskId);
    }
  }, [taskId]);

  const fetchTaskDetails = async (taskId) => {
    try {
      const response = await axios.get(`/api/task/get-task?taskId=${taskId}`);
      const data = response.data;
      setTask(data);
      setFormData({
        title: data.title,
        description: data.description,
        logo: data.logo || '',
        coverImage: data.coverImage || ''
      });
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const handleEditTask = () => {
    setIsEditing(true); // Enable edit mode
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateTask = async () => {
    try {
      const response = await axios.post(`/api/task/update-task`, {
        id: taskId,
        ...formData
      });
      const updatedTask = response.data;
      setTask(updatedTask); // Update task with new data
      setIsEditing(false); // Disable edit mode
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (!task) {
    return <p>Loading task details...</p>;
  }

  return (
    <div className="flex">
      {/* Dashboard Sidebar */}
      <div className="w-1/4">
        <Dashboard />
      </div>

      {/* Task Details Section */}
      <div className="w-3/4 max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
        {isEditing ? (
          <div className="space-y-4">
            {/* Task Editing Form */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Logo URL</label>
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleFormChange}
                className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
              <input
                type="text"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleFormChange}
                className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
              />
            </div>

            <button
              onClick={handleUpdateTask}
              className="mt-4 bg-blue-500 text-white p-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div>
            {/* Cover Image */}
            {task.coverImage && (
              <div className="mb-6">
                <img
                  src={task.coverImage}
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Task Title and Logo */}
            <div className="flex items-center mb-4">
              {task.logo && (
                <img
                  src={task.logo}
                  alt="Logo"
                  className="w-16 h-16 rounded-full mr-4 border border-gray-300"
                />
              )}
              <h1 className="text-3xl font-semibold text-gray-800">{task.title}</h1>
              <button onClick={handleEditTask} className="ml-4 text-blue-800">
                <PencilIcon className="h-6 w-6" />
              </button>
              <button className="ml-4 text-red-800">
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Task Description */}
            <p className="text-gray-600 text-lg mb-6">{task.description}</p>

            {/* Display Subtasks if available */}
            {task.subTasks && task.subTasks.length > 0 && (
              <div>
                <h2 className="text-2xl font-medium text-gray-700 mb-4">Subtasks:</h2>
                <ul className="list-disc list-inside pl-4">
                  {task.subTasks.map((subTask) => (
                    <li key={subTask.id} className="text-gray-600 text-md mb-2">
                      {subTask.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
