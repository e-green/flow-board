'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Correct imports for App Router
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter();
  const searchParams = useSearchParams(); // Access search params
  const token = searchParams.get('token'); // Get token from the query parameters

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        toast.success('Password reset successful!', { position: 'top-right', autoClose: 3000 });
        router.push('/components/user/login'); // Redirect after success
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.message}`, { position: 'top-right', autoClose: 3000 });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred. Please try again.', { position: 'top-right', autoClose: 3000 });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-gray-100 p-8 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-950">Reset Password</h2>
        <div className="mb-4 relative"> {/* Add relative class to the container */}
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">New Password</label>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle input type based on visibility state
            id="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-4 flex items-center text-sm text-blue-500 focus:outline-none"
          >
            {/* Toggle between Eye and EyeSlash icons */}
            {showPassword ? (
              <EyeSlashIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <EyeIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <button
          onClick={handleResetPassword}
          className="w-full bg-blue-950 text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          Reset Password
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
