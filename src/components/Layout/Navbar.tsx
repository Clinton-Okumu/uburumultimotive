import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../shared/Button";

const donateUrl =
    "https://shop.directpay.online/paymybills/UBURUMULTIMOVEHOMELESSSHELTER?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

type NavLink = {
    id: number;
    title: string;
    link: string;
    external?: boolean;
};

const NavbarLinks: NavLink[] = [
    { id: 1, title: "Home", link: "/" },
    { id: 2, title: "About", link: "/about" },
    { id: 3, title: "Causes", link: "/causes" },
    { id: 4, title: "Blogs", link: "/blogs" },
    { id: 5, title: "Contact", link: "/contact" },
    { id: 6, title: "Donations", link: donateUrl, external: true },
];

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMobileMenuOpen &&
                !(event.target as HTMLElement).closest(".nav-container")
            ) {
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
                        className={`w-10 h-10 rounded-full object-cover transition-all duration-300 ${scrolled
                            ? "ring-2 ring-yellow-400"
                            : "ring-2 ring-yellow-300"
                            }`}
                    />
                    <span className="text-white text-2xl font-bold font-inter">
                        Uburumultimotive
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="font-inter hidden lg:flex items-center gap-8">
                    {NavbarLinks.map((link) =>
                        link.external ? (
                            <a
                                key={link.id}
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-yellow-300 transition-colors font-medium"
                            >
                                {link.title}
                            </a>
                        ) : (
                            <Link
                                key={link.id}
                                to={link.link}
                                className={`text-white transition-colors font-medium relative group ${location.pathname === link.link
                                    ? "text-yellow-300"
                                    : "hover:text-yellow-300"
                                    }`}
                            >
                                {link.title}
                                <span
                                    className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${location.pathname === link.link
                                        ? "w-full"
                                        : "w-0 group-hover:w-full"
                                        }`}
                                />
                            </Link>
                        )
                    )}
                </div>

                {/* Desktop Donate Button */}
                <div className="font-inter hidden lg:block">
                    <a
                        href={donateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
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
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden">
                    <button
                        className="p-2 text-white hover:text-yellow-300 transition-colors"
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="nav-container absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md p-5 border-t border-gray-700">
                    <ul className="flex flex-col gap-4">
                        {NavbarLinks.map((link) => (
                            <li key={link.id}>
                                {link.external ? (
                                    <a
                                        href={link.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-white hover:text-yellow-300 text-lg"
                                    >
                                        {link.title}
                                    </a>
                                ) : (
                                    <Link
                                        to={link.link}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-white hover:text-yellow-300 text-lg"
                                    >
                                        {link.title}
                                    </Link>
                                )}
                            </li>
                        ))}

                        {/* Mobile Donate Button */}
                        <li className="pt-2">
                            <a
                                href={donateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileMenuOpen(false)}
                            >
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
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
