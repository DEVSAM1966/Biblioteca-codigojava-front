import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Bookmark } from "lucide-react";
import { Book } from "../types";

interface AvailableBooksSectionProps {
  filteredBooks: Book[];
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  handleBorrow: (isbn: string) => void;
  BACKEND_URL: string;
  onReadLater: (isbn: string) => void;
  borrowedIsbns: Set<string>;   // <-- NUEVO
}

export const AvailableBooksSection = ({
  filteredBooks,
  selectedBook,
  setSelectedBook,
  handleBorrow,
  BACKEND_URL,
  onReadLater,
  borrowedIsbns,   // <-- NUEVO
}: AvailableBooksSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
          <Bookmark className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Available Books</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredBooks.map((book, index) => {
          const isBorrowed = borrowedIsbns.has(book.isbn);   // <-- NUEVO

          return (
          <motion.div
            key={book.isbn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 ${
              selectedBook?.isbn === book.isbn ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() =>
              setSelectedBook(selectedBook?.isbn === book.isbn ? null : book)
            }
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
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-2">By {book.nameAuthor}</p>
                  <p className="text-sm text-gray-500 mb-4">ISBN: {book.isbn}</p>

                  <div className="mb-4">
                    <p className="text-gray-700 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                      Category: {book.nameCategory} - {book.subtopicCategory}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                      Language: {book.language}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto">
                  
                  {/* Availability Badge */}
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Available to read
                  </span>

                  <div className="flex items-center gap-2">

                    {/* Read Later (Watch) */}
                    <motion.button
                      whileHover={!isBorrowed ? { scale: 1.05 } : {}}
                      whileTap={!isBorrowed ? { scale: 0.95 } : {}}
                      disabled={isBorrowed}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isBorrowed) onReadLater(book.isbn);
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300
                        ${isBorrowed
                          ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"
                        }`}
                    >
                      {isBorrowed ? "Borrowed" : "Watch"}
                    </motion.button>

                    {/* Borrow */}
                    <motion.button
                      whileHover={!isBorrowed ? { scale: 1.05 } : {}}
                      whileTap={!isBorrowed ? { scale: 0.95 } : {}}
                      disabled={isBorrowed}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isBorrowed) handleBorrow(book.isbn);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg
                        ${isBorrowed
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20"
                        }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>{isBorrowed ? "Borrowed" : "Borrow"}</span>
                      {!isBorrowed && <ArrowRight className="h-4 w-4" />}
                    </motion.button>

                  </div>

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

