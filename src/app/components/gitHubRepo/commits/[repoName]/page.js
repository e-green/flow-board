"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "../../../dashboard/page.js";

export default function CommitsPage({ params }) {
  const { repoName } = params; // Get the repoName from the params
  const [commits, setCommits] = useState([]);
  const [owner, setOwner] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch the repository owner when the page loads
    fetchRepoOwner();
  }, []);

  useEffect(() => {
    // Fetch commits only when the owner and repoName are available
    if (owner && repoName) {
      fetchCommits(owner, repoName);
    }
  }, [owner, repoName]);

  const fetchRepoOwner = async () => {
    const token = localStorage.getItem("githubToken");

    if (!token) {
      console.error("GitHub token is not set!");
      return;
    }

    try {
      // Fetch repository details using the authenticated user's token
      const url = `https://api.github.com/user/repos`;
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (response.ok) {
        const repos = await response.json();
        const repo = repos.find((r) => r.name === repoName);

        if (repo) {
          setOwner(repo.owner.login); // Set the owner of the repository
        } else {
          console.error("Repository not found in user's repositories.");
        }
      } else {
        console.error(
          "Error fetching user repositories:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error fetching repository details:", error);
    }
  };

  const fetchCommits = async (owner, repoName) => {
    const token = localStorage.getItem("githubToken");

    if (!token) {
      console.error("GitHub token is not set!");
      return;
    }

    try {
      const url = `https://api.github.com/repos/${owner}/${repoName}/commits`;
      console.log("Fetching commits from:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (response.ok) {
        const commitsData = await response.json();
        setCommits(commitsData);
      } else {
        console.error("Error fetching commits:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching commits:", error);
    }
  };

  return (
    <div className="commits-page min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left side - Dashboard */}
      <div className="w-full md:w-1/4 shadow-xl p-0">
        <Dashboard />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg md:ml-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Commits for <span className="text-blue-600">{repoName}</span>
        </h2>
        {commits.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No commits found or still loading...
          </p>
        ) : (
          <div className="commits-container max-h-[40rem] overflow-y-auto border rounded-lg shadow-inner">
            <ul className="divide-y divide-gray-200">
              {commits.map((commit) => (
                <li key={commit.sha} className="py-4 px-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700 font-medium">
                      {commit.committer?.login || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(commit.commit.author.date).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-gray-900 mt-2">{commit.commit.message}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
