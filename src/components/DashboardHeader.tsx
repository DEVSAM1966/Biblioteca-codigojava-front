import { BookMarked, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  borrowedCount: number;
  availableCount: number;
  headerRef: (node?: Element | null) => void;
  headerInView: boolean;
}

export const DashboardHeader = ({
  borrowedCount,
  availableCount,
  headerRef,
  headerInView
}: DashboardHeaderProps) => {
  return (
    <motion.div
      ref={headerRef}
      initial={{ opacity: 0, y: -20 }}
      animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 md:p-12"
    >
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Library Code Java
        </h1>

        <p className="text-lg text-blue-100 max-w-2xl">
          Discover a world of knowledge through our carefully curated collection of books
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <BookMarked className="h-5 w-5" />
            <span className="font-medium">
              {borrowedCount} Book{borrowedCount !== 1 ? "s" : ""} Borrowed
            </span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">
              {availableCount} Book{availableCount !== 1 ? "s" : ""} Found
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/20 to-transparent transform skew-x-12" />
    </motion.div>
  );
};
