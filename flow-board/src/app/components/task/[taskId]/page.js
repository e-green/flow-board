"use client"; // This marks the component as a Client Component

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
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>

      {/* Display Subtasks if available */}
      {task.subTasks && task.subTasks.length > 0 && (
        <div>
          <h2>Subtasks:</h2>
          <ul>
            {task.subTasks.map((subTask) => (
              <li key={subTask.id}>{subTask.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
