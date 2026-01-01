import {
  Brain,
  ChevronDown,
  CreditCard,
  Heart,
  ShoppingBag,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Link } from "react-router-dom";

interface DropdownItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  href: string;
  onClick?: () => void;
  index: number;
  isOpen: boolean;
}

const DropdownItem = React.memo(function DropdownItem({
  icon: Icon,
  label,
  description,
  href,
  onClick,
  index,
  isOpen,
}: DropdownItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Link
      to={href}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1"
      style={{
        animationDelay: isOpen ? `${index * 50}ms` : "0ms",
      }}
    >
      <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-yellow-600 transition-colors">
          {label}
        </p>
        {description && (
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
});

interface DropdownMenuProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: DropdownItemProps[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const DropdownMenu = React.memo(function DropdownMenu({
  title,
  icon: Icon,
  items,
  isOpen,
  onToggle,
  onClose,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState<"left" | "right">("left");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      if (triggerRect.right + 320 > screenWidth) {
        setPosition("right");
      } else {
        setPosition("left");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const firstItem = menuRef.current?.querySelector("a");
      firstItem?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  const handleToggle = useCallback(() => {
    onToggle();
  }, [onToggle]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={`dropdown-${title.toLowerCase()}`}
        className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded ${
          isOpen ? "text-yellow-400" : "text-gray-200 hover:text-yellow-400"
        }`}
      >
        <Icon className="w-4 h-4" aria-hidden="true" />
        {title}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
        <span
          className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
            isOpen ? "w-full" : "w-0"
          }`}
          aria-hidden="true"
        />
      </button>

      {isMounted && (
        <div
          id={`dropdown-${title.toLowerCase()}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={`dropdown-trigger-${title.toLowerCase()}`}
          className={`absolute top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 z-50 ${
            position === "left" ? "left-0" : "right-0"
          } ${
            isOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 invisible pointer-events-none"
          }`}
        >
          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {items.map((item, index) => (
              <DropdownItem
                key={`${item.href}-${index}`}
                {...item}
                index={index}
                isOpen={isOpen}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export const donateDropdownItems = [
  {
    icon: CreditCard,
    label: "Money",
    description: "Card & M-Pesa donations",
    href: "/donate/money",
  },
  {
    icon: Heart,
    label: "Clothes",
    description: "Clothing donations & coordination",
    href: "/donate/clothes",
  },
  {
    icon: ShoppingBag,
    label: "Food Items",
    description: "Food donations & coordination",
    href: "/donate/food",
  },
  {
    icon: Heart,
    label: "Services",
    description: "Volunteer your skills & time",
    href: "/donate/services",
  },
  {
    icon: ShoppingBag,
    label: "Other Items",
    description: "Furniture, electronics & more",
    href: "/donate/other",
  },
];

export const getDropdownItems = [
  {
    icon: Brain,
    label: "Affordable Therapy",
    description: "Professional mental health support",
    href: "/get/therapy",
  },
  // {
  //   icon: ShoppingBag,
  //   label: "Buy Something",
  //   description: "Shop for a cause",
  //   href: "/get/shop",
  // },
  {
    icon: Heart,
    label: "Other Forms of Donation",
    description: "Reach out to us",
    href: "/contact",
  },
];

export default DropdownMenu;
