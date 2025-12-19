import { ArrowRight, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import logo from "../../assets/logo.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: "Organization",
            links: [
                { name: "About Us", url: "#" },
                { name: "Our Causes", url: "#" },
                { name: "Impact Gallery", url: "#" },
                { name: "Contact", url: "#" },
            ],
        },
        {
            title: "Get Involved",
            links: [
                { name: "Volunteer", url: "#" },
                { name: "Donate Now", url: "#" },
                { name: "Partner With Us", url: "#" },
                { name: "FAQ", url: "#" },
            ],
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", url: "#" },
                { name: "Terms of Service", url: "#" },
                { name: "Cookie Policy", url: "#" },
            ],
        },
    ];

    const socialLinks = [
        { name: "Instagram", url: "#", icon: <Instagram className="h-5 w-5" /> },
        { name: "Twitter", url: "#", icon: <Twitter className="h-5 w-5" /> },
        { name: "Facebook", url: "#", icon: <Facebook className="h-5 w-5" /> },
        { name: "LinkedIn", url: "#", icon: <Linkedin className="h-5 w-5" /> },
    ];

    return (
        <footer className="bg-neutral-950 text-white pt-20 pb-10 border-t border-neutral-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Brand & Social Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img src={logo} alt="UburuMultimotive logo" className="w-12 h-12 object-contain" />
                            <span className="font-black text-2xl tracking-tighter">
                                UBURU<span className="text-yellow-400">MULTIMOTIVE</span>
                            </span>
                        </div>
                        <p className="text-gray-400 mb-8 max-w-sm leading-relaxed text-base">
                            Providing safe shelter, warm meals, and compassionate support
                            to help families rebuild their lives with dignity and hope.
                        </p>
                        <div className="flex space-x-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    className="bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-black hover:bg-yellow-400 p-3 rounded-xl transition-all duration-300 shadow-lg"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Link Columns */}
                    {footerLinks.map((section, index) => (
                        <div key={index} className="col-span-1">
                            <h3 className="font-black text-yellow-400 text-xs uppercase tracking-[0.2em] mb-8">
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a
                                            href={link.url}
                                            className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center group"
                                        >
                                            <span className="w-0 group-hover:w-4 h-[1px] bg-yellow-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter Subscription Card */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-[2rem] p-10 mb-16 border border-neutral-800 shadow-2xl relative overflow-hidden group">
                    {/* Decorative radial glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-700" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
                        <div>
                            <h3 className="text-2xl font-black mb-3 italic tracking-tight uppercase">
                                Stay in the <span className="text-yellow-400">Loop</span>
                            </h3>
                            <p className="text-gray-400 max-w-md">
                                Join our community to receive impact reports and stories of hope directly to your inbox.
                            </p>
                        </div>
                        <form className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 px-6 py-4 bg-neutral-800/50 text-white rounded-2xl border border-neutral-700 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                            />
                            <button
                                type="submit"
                                className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group/btn"
                            >
                                Subscribe
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright & Bottom Links */}
                <div className="pt-10 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm font-medium">
                        © {currentYear} <span className="text-neutral-300 font-bold uppercase tracking-wider">UburuMultimotive</span>. Empowering change through action.
                    </p>
                    <div className="flex space-x-8">
                        <a href="#" className="text-gray-500 hover:text-yellow-400 text-xs font-bold uppercase tracking-widest transition-colors">
                            Security
                        </a>
                        <a href="#" className="text-gray-500 hover:text-yellow-400 text-xs font-bold uppercase tracking-widest transition-colors">
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
