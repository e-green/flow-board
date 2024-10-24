"use client";
import { useState, useEffect } from "react";
import Dashboard from "../../dashboard/page.js";

// TaskForm component

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, []);

  const handleCreateTask = async () => {
    if (!userId) {
      alert("User not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("coverImage", coverImage);
    formData.append("logo", logo);
    formData.append("userId", userId);

    const response = await fetch("/api/task/create-task", {
      method: "POST",
      body: formData, // Send FormData object with image files
    });

    const data = await response.json();
    if (response.ok) {
      alert("Task created successfully");
      setTitle("");
      setDescription("");
      setCoverImage(null);
      setLogo(null);
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
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Create a New Task
          </h2>

          {/* Task title input */}
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full p-2 border text-blue-950 border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter task title"
            />
          </div>

          {/* Task description input */}
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
              Task Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full p-2 border text-black border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              rows="4"
              placeholder="Enter task description"
            />
          </div>

          {/* Cover Image input */}
          <div className="mb-4">
            <label htmlFor="coverImage" className="block mb-2 text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="block w-full text-black border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
            {coverImage && (
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Cover Preview"
                className="w-full h-48 object-cover rounded-lg mt-2" // Full-width cover image preview
              />
            )}
          </div>

          {/* Logo input */}
          <div className="mb-4">
            <label htmlFor="logo" className="block mb-2 text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="block w-full text-black border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
            {logo && (
              <img
                src={URL.createObjectURL(logo)}
                alt="Logo Preview"
                className="w-24 h-24 object-cover rounded-lg border border-gray-300 mt-2" // Logo preview with border
              />
            )}
          </div>

          <button
            onClick={handleCreateTask}
            className="w-full bg-blue-950 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
