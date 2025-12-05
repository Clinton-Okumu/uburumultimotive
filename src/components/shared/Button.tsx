import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
    icon?: ReactNode;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
}

const Button = ({
    children,
    onClick,
    className = "",
    icon,
    fullWidth = false,
    type = "button",
}: ButtonProps) => {
    const baseStyles =
        "bg-yellow-200 hover:bg-yellow-300 px-6 py-3 rounded-full text-black font-semibold transition-all duration-300 flex items-center justify-center gap-2";

    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${widthStyle} ${className}`}
        >
            {children}
            {icon}
        </button>
    );
};

export default Button;

