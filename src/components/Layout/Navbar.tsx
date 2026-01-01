import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.webp";
import Button from "../shared/Button";
import DropdownMenu, { getDropdownItems } from "./DropdownMenu";

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
  { id: 4, title: "Blogs", link: "/blogs" },
  { id: 5, title: "Contact", link: "/contact" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGetDropdownOpen, setIsGetDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setIsGetDropdownOpen(false);
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

          <DropdownMenu
            title="Get"
            icon={getDropdownItems[0].icon}
            items={getDropdownItems.map((item, index) => ({
              ...item,
              index,
              isOpen: isGetDropdownOpen,
            }))}
            isOpen={isGetDropdownOpen}
            onToggle={() => setIsGetDropdownOpen(!isGetDropdownOpen)}
            onClose={() => setIsGetDropdownOpen(false)}
          />
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
          <div className="pt-6 border-t border-neutral-800 space-y-6">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-2xl p-5 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-yellow-400 font-bold text-base uppercase tracking-wider">Get Support</p>
              </div>
              {getDropdownItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="flex items-center gap-4 p-4 bg-neutral-800/80 hover:bg-yellow-500/20 rounded-xl transition-all duration-300 mb-3 last:mb-0 group"
                >
                  <div className="bg-yellow-100 p-3 rounded-xl group-hover:bg-yellow-200 transition-colors flex-shrink-0">
                    <item.icon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base mb-1 group-hover:text-yellow-400 transition-colors">{item.label}</p>
                    {item.description && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
            <a
              href={donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button fullWidth className="py-4 text-lg">
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
