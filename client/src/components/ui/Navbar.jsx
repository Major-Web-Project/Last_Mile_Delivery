import { Link, useLocation } from "react-router-dom";
import { Truck, Map, User, Info } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const activeClass = "text-white font-bold hover:text-blue-600 transition-colors";
  const baseClass = "text-white hover:text-blue-600 font-bold transition-colors";

  return (
    <header className="bg-black/50 border-b border-black sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center gap-2">
          <Truck className="w-8 h-8 text-yellow-500 bg-black p-1 rounded-md" />
          <p className="text-2xl font-bold text-white ">LastMileDelivery</p>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 ">
          <Link
            to="/"
            className={location.pathname === "/" ? activeClass : baseClass}
          >
            Home
          </Link>
          <Link
            to="/agent"
            className={location.pathname === "/agent" ? activeClass : baseClass}
          >
            Agent View
          </Link>
          <Link
            to="/about"
            className={location.pathname === "/about" ? activeClass : baseClass}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
