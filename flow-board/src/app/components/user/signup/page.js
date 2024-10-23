'use client';
import { useState } from 'react';
import Image from 'next/image';
import SignupImage from '../../../images/emailImg.png'; // Replace with your actual image

// Importing Heroicons for show/hide password
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleEmailSubmit = async () => {
    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),  // Include email, name, and password
      });
  
      if (response.ok) {
        setMessage('Verification email sent. Please check your inbox.');
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setMessage('An error occurred. Please try again.');
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
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-950">Sign Up</h2>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black" // Text color fixed
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black" // Text color fixed
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle input type based on visibility state
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black" // Text color fixed
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

          <button
            onClick={handleEmailSubmit}
            className="w-full bg-blue-950 text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Sign Up
          </button>

          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>

        {/* Right side (image) */}
        <div className="w-1/2">
          <Image
            src={SignupImage}
            alt="Signup"
            layout="responsive"
            width={500}
            height={500}
            className="object-cover rounded-r-lg"
          />
        </div>

      </div>
    </div>
  );
}
