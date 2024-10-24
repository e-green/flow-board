"use client"; // This marks the component as a Client Component
import Dashboard from "../../dashboard/page.js"; // Import the Dashboard component

import { useEffect, useState } from 'react';

export default function TaskDetails({ params }) {
  const [task, setTask] = useState(null);
  const { taskId } = params;

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails(taskId);
    }
  }, [taskId]);

  const fetchTaskDetails = async (taskId) => {
    try {
      const response = await fetch(`/api/task/get-task?taskId=${taskId}`);
      const data = await response.json();
      setTask(data);
    } catch (error) {
      console.error('Error fetching task details:', error);
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
    </div>
  );
}
