"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Updated import for Next.js 13+
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles for the toast
import Dashboard from "../../dashboard/page.js";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [assignees, setAssignees] = useState([]); // State for multiple assignees
  const [assigneeEmail, setAssigneeEmail] = useState(""); // State for individual email input
  const [userId, setUserId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, []);

  const handleAddAssignee = () => {
    if (assigneeEmail.trim() && !assignees.includes(assigneeEmail)) {
      setAssignees([...assignees, assigneeEmail.trim()]);
      setAssigneeEmail("");
    } else {
      toast.error("Invalid or duplicate email address");
    }
  };

  const handleRemoveAssignee = (email) => {
    setAssignees(assignees.filter((assignee) => assignee !== email));
  };

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
    formData.append("assignees", JSON.stringify(assignees)); // Send assignees as JSON

    const response = await fetch("/api/task/create-task", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      toast.success("Task created successfully");
      setTimeout(() => {
        router.push("/components/dashboard");
      }, 1000);
    } else {
      toast.error(`Error creating task: ${data.error}`);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/4 bg-gray-100 shadow-lg">
        <Dashboard />
      </div>

      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Create a New Task
          </h2>

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
          </div>

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
          </div>

          <div className="mb-4">
            <label htmlFor="assignees" className="block mb-2 text-sm font-medium text-gray-700">
              Assignees
            </label>
            <div className="flex items-center mb-2">
              <input
                id="assignees"
                type="email"
                value={assigneeEmail}
                onChange={(e) => setAssigneeEmail(e.target.value)}
                className="flex-1 p-2 border text-black border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter email address"
              />
              <button
                onClick={handleAddAssignee}
                className="ml-2 bg-blue-950 text-white px-4 py-1 rounded hover:bg-blue-700 transition duration-200"
              >
                Add
              </button>
            </div>
            <ul>
              {assignees.map((email, index) => (
                <li key={index} className="flex items-center justify-between text-gray-700">
                  <span>{email}</span>
                  <button
                    onClick={() => handleRemoveAssignee(email)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleCreateTask}
            className="w-full bg-blue-950 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Create Task
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
