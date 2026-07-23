import { ArrowRight, Facebook, Instagram } from "lucide-react";
import logo from "../../assets/logo.webp";

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.05.82.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V9.05a8.16 8.16 0 0 0 4.91 1.64V7.24a4.85 4.85 0 0 1-1-.55z"/>
  </svg>
);

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
        { name: "Volunteer", url: "/volunteer" },
        { name: "Donate Now", url: "/donate" },
        { name: "Partner With Us", url: "/partner" },
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
    {
      name: "Therapy",
      platform: "IG",
      url: "https://www.instagram.com/uburu_therapy?igsh=YjNpd3JkajZ0Nnh2",
      icon: <Instagram className="h-3.5 w-3.5" />,
    },
    {
      name: "Therapy",
      platform: "TikTok",
      url: "https://vm.tiktok.com/ZS9rh1pN7BRSq-pXrcz/",
      icon: <TikTokIcon className="h-3.5 w-3.5" />,
    },
    {
      name: "Village",
      platform: "IG",
      url: "https://www.instagram.com/uburu_village?igsh=MWd6NzBqbzJsdTJ0eg==",
      icon: <Instagram className="h-3.5 w-3.5" />,
    },
    {
      name: "Village",
      platform: "TikTok",
      url: "https://vm.tiktok.com/ZS9rh1pN7BRSq-pXrcz/",
      icon: <TikTokIcon className="h-3.5 w-3.5" />,
    },
    {
      name: "Home",
      platform: "IG",
      url: "https://www.instagram.com/uburu_home?igsh=MWRxazlyemhidWJwaQ==",
      icon: <Instagram className="h-3.5 w-3.5" />,
    },
    {
      name: "Home",
      platform: "TikTok",
      url: "https://vm.tiktok.com/ZS9rhJNM6R8dG-pQ0fn/",
      icon: <TikTokIcon className="h-3.5 w-3.5" />,
    },
    {
      name: "Initiatives",
      platform: "IG",
      url: "https://www.instagram.com/uburu_initiatives/",
      icon: <Instagram className="h-3.5 w-3.5" />,
    },
    {
      name: "NGO",
      platform: "IG",
      url: "https://www.instagram.com/uburumultimove_ngo/",
      icon: <Instagram className="h-3.5 w-3.5" />,
    },
    {
      name: "Facebook",
      platform: "FB",
      url: "https://www.facebook.com/people/Uburu-Multimove-Hs/100094629176628/",
      icon: <Facebook className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <footer className="bg-neutral-950 text-white pt-20 pb-10 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Social Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logo}
                alt="UburuMultimove logo"
                className="w-12 h-12 object-contain"
                loading="lazy"
              />
              <span className="font-black text-2xl tracking-tighter">
                UBURU<span className="text-yellow-400">MULTIMOVE</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed text-base">
              Providing safe shelter, warm meals, and compassionate support to
              help families rebuild their lives with dignity and hope.
            </p>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-3">
                Connect With Our Entities
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-900 border border-neutral-800 text-gray-300 hover:text-black hover:bg-yellow-400 px-3 py-1.5 rounded-xl transition-all duration-300 shadow-md flex items-center gap-1.5 text-xs font-semibold"
                    aria-label={`Uburu ${social.name} ${social.platform}`}
                    title={`Uburu ${social.name} - ${social.platform}`}
                  >
                    {social.icon}
                    <span>{social.name} ({social.platform})</span>
                  </a>
                ))}
              </div>
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

        {/* Partner CTA Card */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-[2rem] p-10 mb-16 border border-neutral-800 shadow-2xl relative overflow-hidden group">
          {/* Decorative radial glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-700" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div>
              <h3 className="text-2xl font-black mb-3 italic tracking-tight uppercase">
                Partner <span className="text-yellow-400">With Us</span>
              </h3>
              <p className="text-gray-400 max-w-md">
                Join our mission to create lasting community impact. Become a
                partner today and help us restore dignity to families in care.
              </p>
            </div>
            <div className="flex justify-start lg:justify-end">
              <a
                href="/partner"
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 group/btn"
              >
                Become a Partner
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="pt-10 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm font-medium">
            © {currentYear}{" "}
            <span className="text-neutral-300 font-bold uppercase tracking-wider">
              UburuMultimove
            </span>
            . Empowering change through action.
          </p>
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-gray-500 hover:text-yellow-400 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Security
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-yellow-400 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
