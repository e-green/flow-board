"use client";
import { useState } from "react";
import TaskCreator from "../TaskCreator/page";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);

  const handleCreateTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Task Management</h1>
      <TaskCreator onCreateTask={handleCreateTask} />
      
      <div className="mt-8 space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">{task.title}</h2>
            <ul className="space-y-2">
              {task.subTasks.map((subTask, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>{subTask.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;