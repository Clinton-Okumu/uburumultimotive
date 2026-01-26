import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.webp";

type NavLink = {
  id: number;
  title: string;
  link: string;
};

const NavbarLinks: NavLink[] = [
  { id: 1, title: "Home", link: "/" },
  { id: 2, title: "About", link: "/about" },
  { id: 3, title: "Causes", link: "/causes" },
  { id: 4, title: "Gallery", link: "/gallery" },
  { id: 5, title: "Contact", link: "/contact" },
  { id: 6, title: "Volunteer", link: "/volunteer" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-neutral-900/95 backdrop-blur-md py-3 shadow-2xl border-b border-yellow-500/20"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Uburumultimove logo"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400 group-hover:ring-yellow-300 transition-all duration-300 shadow-lg shadow-yellow-500/20"
            />
            <span className="text-white text-xl font-bold tracking-tight">
              Uburu<span className="text-yellow-400">Multimove</span>
            </span>
          </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {NavbarLinks.map((link) => (
            <Link
              key={link.id}
              to={link.link}
              className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-1 ${
                location.pathname === link.link
                  ? "text-yellow-400"
                  : "text-gray-200 hover:text-yellow-400"
              }`}
            >
              {link.title}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                  location.pathname === link.link ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}
        </div>



        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-white hover:bg-neutral-800 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-7 h-7 text-yellow-400" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-neutral-900 border-t border-neutral-800 transition-all duration-300 ease-in-out overflow-hidden shadow-2xl ${
          isMobileMenuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-8 space-y-6">
          {NavbarLinks.map((link) => (
            <Link
              key={link.id}
              to={link.link}
              className={`block text-xl font-bold tracking-wide transition-colors ${
                location.pathname === link.link
                  ? "text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
