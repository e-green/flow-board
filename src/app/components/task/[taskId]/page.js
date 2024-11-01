"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid"; // Only import once
import Dashboard from "../../dashboard/page.js";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';


export default function TaskDetails({ params }) {
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    logo: "",
    coverImage: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [editingSubTaskId, setEditingSubTaskId] = useState(null);
  const [editingSubTaskTitle, setEditingSubTaskTitle] = useState("");
  const { taskId } = params;
  const router = useRouter();

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
        logo: data.logo || "",
        coverImage: data.coverImage || "",
      });
    } catch (error) {
      toast.error("Error fetching task details", {
        position: "top-right",
        autoClose: 2000,
      });
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

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleCoverImageChange = (e) => {
    setCoverImageFile(e.target.files[0]);
  };

  const handleUpdateTask = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("id", taskId);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    if (logoFile) formDataToSend.append("logo", logoFile);
    if (coverImageFile) formDataToSend.append("coverImage", coverImageFile);

    try {
      await axios.post(`/api/task/update-task`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchTaskDetails(taskId);
      setIsEditing(false);
      setLogoFile(null);
      setCoverImageFile(null);
      toast.success("Task updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Error updating task", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const addSubtask = () => {
    router.push(`/components/task/createSubTask?taskId=${taskId}`);
  };

  const handleEditSubTask = (subTask) => {
    setEditingSubTaskId(subTask.id);
    setEditingSubTaskTitle(subTask.title);
  };

  const handleUpdateSubTask = async (subTaskId) => {
    try {
      await axios.put(`/api/task/update-subtask`, {
        id: subTaskId,
        title: editingSubTaskTitle,
      });
      fetchTaskDetails(taskId);
      setEditingSubTaskId(null);
      setEditingSubTaskTitle("");
      toast.success("Subtask updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Error updating subtask", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDeleteSubTask = async (subTaskId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/task/delete-subtask`, {
            data: { id: subTaskId },
          });
          fetchTaskDetails(taskId);
          Swal.fire(
            'Deleted!',
            'Your subtask has been deleted.',
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Error!',
            'There was an error deleting the subtask.',
            'error'
          );
        }
      }
    });
  };

  if (!task) {
    return <p>Loading task details...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-64 bg-blue-950 text-white p-5">
        <Dashboard />
      </div>

      <div className="flex-grow max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 md:mt-0">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo Upload
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cover Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
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
              <h1 className="text-3xl font-semibold text-gray-800">
                {task.title}
              </h1>
              <button onClick={handleEditTask} className="ml-4 text-blue-800">
                <PencilIcon className="h-6 w-6" />
              </button>
              <button className="ml-4 text-red-800">
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>

            <p className="text-gray-600 text-lg mb-6">{task.description}</p>
            {/* Subtasks Section */}
            <button
                onClick={addSubtask}
                className="mt-4 bg-green-500 text-white p-2 rounded-md"
              >
                <PlusIcon className="h-4 w-4 inline-block" /> Add Subtask
              </button>
            <div className="mt-6">
            
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Subtasks
              </h2>
              {task.subTasks && task.subTasks.length > 0 ? (
                <ul className="list-disc list-inside">
                  {task.subTasks.map((subTask) => (
                    <li
                      key={subTask.id}
                      className="flex justify-between items-center text-gray-700 mb-2"
                    >
                      <span className="flex-1">{subTask.title}</span>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleEditSubTask(subTask)}
                          className="text-blue-800"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubTask(subTask.id)}
                          className="ml-2 text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-black">No subtasks available.</p>
              )}
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
