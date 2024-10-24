'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter a valid email address', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      const response = await fetch('/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Password reset link sent to your email', { position: 'top-right', autoClose: 3000 });
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.message}`, { position: 'top-right', autoClose: 3000 });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred. Please try again.', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-gray-100 shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-950">Forgot Password</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Enter your email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
        </div>

        <button
          onClick={handleForgotPassword}
          className="w-full bg-blue-950 text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          Send Reset Link
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}
