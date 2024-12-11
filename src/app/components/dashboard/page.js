"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  HomeIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  Cog6ToothIcon,
  PowerIcon,
  CpuChipIcon,
  Bars3Icon,
  UserCircleIcon,
  ChevronDownIcon,
  StarIcon as OutlineStarIcon,
  StarIcon as SolidStarIcon,
} from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownUser, setShowDropdownUser] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [favoritedTasks, setFavoritedTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const [githubRepos, setGithubRepos] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name);
      setUserId(user.id);
      fetchTasks(user.id);
    }

    // Fetch GitHub repositorie
    fetchGitHubRepos();

    // Load favoritedTasks from localStorage
    const savedFavorites = localStorage.getItem("favoritedTasks");
    if (savedFavorites) {
      setFavoritedTasks(JSON.parse(savedFavorites));
    }
  }, []);

  const fetchGitHubRepos = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const tokenResponse = await fetch(
        `/api/user/get-github-token?userId=${userId}`
      );

      if (!tokenResponse.ok) {
        console.error("GitHub token not found for this user");
        return;
      }

      const { token } = await tokenResponse.json();

      const reposResponse = await fetch("https://api.github.com/user/repos", {
        headers: { Authorization: `token ${token}` },
      });

      if (reposResponse.ok) {
        const repos = await reposResponse.json();
        setGithubRepos(repos);
      } else {
        console.error(
          "Error fetching GitHub repositories:",
          await reposResponse.text()
        );
      }
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
    }
  };

  const fetchTasks = async (userId) => {
    try {
      const response = await fetch(`/api/task/get-tasks?userId=${userId}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTaskClick = (taskId) => {
    router.push(`/components/task/${taskId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleDropdownUser = () => {
    setShowDropdownUser(!showDropdownUser);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  const handleFavoriteToggle = (taskId) => {
    setFavoritedTasks((prev) => {
      let updatedFavorites;
      if (prev.includes(taskId)) {
        updatedFavorites = prev.filter((id) => id !== taskId);
      } else {
        updatedFavorites = [...prev, taskId];
      }

      // Save updated favorites to localStorage
      localStorage.setItem("favoritedTasks", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const isAFavorited = favoritedTasks.includes(a.id);
      const isBFavorited = favoritedTasks.includes(b.id);
      return isBFavorited - isAFavorited;
    });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 text-white p-5 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <h2 className="text-2xl font-semibold mb-4">Flow Board</h2>

        {/* Account Section */}
        <div className="relative mb-4">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={toggleDropdownUser}
          >
            <img
              src={`https://ui-avatars.com/api/user/?name=${
                userName || "User"
              }&background=random&color=fff`}
              alt="User Avatar"
              className="h-5 w-5 rounded-full"
            />
            <p className="text-sm text-gray-300">{userName || "User"}</p>
            <ChevronDownIcon className="h-5 w-5 text-gray-300" />
          </div>

          {showDropdownUser && (
            <div className="absolute right-0 mt-2 w-48 bg-blue-900 text-white rounded-lg shadow-lg py-2">
              <a
                href="/components/user/account"
                className="px-4 py-2 text-gray-50 hover:bg-blue-600 flex items-center"
              >
                <UserCircleIcon className="h-5 w-5 mr-2" />
                My Account
              </a>
              <button
                onClick={handleLogout}
                className="flex w-full text-left px-4 py-2 text-gray-50 hover:bg-blue-600 items-center"
              >
                <PowerIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Search Icon */}
        <div className="mb-4">
          <button
            onClick={toggleSearchInput}
            className="hover:bg-blue-900 text-sm px-4 py-1 rounded flex items-center"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>

        {/* Search Input */}
        {showSearchInput && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 rounded-md text-black"
            />
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-4">
          <a
            href="/components/dashboard"
            className="hover:bg-blue-900 text-sm px-4 py-1 rounded flex items-center"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Dashboard
          </a>
          <a
            href="#"
            className="hover:bg-blue-900 text-sm px-4 py-1 rounded flex items-center"
          >
            <CpuChipIcon className="h-5 w-5 mr-2" />
            Flow Board AI
          </a>
          <a
            href="#"
            className="hover:bg-blue-900 text-sm px-4 py-1 rounded flex items-center"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Calendar
          </a>
          <a
            href="#"
            className="hover:bg-blue-900 text-sm px-4 py-1 rounded flex items-center"
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Settings
          </a>
        </nav>

        {/* Private Section */}
        <div className="mt-6">
          <h3 className="text-xs font-bold mb-2">Private</h3>
          <div className="flex items-center justify-between mb-4">
            <a
              href="/components/task/createTask"
              className="hover:bg-blue-950 px-4 py-2 rounded"
            >
              Add Page
            </a>
          </div>
          <div>
            <ul>
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between px-4 py-2 cursor-pointer text-gray-400 hover:bg-gray-200"
                  onClick={() => handleTaskClick(task.id)}
                >
                  <div className="flex items-center">
                    {task.logo && (
                      <img
                        src={task.logo}
                        alt="Logo"
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    )}
                    <span>{task.title}</span>
                  </div>
                  <button
                    className="focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering task click
                      handleFavoriteToggle(task.id);
                    }}
                  >
                    {favoritedTasks.includes(task.id) ? (
                      <SolidStarIcon className="h-5 w-5 text-yellow-500" /> // Fully colored star
                    ) : (
                      <OutlineStarIcon className="h-5 w-5 text-gray-500" /> // Outline star
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold mb-2">GitHub Repositories</h3>

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => (window.location.href = "/components/gitHubRepo")}
          >
            Generate GitHub Token
          </button>
          <ul>
            {githubRepos.slice(0, 5).map((repo) => (
              <li
                key={repo.id}
                className="flex items-center justify-between px-4 py-2 text-gray-400 hover:bg-gray-200 rounded"
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate"
                >
                  {repo.name}
                </a>
                <button
                  className="ml-4 text-blue-500 hover:text-blue-700"
                  onClick={() =>
                    (window.location.href = `/components/gitHubRepo/commits/${repo.name}`)
                  }
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden flex items-center p-4">
        <button onClick={toggleSidebar} className="text-blue-950">
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
