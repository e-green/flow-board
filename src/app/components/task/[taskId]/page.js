"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid"; // Only import once
import Dashboard from "../../dashboard/page.js";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function TaskDetails({ params }) {
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    logo: "",
    coverImage: "",
    assignees: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  // New state variables for image previews
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const [editingSubTaskId, setEditingSubTaskId] = useState(null);
  const [editingSubTask, setEditingSubTask] = useState({
    title: "",
    status: "",
    images: [],
    documents: [],
    assignees: "",
  });
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
        assignees: data.assignees.map((assignee) => assignee.email).join(", "), // Convert to comma-separated string
      });

      // Set previews based on existing images
      setLogoPreview(data.logo);
      setCoverImagePreview(data.coverImage);
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
    const file = e.target.files[0];
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file)); // Set the logo preview
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImageFile(file);
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file)); // Set the cover image preview
    }
  };

  const handleUpdateTask = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("id", taskId);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("assignees", JSON.stringify(formData.assignees.split(",").map(email => email.trim())));

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
    } catch (error) {
      toast.error("Error updating task");
    }
  };

  const addSubtask = () => {
    router.push(`/components/task/createSubTask?taskId=${taskId}`);
  };

  const handleEditSubTask = (subTask) => {
    setEditingSubTaskId(subTask.id);
    setEditingSubTask({
      title: subTask.title,
      status: subTask.status || "",
      images: subTask.images || [], // Ensure this fetches the current images
      documents: subTask.documents || [], // Ensure this fetches the current documents
    });
  };

  const handleSubTaskFormChange = (e) => {
    const { name, value } = e.target;
    setEditingSubTask({
      ...editingSubTask,
      [name]: value,
    });
  };

  const handleSubTaskFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setEditingSubTask({
      ...editingSubTask,
      [type]: files,
    });
  };

  const handleUpdateSubTask = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("id", editingSubTaskId);
    formDataToSend.append("title", editingSubTask.title);
    formDataToSend.append("status", editingSubTask.status);
    editingSubTask.images.forEach((file, index) => {
      formDataToSend.append(`images[${index}]`, file);
    });
    editingSubTask.documents.forEach((file, index) => {
      formDataToSend.append(`documents[${index}]`, file);
    });

    try {
      await axios.post(`/api/task/update-subtask`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchTaskDetails(taskId);
      setEditingSubTaskId(null);
      setEditingSubTask({ title: "", status: "", images: [], documents: [] });
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

  const handleDeleteTask = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/task/delete-task?taskId=${taskId}`); // Pass taskId as a query parameter
          router.push("/components/dashboard");
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting task:", error); // Log error for debugging
          Swal.fire("Error!", "There was an error deleting the task.", "error");
        }
      }
    });
  };

  const handleDeleteSubTask = async (subTaskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/task/delete-subtask`, {
            data: { id: subTaskId },
          });
          fetchTaskDetails(taskId);
          Swal.fire("Deleted!", "Your subtask has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an error deleting the subtask.",
            "error"
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
      <div className="bg-gray-100 lg:w-1/4 shadow-lg p-0">
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
                Assignees (Comma-separated emails)
              </label>
              <input
                type="text"
                name="assignees"
                value={formData.assignees}
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
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-300"
                />
              )}
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
              {coverImagePreview && (
                <img
                  src={coverImagePreview}
                  alt="Cover Image Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-300"
                />
              )}
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
              <div className="mt-0 ml-8">
                {/* <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Assignees
                </h3> */}
                {task.assignees && task.assignees.length > 0 ? (
                  <ul className="space-y-0">
                    {task.assignees.map((assignee) => (
                      <li
                        key={assignee.id}
                        className="flex justify-between items-center p-1 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-3 h-3 text-blue-900"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM8 10.707a1 1 0 0 0 1.415 0L10 9.414l.585.707a1 1 0 1 0 1.415-1.414L10 7.586l-.585.707a1 1 0 1 0-1.415-1.414L8 8.293l-.585-.707a1 1 0 1 0-1.415 1.414l.585.707 1.415-.707z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700 font-normal">
                            {assignee.email}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No assignees assigned yet.</p>
                )}
              </div>

              <button onClick={handleEditTask} className="ml-4 text-blue-800">
                <PencilIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="ml-2 text-red-800"
              >
                <TrashIcon className="h-4 w-4" />
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

              {editingSubTaskId && (
                <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
                  <h3 className="text-xl font-medium mb-2 text-gray-700">
                    Edit Subtask
                  </h3>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editingSubTask.title}
                      onChange={handleSubTaskFormChange}
                      className="w-full p-2 border text-black border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <input
                      type="text"
                      name="status"
                      value={editingSubTask.status}
                      onChange={handleSubTaskFormChange}
                      className="w-full p-2 border border-gray-300 text-black rounded-md"
                    />
                  </div>

                  <div className="mb-2">
                    {/* <label className="block text-sm font-medium">
                      Existing Images
                    </label> */}
                    <div className="flex space-x-2">
                      {editingSubTask.images &&
                      editingSubTask.images.length > 0 ? (
                        editingSubTask.images.map((image, index) => (
                          <img
                            key={index}
                            src={image} // Ensure this points to the correct URL
                            alt={`Subtask image ${index + 1}`}
                            className="w-20 h-20 object-cover border border-gray-300 rounded-md"
                          />
                        ))
                      ) : (
                        <p>No images uploaded.</p>
                      )}
                    </div>
                    <label className="block text-sm font-medium text-gray-600">
                      Upload New Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleSubTaskFileChange(e, "images")}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-2">
                    {/* <label className="block text-sm font-medium">
                      Existing Documents
                    </label> */}
                    <div className="flex space-x-2">
                      {editingSubTask.documents &&
                      editingSubTask.documents.length > 0 ? (
                        editingSubTask.documents.map((doc, index) => (
                          <a
                            key={index}
                            href={doc} // Ensure this points to the correct URL
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Document {index + 1}
                          </a>
                        ))
                      ) : (
                        <p>No documents uploaded.</p>
                      )}
                    </div>
                    <label className="block text-sm font-medium text-gray-600">
                      Upload New Documents
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx" // Adjust file types as needed
                      onChange={(e) => handleSubTaskFileChange(e, "documents")}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-600"
                    />
                  </div>
                  <button
                    onClick={handleUpdateSubTask}
                    className="mt-4 bg-blue-500 text-white p-2 rounded-md"
                  >
                    Update Subtask
                  </button>
                  <button
                    onClick={() => {
                      setEditingSubTaskId(null);
                      setEditingSubTask({
                        title: "",
                        status: "",
                        images: [],
                        documents: [],
                      });
                    }}
                    className="mt-2 ml-2 bg-gray-400 text-white p-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
