"use client";
import { useState } from 'react';

import { useRouter } from 'next/navigation';


export default function GenerateTokenPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleSaveToken = () => {
    if (!token) {
      alert('Please enter your GitHub token!');
      return;
    }
    localStorage.setItem('githubToken', token); // Save the token locally
    router.push('/components/dashboard'); // Redirect back to the main page
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generate GitHub Token</h1>
      <p className="mb-4">Follow the steps below to generate a GitHub token:</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <img src="/step1.png" alt="Step 1" className="w-full rounded" />
        <img src="/step2.png" alt="Step 2" className="w-full rounded" />
        <img src="/step3.png" alt="Step 3" className="w-full rounded" />
        <img src="/step4.png" alt="Step 4" className="w-full rounded" />
      </div>
      <div className="mb-6">
        <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your GitHub Token:
        </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSaveToken}
      >
        Save Token
      </button>
    </div>
  );
}
