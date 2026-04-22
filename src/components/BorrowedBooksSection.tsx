import { motion } from "framer-motion";
import { BookOpen, RotateCcw, Clock } from "lucide-react";
import { Book, ActiveLoan } from "../types";
import { BACKEND_URL } from "../config";

interface BorrowedBooksSectionProps {
  books: Book[];
  borrowedBooks: ActiveLoan[];
  handleReturn: (isbn: string) => void;
  getDaysRemaining: (dueDate: string) => number;
  onRead: (isbn: string) => void; 
}

export const BorrowedBooksSection = ({
  books,
  borrowedBooks,
  handleReturn,
  getDaysRemaining,
  onRead,
}: BorrowedBooksSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Borrowed Books</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {borrowedBooks.map((loan, index) => {
          const book = books.find((b) => b.isbn === loan.isbn);

          if (!book) return null;

          const daysRemaining = getDaysRemaining(loan.dueDate);
          const isOverdue = daysRemaining < 0;

          return (
            <motion.div
              key={loan.loanId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                
                {/* Book Cover */}
                <div className="relative w-full md:w-1/3">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={`${BACKEND_URL}/${book.bookCover}`}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex-1 p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-2">By {book.nameAuthor}</p>
                  <p className="text-sm text-gray-500 mb-4">ISBN: {book.isbn}</p>

                  {/* Due Date */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span
                      className={`text-sm font-medium ${
                        isOverdue ? "text-red-600" : "text-gray-700"
                      }`}
                    >
                      {isOverdue
                        ? `Overdue by ${Math.abs(daysRemaining)} days`
                        : `${daysRemaining} days remaining`}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">

                    {/* Read Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRead(book.isbn)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/20 w-full sm:w-auto"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Read</span>
                    </motion.button>

                    {/* Return Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReturn(book.isbn)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/20 w-full sm:w-auto"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Return</span>
                    </motion.button>

                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};