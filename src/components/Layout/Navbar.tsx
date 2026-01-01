import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.webp";
import Button from "../shared/Button";

const donateUrl =
  "https://shop.directpay.online/paymybills/UBURUMULTIMOVEHOMELESSSHELTER?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

type NavLink = {
  id: number;
  title: string;
  link: string;
};

const NavbarLinks: NavLink[] = [
  { id: 1, title: "Home", link: "/" },
  { id: 2, title: "About", link: "/about" },
  { id: 3, title: "Causes", link: "/causes" },
  { id: 4, title: "Therapy Services", link: "/get/therapy" },
  { id: 5, title: "Blogs", link: "/blogs" },
  { id: 6, title: "Contact", link: "/contact" },
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
            alt="Uburumultimotive logo"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400 group-hover:ring-yellow-300 transition-all duration-300 shadow-lg shadow-yellow-500/20"
          />
          <span className="text-white text-xl font-bold tracking-tight">
            Uburu<span className="text-yellow-400">Multimotive</span>
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

        {/* Desktop Donate Button */}
        <div className="hidden lg:block">
          <a href={donateUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold px-8 border-none shadow-lg shadow-yellow-500/20 flex items-center gap-2">
              Donate
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Button>
          </a>
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
          isMobileMenuOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"
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
          <div className="pt-6 border-t border-neutral-800">
            <a
              href={donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button fullWidth className="py-4">
                Make a Donation
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
