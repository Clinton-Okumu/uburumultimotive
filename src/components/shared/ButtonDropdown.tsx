import { useState, type ReactNode, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface DropdownItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  href: string;
  onClick?: () => void;
}

interface ButtonDropdownProps {
  children: ReactNode;
  icon?: ReactNode;
  items: DropdownItemProps[];
}

const ButtonDropdown = ({ children, icon, items }: ButtonDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      
      if (triggerRect.right + 384 > screenWidth) {
        setPosition('right');
      } else {
        setPosition('left');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target || !(event.target instanceof Node)) return;
      const dropdown = document.querySelector('[role="menu"]');
      if (dropdown && !dropdown.contains(event.target) && !triggerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${isOpen ? 'z-[9999]' : ''}`}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-500 hover:bg-yellow-300 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-black font-bold transition-all duration-300 flex items-center justify-center gap-2"
      >
        {children}
        {icon}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        role="menu"
        className={`absolute top-full mt-2 sm:mt-3 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-gray-100 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.05)] border border-gray-300 transition-all duration-300 backdrop-blur-sm ${
          position === 'left' ? 'left-0' : 'right-0'
        } ${
          isOpen
            ? "opacity-100 translate-y-0 visible z-[9999]"
            : "opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <div className="p-2 sm:p-4 space-y-1 sm:space-y-2 max-h-[60vh] overflow-y-auto">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={() => {
                if (item.onClick) item.onClick();
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 bg-white hover:bg-yellow-50 rounded-xl transition-all duration-300 group border border-gray-200 hover:border-yellow-200"
            >
              <div className="flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-yellow-600 transition-colors font-montserrat">
                  {item.label}
                </p>
                {item.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 leading-relaxed font-inter line-clamp-1 sm:line-clamp-none">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="hidden sm:flex flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronDown className="w-5 h-5 text-yellow-600 rotate-[-90deg]" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButtonDropdown;
