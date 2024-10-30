"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export default function CreateSubTask() {
  const [formData, setFormData] = useState({ title: '', status: 'pending', images: [], documents: [] });
  const [taskId, setTaskId] = useState(null);
  const router = useRouter();
  

  // Extract taskId from the URL
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
    const fileType = e.target.name; // Determine if it's for images or documents
  
    // Use Cloudinary for image and document uploads
    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'FlowBoard'); // Replace with your Cloudinary upload preset
  
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; // Access the cloud name from environment variable
  
      return axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData)
        .then(response => response.data.secure_url); // Get the uploaded file's URL
    });
  
    Promise.all(uploadPromises).then(urls => {
      setFormData(prevState => ({
        ...prevState,
        [fileType]: [...prevState[fileType], ...urls], // Add URLs to the respective field
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Subtask</h2>
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
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleFormChange}
            className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Images</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
          <input
            type="file"
            name="documents"
            multiple
            onChange={handleFileChange}
            className="mt-1 p-2 border text-gray-700 border-gray-300 rounded-md w-full"
          />
        </div>
        <button
          onClick={handleCreateSubTask}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Create Subtask
        </button>
      </div>
    </div>
  );
}
