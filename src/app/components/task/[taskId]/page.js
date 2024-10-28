"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import Dashboard from "../../dashboard/page.js";

export default function TaskDetails({ params }) {
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', logo: '', coverImage: '' });
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
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
    setIsEditing(true);
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
      setTask(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const addSubtask = async (title = '') => {
    if (!title.trim()) return;
    try {
      const response = await axios.post(`/api/task/create-subtask`, {
        title,
        taskId: taskId,
      });
      fetchTaskDetails(taskId);
      setNewSubtaskTitle('');
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  if (!task) {
    return <p>Loading task details...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-950 text-white p-5">
        <Dashboard />
      </div>

      {/* Task Details Section */}
      <div className="flex-grow max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 md:mt-0">
        {isEditing ? (
          <div className="space-y-4">
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
            {task.coverImage && (
              <div className="mb-6">
                <img
                  src={task.coverImage}
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

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

            <p className="text-gray-600 text-lg mb-6">{task.description}</p>

            <h2 className="text-2xl font-medium text-gray-700 mb-4">Subtasks:</h2>

            <div className="mt-6">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add new subtask"
                className="p-2 border border-gray-300 text-black rounded-md mr-2"
              />
              <button onClick={() => addSubtask(newSubtaskTitle)} className="bg-green-500 text-white p-2 rounded-md">
                Add Subtask
              </button>
            </div>

            <ul className="list-disc pl-0 text-xl text-gray-700">
              {task.subTasks?.map((subtask) => (
                <li key={subtask.id} className="mt-2">
                  {subtask.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
