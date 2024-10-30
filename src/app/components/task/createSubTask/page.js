"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Dashboard from "../../dashboard/page.js";

export default function CreateSubTask() {
  const [formData, setFormData] = useState({ title: '', status: 'pending', images: [], documents: [] });
  const [taskId, setTaskId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskIdFromQuery = params.get('taskId');

    if (taskIdFromQuery) {
      const parsedTaskId = parseInt(taskIdFromQuery, 10);
      if (!isNaN(parsedTaskId)) {
        setTaskId(parsedTaskId);
      } else {
        console.error('Invalid taskId:', taskIdFromQuery);
      }
    }
  }, []);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileType = e.target.name;

    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'FlowBoard');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      return axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData)
        .then(response => response.data.secure_url);
    });

    Promise.all(uploadPromises).then(urls => {
      setFormData(prevState => ({
        ...prevState,
        [fileType]: [...prevState[fileType], ...urls],
      }));
    }).catch(error => {
      console.error('Error uploading files:', error);
      toast.error('Error uploading files', { position: 'top-right', autoClose: 2000 });
    });
  };

  const handleCreateSubTask = async () => {
    if (!taskId) {
      toast.error('Task ID is missing.', { position: 'top-right', autoClose: 2000 });
      return;
    }
    try {
      await axios.post(`/api/task/create-subtask`, { 
        title: formData.title, 
        status: formData.status,
        images: formData.images,
        documents: formData.documents,
        taskId 
      });
      toast.success('Subtask created successfully', { position: 'top-right', autoClose: 2000 });
      router.back();
    } catch (error) {
      toast.error('Error creating subtask', { position: 'top-right', autoClose: 2000 });
      console.error('Error creating subtask:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      <div className="bg-gray-100 lg:w-1/4 shadow-lg p-0">
        <Dashboard />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Create Subtask</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className=" p-2 border text-gray-800 border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-400"
              placeholder="Enter subtask title"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className=" p-2 border text-gray-800 border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-400"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Upload Images</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              className=" p-2 border text-gray-800 border-gray-300 rounded-md w-full focus:outline-none"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Upload Documents</label>
            <input
              type="file"
              name="documents"
              multiple
              onChange={handleFileChange}
              className=" p-2 border text-gray-800 border-gray-300 rounded-md w-full focus:outline-none"
            />
          </div>
          <button
            onClick={handleCreateSubTask}
            className="mt-6 bg-blue-950 hover:bg-blue-700 transition duration-200 text-white font-semibold p-2 rounded-md w-full focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Create Subtask
          </button>
        </div>
      </div>
    </div>
  );
}
