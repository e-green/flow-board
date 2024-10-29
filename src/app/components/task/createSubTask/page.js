"use client";
import axios from 'axios';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateSubTask({ taskId, parentId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    images: [],
    documents: [],
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      [field]: files.map(file => URL.createObjectURL(file)), // Store file URLs or names
    });
  };

  const handleCreateSubtask = async () => {
    try {
      const response = await axios.post(`/api/task/create-subtask`, {
        ...formData,
        taskId: taskId,
        parentId: parentId,
      });
      toast.success('Subtask created successfully!', { position: 'top-right', autoClose: 2000 });
      // Optionally redirect or clear the form here
    } catch (error) {
      toast.error('Error creating subtask', { position: 'top-right', autoClose: 2000 });
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="text-2xl font-medium mb-4">Create Subtask</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleFormChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Images Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'images')}
            multiple
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Documents Upload</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileChange(e, 'documents')}
            multiple
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <button
          onClick={handleCreateSubtask}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Create Subtask
        </button>
      </div>
    </div>
  );
}
