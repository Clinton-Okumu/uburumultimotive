import { Menu, X, ChevronDown } from "lucide-react";
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

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [trayCount, setTrayCount] = useState(0);
  const [isGetOpen, setIsGetOpen] = useState(false);
  const location = useLocation();
  const getDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const trayMeta = getTrayMeta(location.pathname);

  const handleMobileLinkClick = (linkPath: string) => {
    if (location.pathname === linkPath) {
      setMobileMenuOpen(false);
      setIsGetOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setMobileMenuOpen(false);
    setIsGetOpen(false);
  }

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
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const insideDesktop = getDropdownRef.current?.contains(target);
      const insideMobile = mobileDropdownRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
        setIsGetOpen(false);
      }
    };

    if (isGetOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
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
        <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={() => handleMobileLinkClick("/")}>
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

          <div className="relative" ref={getDropdownRef}>
            <Button
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-2.5 text-[10px] uppercase tracking-widest border-none shadow-lg flex items-center gap-2"
              onClick={() => setIsGetOpen(!isGetOpen)}
            >
              Enterprises
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
        className={`lg:hidden absolute top-full left-0 right-0 bg-neutral-900 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-[calc(100vh-64px)] overflow-y-auto opacity-100 border-t border-neutral-800 shadow-2xl"
            : "max-h-0 overflow-hidden opacity-0 pointer-events-none border-transparent shadow-none"
        }`}
      >
        <div
          className="p-8 space-y-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
        >
          <div className="flex flex-col gap-3 pb-6 border-b border-neutral-800">
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 text-sm uppercase tracking-widest border-none flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsGetOpen(!isGetOpen);
              }}
            >
              Enterprises
              <ChevronDown className={`w-4 h-4 transition-transform ${isGetOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isGetOpen && (
              <div ref={mobileDropdownRef} className="grid grid-cols-1 gap-2 mt-2 bg-neutral-800/50 rounded-2xl p-2 animate-in fade-in slide-in-from-top-2">
                {getDropdownItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    onClick={() => handleMobileLinkClick(item.href)}
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
          </div>

          {trayMeta && (
            <Link
              to={trayMeta.link}
              onClick={() => handleMobileLinkClick(trayMeta.link)}
              className="block rounded-xl border border-yellow-500/40 bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-yellow-300"
            >
              {trayMeta.label}: {trayCount}
            </Link>
          )}
          {NavbarLinks.map((link) => (
            <Link
              key={link.id}
              to={link.link}
              onClick={() => handleMobileLinkClick(link.link)}
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

