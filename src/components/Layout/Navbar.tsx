import { Menu, X, HandHeart, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.webp";
import Button from "../shared/Button";
import { getDropdownItems } from "./DropdownMenu";

type NavLink = {
  id: number;
  title: string;
  link: string;
};

const NavbarLinks: NavLink[] = [
  { id: 1, title: "Home", link: "/" },
  { id: 2, title: "About", link: "/about" },
  { id: 3, title: "Founder", link: "/founder" },
  { id: 4, title: "Causes", link: "/causes" },
  { id: 5, title: "Gallery", link: "/gallery" },
  { id: 6, title: "Contact", link: "/contact" },
  { id: 7, title: "Volunteer", link: "/volunteer" },
  { id: 8, title: "Partner", link: "/partner" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [trayCount, setTrayCount] = useState(0);
  const [isGetOpen, setIsGetOpen] = useState(false);
  const location = useLocation();
  const getDropdownRef = useRef<HTMLDivElement>(null);

  const getStoredCartCount = (storageKey: string) => {
    if (typeof window === "undefined") {
      return 0;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return 0;
      }
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (!parsed || typeof parsed !== "object") {
        return 0;
      }
      return Object.values(parsed).reduce<number>((total, value) => {
        if (typeof value !== "number" || !Number.isFinite(value)) {
          return total;
        }
        return total + Math.max(0, Math.trunc(value));
      }, 0);
    } catch {
      return 0;
    }
  };

  const getTrayMeta = (pathname: string) => {
    if (pathname === "/get/home") {
      return {
        count: getStoredCartCount("uburu_home_cart"),
        label: "Home tray",
        link: "/checkout?source=home",
      };
    }

    if (pathname === "/get/village") {
      return {
        count: getStoredCartCount("uburu_village_cart"),
        label: "Village tray",
        link: "/checkout?source=village",
      };
    }

    return null;
  };

  const trayMeta = getTrayMeta(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const refreshTrayCount = () => {
      const meta = getTrayMeta(location.pathname);
      setTrayCount(meta?.count ?? 0);
    };

    refreshTrayCount();
    window.addEventListener("storage", refreshTrayCount);
    window.addEventListener("uburu:cart-updated", refreshTrayCount);

    return () => {
      window.removeEventListener("storage", refreshTrayCount);
      window.removeEventListener("uburu:cart-updated", refreshTrayCount);
    };
  }, [location.pathname]);

  // Handle click outside for "Get" dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (getDropdownRef.current && !getDropdownRef.current.contains(event.target as Node)) {
        setIsGetOpen(false);
      }
    };

    if (isGetOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGetOpen]);

  return (
    <nav
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-neutral-900/95 backdrop-blur-md py-3 shadow-2xl border-b border-yellow-500/20"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center gap-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src={logo}
            alt="Uburumultimove logo"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400 group-hover:ring-yellow-300 transition-all duration-300 shadow-lg shadow-yellow-500/20"
          />
          <span className="text-white text-lg xl:text-xl font-bold tracking-tight">
            Uburu<span className="text-yellow-400">Multimove</span>
          </span>
        </Link>

        {/* Desktop Navigation - Center Links */}
        <div className="hidden xl:flex flex-1 justify-center items-center gap-6">
          {NavbarLinks.map((link) => (
            <Link
              key={link.id}
              to={link.link}
              className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 relative py-1 ${
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

        {/* Desktop Navigation - Right Side (Tray & Buttons) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {trayMeta && (
            <Link
              to={trayMeta.link}
              className="rounded-full border border-yellow-500/40 bg-black/40 backdrop-blur-sm px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-yellow-300 transition-colors hover:bg-neutral-800"
            >
              {trayMeta.label}: {trayCount}
            </Link>
          )}

          <div className="flex items-center gap-3">
            <Link to="/donate">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-6 py-2.5 text-[10px] uppercase tracking-widest border-none shadow-lg shadow-yellow-500/10 flex items-center gap-2">
                <HandHeart className="w-3.5 h-3.5" />
                Donate
              </Button>
            </Link>

            <div className="relative" ref={getDropdownRef}>
              <Button
                className="bg-white hover:bg-gray-100 text-black font-black px-6 py-2.5 text-[10px] uppercase tracking-widest border-none shadow-lg flex items-center gap-2"
                onClick={() => setIsGetOpen(!isGetOpen)}
              >
                Get
                <ChevronDown className={`w-3 h-3 transition-transform ${isGetOpen ? 'rotate-180' : ''}`} />
              </Button>

              {isGetOpen && (
                <div className="absolute top-full mt-3 right-0 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    {getDropdownItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.href}
                        onClick={() => setIsGetOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                      >
                        <div className="shrink-0 w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                          <item.icon className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{item.label}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-800">
            <Link to="/donate" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-3 text-sm border-none flex items-center justify-center gap-2">
                <HandHeart className="w-4 h-4" />
                Donate
              </Button>
            </Link>
            <div className="relative">
              <Button
                className="w-full bg-white hover:bg-gray-100 text-black font-extrabold py-3 text-sm border-none flex items-center justify-center gap-2"
                onClick={() => setIsGetOpen(!isGetOpen)}
              >
                Get
                <ChevronDown className={`w-4 h-4 transition-transform ${isGetOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {isGetOpen && (
            <div className="grid grid-cols-1 gap-2 bg-neutral-800/50 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
              {getDropdownItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  onClick={() => {
                    setIsGetOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-neutral-700 rounded-xl transition-colors"
                >
                  <div className="shrink-0 w-10 h-10 bg-yellow-100/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {trayMeta && (
            <Link
              to={trayMeta.link}
              className="block rounded-xl border border-yellow-500/40 bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-yellow-300"
            >
              {trayMeta.label}: {trayCount}
            </Link>
          )}
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

