import { ReactNode } from "react";

export default function IconButton({
    icon,
    onClick,
    activated,
}: {
    icon: ReactNode;
    onClick: () => void;
    activated: boolean;
}) {
    return (
        <button
            className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500`}
            onClick={onClick}
        >
        {icon}
        </button>
    );
}