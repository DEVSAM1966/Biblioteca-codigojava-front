import { motion } from "framer-motion";
import { BookOpenCheck, Clock, CheckCircle } from "lucide-react";
import { Book, BorrowRecord } from "../types";

interface BorrowedBooksSectionProps {
  books: Book[];
  borrowedBooks: BorrowRecord[];
  handleReturn: (isbn: string) => void;
  getDaysRemaining: (dueDate: string) => number;
}

export const BorrowedBooksSection = ({
  books,
  borrowedBooks,
  handleReturn,
  getDaysRemaining
}: BorrowedBooksSectionProps) => {
  
  const borrowedBookIds = borrowedBooks.map((record) => record.bookId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
          <BookOpenCheck className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Currently Reading</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {books
          .filter((book) => borrowedBookIds.includes(book.isbn))
          .map((book, index) => {
            const borrowRecord = borrowedBooks.find(
              (record) => record.bookId === book.isbn
            );

            const daysRemaining = borrowRecord
              ? getDaysRemaining(borrowRecord.dueDate)
              : 0;

            return (
              <motion.div
                key={book.isbn}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100/50"
              >
                <div className="flex flex-col md:flex-row">
                  
                  {/* Book Cover */}
                  <div className="relative w-full md:w-1/3">
                    <div className="aspect-[3/4] relative">
                      <img
                        src={book.bookCover}
                        alt={book.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 mb-2">By {book.nameAuthor}</p>
                      <p className="text-sm text-gray-500 mb-4">ISBN: {book.isbn}</p>

                      <div className="mb-4">
                        <p className="text-gray-700 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                          {book.nameCategory} - {book.subtopicCategory}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          daysRemaining > 2
                            ? "bg-green-100 text-green-800"
                            : daysRemaining > 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {daysRemaining > 0
                          ? `${daysRemaining} days remaining`
                          : "Overdue"}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReturn(book.isbn)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Return Book
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </motion.div>
  );
};
