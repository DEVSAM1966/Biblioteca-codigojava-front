import { DetailedBook } from "../types";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface DetailedBookViewProps {
  book: DetailedBook;
  onLoan: (isbn: string) => void;
  BACKEND_URL: string;
  onBack: () => void; // 🆕 NUEVO
}

export const DetailedBookView = ({ book, onLoan, BACKEND_URL, onBack }: DetailedBookViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-xl shadow-lg space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => onBack()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
        ← Back
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">

        {/* Cover */}
        <img
          src={`${BACKEND_URL}${book.bookCover}`}
          alt={book.title}
          className="w-64 h-auto rounded-lg shadow-md"
        />

        {/* Info */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{book.title}</h2>

          <p className="text-gray-600"><strong>ISBN:</strong> {book.isbn}</p>

          {book.summary && (
            <p className="text-gray-700">{book.summary}</p>
          )}

          <p><strong>Pages:</strong> {book.pages ?? "Unknown"}</p>
          <p><strong>Language:</strong> {book.language ?? "Unknown"}</p>

          <p><strong>Author:</strong> {book.nameAuthor ?? "Unknown"}</p>

          {book.authors && (
            <p><strong>Authors:</strong> {book.authors}</p>
          )}

          <p><strong>Publisher:</strong> {book.namePublisher ?? "Unknown"}</p>

          <button
            onClick={() => onLoan(book.isbn)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <BookOpen className="h-5 w-5" />
            Loan
          </button>
        </div>
      </div>
    </motion.div>
  );
};
