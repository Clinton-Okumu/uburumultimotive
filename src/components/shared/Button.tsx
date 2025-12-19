import type { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
    icon?: ReactNode;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

const Button = ({
    children,
    onClick,
    className = "",
    icon,
    fullWidth = false,
    type = "button",
    disabled = false,
}: ButtonProps) => {
    const baseStyles =
        "bg-yellow-500 hover:bg-yellow-300 px-6 py-3 rounded-full text-black font-bold text-black transition-all duration-300 flex items-center justify-center gap-2";

    const widthStyle = fullWidth ? "w-full" : "";
    const disabledStyle = disabled ? "opacity-50 cursor-not-allowed hover:bg-yellow-500" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${widthStyle} ${disabledStyle} ${className}`}
        >
            {children}
            {icon}
        </button>
    );
};

export default Button;

