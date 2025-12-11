import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../shared/Button";

const NavbarLinks = [
    { id: 1, title: "Home", link: "/" },
    { id: 2, title: "About", link: "/about" },
    { id: 3, title: "Causes", link: "/causes" },
    { id: 4, title: "Blogs", link: "/blogs" },
    { id: 5, title: "Contact", link: "/contact" },
    { id: 6, title: "Donations", link: "/donate" },
];

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isMobileMenuOpen && !event.target.closest(".nav-container")) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    return (
        <nav
            className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-container ${scrolled
                ? "bg-black/95 backdrop-blur-sm py-3 shadow-lg"
                : "bg-gray-900 backdrop-blur-md py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="Uburumultimotive logo"
                        className={`w-10 h-10 rounded-full object-cover transition-all duration-300 ${scrolled ? "ring-2 ring-yellow-400" : "ring-2 ring-yellow-300"
                            }`}
                    />
                    <span className="text-white text-2xl font-bold font-inter">
                        Uburumultimotive
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="font-inter hidden lg:flex items-center gap-8">
                    {NavbarLinks.map((link) => (
                        <Link
                            key={link.id}
                            to={link.link}
                            className={`text-white transition-colors duration-200 font-medium relative group 
                                ${location.pathname === link.link
                                    ? "text-yellow-300"
                                    : "hover:text-yellow-300"
                                }
                            `}
                        >
                            {link.title}

                            {/* underline */}
                            <span
                                className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300 
                                    ${location.pathname === link.link
                                        ? "w-full"
                                        : "w-0 group-hover:w-full"
                                    }
                                `}
                            />
                        </Link>
                    ))}
                </div>

                {/* Desktop Donate Button */}
                <div className="font-inter hidden lg:block">
                    <Link to="/donate">
                        <Button
                            fullWidth
                            icon={
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
                            }
                        >
                            Donate
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center">
                    <button
                        className="p-2 text-white hover:text-yellow-300 transition-colors focus:outline-none"
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMobileMenuOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="nav-container absolute top-full left-0 right-0 max-h-[80vh] overflow-y-auto bg-gray-900/95 backdrop-blur-md p-5 shadow-lg border-t border-gray-700 transition-all duration-300">
                    <ul className="flex flex-col gap-4">
                        {NavbarLinks.map((link) => (
                            <li key={link.id} className="border-b border-gray-700 pb-2">
                                <Link
                                    className="block text-white hover:text-yellow-300 transition-colors text-lg font-medium"
                                    to={link.link}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.title}
                                </Link>
                            </li>
                        ))}

                        {/* Mobile Donate Button */}
                        <li className="pt-2">
                            <Link to="/donate" onClick={() => setMobileMenuOpen(false)}>
                                <Button>
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
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
