'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Correct import for useRouter in App Router
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginImage from '../../../images/loginImg.jpg'; 
// Importing Heroicons for show/hide password
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Login successful!', { position: 'top-right', autoClose: 2000 });

        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to the dashboard after a short delay
        setTimeout(() => {
          router.push(`/components/dashboard?userName=${encodeURIComponent(data.user.name)}`); // Use the user's name
        }, 2000);
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
      <div className="flex bg-gray-100 shadow-lg rounded-lg max-w-4xl w-full">
        
        {/* Left side (form) */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-950">Login</h2>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-4 flex items-center text-sm text-blue-500 focus:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-6 w-6 text-gray-600" />
              ) : (
                <EyeIcon className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-950 text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Login
          </button>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/components/user/forgotPassword')}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Right side (image) */}
        <div className="w-1/2">
          <Image
            src={LoginImage}  // Replace with the path to your login image
            alt="Login"
            layout="responsive"
            width={500}
            height={500}
            className="object-cover rounded-r-lg"
          />
        </div>
      </div>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
    </div>
  );
}
