"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from "../dashboard/page.js";
import settingSection from "../../images/settingSection.png";
import developerSetting from "../../images/developerSetting.png";
import tokenType from "../../images/tokenType.png";
import generateToken from "../../images/generateToken.png";
import Image from 'next/image'; 


export default function GenerateTokenPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleSaveToken = async () => {
    if (!token) {
      alert('Please enter your GitHub token!');
      return;
    }
  
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await fetch('/api/user/save-github-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token }), // Ensure the correct payload.
      });
  
      if (response.ok) {
        alert('Token saved successfully!');
        router.push('/components/dashboard');
      } else {
        console.error('Error saving token:', await response.text());
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left side - Dashboard */}
      <div className="w-full md:w-1/4  shadow-xl p-0 md:p-0">
        <Dashboard />
      </div>

      <div className="flex-1 p-6 md:p-8 bg-gray-50">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Generate GitHub Token
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Follow the steps below to generate a GitHub token:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-4">
          {/* Row 1: Image 1 with Text 1 */}
          <div className="flex items-center gap-4">
            <Image
              src={settingSection}
              alt="Step 1"
              width={200}
              height={200}
              className="rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-700">
              Step 1: Your GitHub API's private key is a personal access token
              that you can generate from your GitHub account. First, log in to
              your GitHub account and go to the Settings section on your
              homepage.
            </p>
          </div>

          {/* Row 2: Image 2 with Text 2 */}
          <div className="flex items-center gap-4">
            <Image
              src={developerSetting}
              alt="Step 2"
              width={200}
              height={200}
              className="rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-700">
              Step 2: Then, go to Developer Settings from the Settings page.
            </p>
          </div>

          {/* Row 3: Image 3 with Text 3 */}
          <div className="flex items-center gap-4">
            <Image
              src={tokenType}
              alt="Step 3"
              width={200}
              height={200}
              className="rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-700">
              Step 3: Next, select the Personal Access Tokens section from the
              left panel of Developer Settings.
            </p>
          </div>

          {/* Row 4: Image 4 with Text 4 */}
          <div className="flex items-center gap-4">
            <Image
              src={generateToken}
              alt="Step 4"
              width={200}
              height={400}
              className="rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-700">
              Step 4: Then click on Generate New Token.After that, you can
              select all the privileges you want to enable for this access
              token. For brevity, you can select all of them. Set an expiry on
              the token and click on Generate.{" "}
            </p>
          </div>
        </div>

        <a
          href="https://stateful.com/blog/github-api-nodejs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-800 underline hover:text-blue-700"
        >
          Refer More details about generate github token
        </a>

        <div className="mt-2 mb-4">
          <label
            htmlFor="token"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Enter your GitHub Token:
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder:text-sm"
            placeholder="Your GitHub token here"
          />
        </div>

        <button
          className="w-full py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSaveToken}
        >
          Save Token
        </button>
      </div>
    </div>
  );
}
