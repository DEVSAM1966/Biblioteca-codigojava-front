import { motion } from "framer-motion";
import { Library } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <Library className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">{message}</p>
    </motion.div>
  );
};
