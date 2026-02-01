import { motion } from "framer-motion";
import { Library } from "lucide-react";

interface EmptyStateProps {
  message: string;
  subtext?: string;
}

export const EmptyState = ({ message, subtext }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-center py-12"
    >
      <Library className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">{message}</p>

      {subtext && (
        <p className="text-gray-400 text-sm mt-2">{subtext}</p>
      )}
    </motion.div>
  );
};