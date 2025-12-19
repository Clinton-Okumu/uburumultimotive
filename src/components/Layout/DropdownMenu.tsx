import { ChevronDown, Heart, ShoppingBag, Brain, Calendar, CreditCard } from "lucide-react";

interface DropdownItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  href: string;
  onClick?: () => void;
}

const DropdownItem = ({ icon: Icon, label, description, href, onClick }: DropdownItemProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // Close dropdown and navigate
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
        <Icon className="w-5 h-5 text-yellow-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 group-hover:text-yellow-600 transition-colors">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </a>
  );
};

interface DropdownMenuProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: DropdownItemProps[];
  isOpen: boolean;
  onToggle: () => void;
}

const DropdownMenu = ({ title, icon: Icon, items, isOpen, onToggle }: DropdownMenuProps) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-1 ${
          isOpen 
            ? "text-yellow-400" 
            : "text-gray-200 hover:text-yellow-400"
        }`}
      >
        <Icon className="w-4 h-4" />
        {title}
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        <span
          className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
            isOpen ? "w-full" : "w-0"
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <div className="p-2">
          {items.map((item, index) => (
            <DropdownItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Dropdown configurations
export const donateDropdownItems = [
  {
    icon: CreditCard,
    label: "Money",
    description: "Card & M-Pesa donations",
    href: "/donate/money"
  },
  {
    icon: Heart,
    label: "Clothes",
    description: "Clothing donations & coordination",
    href: "/donate/clothes"
  },
  {
    icon: ShoppingBag,
    label: "Food Items",
    description: "Food donations & coordination",
    href: "/donate/food"
  },
  {
    icon: Heart,
    label: "Services",
    description: "Volunteer your skills & time",
    href: "/donate/services"
  },
  {
    icon: ShoppingBag,
    label: "Other Items",
    description: "Furniture, electronics & more",
    href: "/donate/other"
  }
];

export const getDropdownItems = [
  {
    icon: Brain,
    label: "Affordable Therapy",
    description: "Professional mental health support",
    href: "/get/therapy"
  },
  {
    icon: ShoppingBag,
    label: "Buy Something",
    description: "Shop for a cause",
    href: "/get/shop"
  },
  {
    icon: Calendar,
    label: "Book Recreation",
    description: "Team building & group events",
    href: "/get/recreation"
  }
];

export default DropdownMenu;