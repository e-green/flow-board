import Image from "next/image";
import HomeImg from "../app/images/homeImg.png";
import SiteLogo from "../app/images/flowBoardLogo.png"


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
        {/* Site logo */}
          <h1 className="text-2xl font-bold">Flow Board</h1>

          <nav className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/components/About" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/components/featuresSection" className="hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>

            {/* Signup Button */}
            <a
              href={"/components/user/signup"}
              className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition-colors"
            >
              signup
            </a>
            {/* Login Button */}
            <a
              href={"/components/user/login"}
              className="bg-gray-400 text-white py-1 px-2 rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 ">
        <section className="flex justify-between items-center w-full">
          <div className="text-left w-1/2 pr-4">
            {" "}
            {/* Text Section */}
            <h2 className="text-3xl font-bold mb-4">Welcome to Flow Board</h2>
            <p className="mb-4">
              Manage your projects effectively with our intuitive project
              management tool.
            </p>
            <a
              href="/signup" // Adjust this to your login page
              className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Get Started
            </a>
          </div>
          <div className="w-1/2">
            {" "}
            {/* Image Section */}
            <Image
              src={HomeImg}
              alt="Project Management"
              width={500}
              height={300}
              className="mx-auto"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} Flow Board. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
