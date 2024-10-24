'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from '../../dashboard/page.js';
import 'react-toastify/dist/ReactToastify.css';

export default function Account() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      setUpdatedName(user.name); // Initialize with current name
      setUpdatedEmail(user.email); // Initialize with current email
    } else {
      router.push('/components/user/login'); // Redirect to login if no user data
    }
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      if (response.ok) {
        toast.success('Account deleted successfully');
        localStorage.removeItem('user');
        router.push('/');
      } else {
        toast.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('An error occurred while deleting your account');
    } finally {
      setIsConfirmDeleteOpen(false); // Close the confirmation modal
    }
  };

  const handleUpdateAccount = async () => {
    try {
      const response = await fetch('/api/user/update-account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: updatedName, newEmail: updatedEmail }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        toast.success('Account updated successfully');
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
        setUser(updatedUser);
        setIsEditing(false); // Close the editing form
      } else {
        toast.error('Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('An error occurred while updating your account');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex bg-gray-100">
      <div className="w-1/4">
        <Dashboard />
      </div>
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">My Account</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex justify-between items-center p-6">
          {!isEditing ? (
            <>
              {/* Text Section */}
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-lg font-medium text-gray-700">Name</p>
                  <p className="text-gray-500">{user.name}</p>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">Email</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                  >
                    Update Account
                  </button>
                  <button
                    onClick={() => setIsConfirmDeleteOpen(true)} // Open confirmation modal
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500"
                  >
                    Delete Account
                  </button>
                </div>
              </div>

              {/* Profile Image */}
              <div className="w-32 h-32">
                <img
                  src={`https://ui-avatars.com/api/user/?name=${user.name || 'User'}&background=random&color=fff&size=128`}
                  alt="User Avatar"
                  className="rounded-full object-cover"
                />
              </div>
            </>
          ) : (
            <div className="w-full flex justify-between">
              {/* Edit Form */}
              <div className="flex flex-col w-2/3 space-y-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    className="mt-1 block w-full border rounded py-2 px-3 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={updatedEmail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    className="mt-1 block w-full border rounded py-2 px-3 text-gray-500"
                  />
                </div>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleUpdateAccount}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Profile Image */}
              <div className="w-32 h-32">
                <img
                  src={`https://ui-avatars.com/api/user/?name=${user.name || 'User'}&background=random&color=fff&size=128`}
                  alt="User Avatar"
                  className="rounded-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal for Deletion */}
        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white text-gray-700 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete your account?</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setIsConfirmDeleteOpen(false)} // Close modal
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
