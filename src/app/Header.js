import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Flow Board</h1>

        {/* Navigation and Buttons */}
        <nav className="flex items-center space-x-6">
          {/* Navigation Links */}
          <ul className="hidden md:flex items-center space-x-6">
            <li>
              <Link 
                href="/" 
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/components/About" 
                className="hover:text-blue-400 transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/features" 
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Features
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/components/user/signup"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
            >
              Sign Up
            </Link>
            <Link
              href="/components/user/login"
              className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;