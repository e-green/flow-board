"use client";
import { useState } from "react";
import axios from "axios";

const TaskCreator = ({ onCreateTask }) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateTask = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/ai/taskSuggestions", { description });
      const { task, subtasks } = response.data;

      onCreateTask({ 
        title: task, 
        subTasks: subtasks.map((title) => ({ title })) 
      });
      setDescription(""); // Clear input after successful creation
    } catch (error) {
      console.error("Failed to generate tasks:", error);
      alert("Error generating tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the task..."
        className="w-full p-2 border rounded min-h-[100px]"
      />
      <button
        onClick={handleGenerateTask}
        disabled={loading || !description.trim()}
        className={`w-full p-2 rounded text-white ${
          loading || !description.trim()
            ? "bg-gray-400"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Generating..." : "Generate Task with AI"}
      </button>
    </div>
  );
};

export default TaskCreator;
