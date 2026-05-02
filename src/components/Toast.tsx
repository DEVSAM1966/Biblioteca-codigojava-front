import { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // 3 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 animate-fade-in z-50">
      <ExclamationTriangleIcon className="h-6 w-6 text-white" />
      <span>{message}</span>
    </div>
  );
};
