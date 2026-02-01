import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />

      <input
        type="text"
        aria-label="Search books"
        placeholder="Search books by title, author, or ISBN..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.trimStart())}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                   focus:ring-opacity-20 transition-colors"
      />
    </motion.div>
  );
};