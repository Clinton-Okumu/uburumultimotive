import {
  Brain,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import React, {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Link } from "react-router-dom";

const isActivateKey = (key: string) => key === "Enter" || key === " ";

interface DropdownItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  href: string;
  onClick?: () => void;
}

const DropdownItem = React.memo(function DropdownItem({
  icon: Icon,
  label,
  description,
  href,
  onClick,
}: DropdownItemProps) {
  const onKeyDown = (e: ReactKeyboardEvent<HTMLAnchorElement>) => {
    if (isActivateKey(e.key)) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <Link
      to={href}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1"
    >
      <div className="shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
        <Icon className="w-5 h-5 text-yellow-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 group-hover:text-yellow-600 transition-colors">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"left" | "right">("left");

  // Position logic
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const shouldOpenRight = rect.right + 320 > window.innerWidth;

    setPosition(shouldOpenRight ? "right" : "left");
  }, [isOpen]);

  // Focus control
  useEffect(() => {
    if (isOpen) {
      menuRef.current?.querySelector("a")?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Outside click & escape
  useEffect(() => {
    if (!isOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      const isOutside =
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node);

      if (isOutside) onClose();
    };

    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (isActivateKey(e.key)) {
      e.preventDefault();
      onToggle();
    }
    if (e.key === "ArrowDown" && isOpen) {
      menuRef.current?.querySelector("a")?.focus();
    }
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={onToggle}
        onKeyDown={onTriggerKey}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all relative py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
          isOpen ? "text-yellow-400" : "text-gray-200 hover:text-yellow-400"
        }`}
      >
        <Icon className="w-4 h-4" />
        {title}
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        ref={menuRef}
        role="menu"
        className={`absolute top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all z-50 ${
          position === "left" ? "left-0" : "right-0"
        } ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={item.href}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-slide"
            >
              <DropdownItem {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export const getDropdownItems = [
  {
    icon: Brain,
    label: "Uburu Therapy",
    description: "Book for professional therapy",
    href: "/get/therapy",
  },
  {
    icon: ShoppingBag,
    label: "Uburu Home",
    description: "Shop to support families",
    href: "/get/home",
  },
  {
    icon: ShoppingBag,
    label: "Uburu Village",
    description: "Outdoor adventures",
    href: "/get/village",
  },
];

export default DropdownMenu;
