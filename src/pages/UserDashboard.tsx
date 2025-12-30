// -------------------------------------------------------------
// 🟦 SECCIÓN A — IMPORTS
// -------------------------------------------------------------
import { DashboardHeader } from "../components/DashboardHeader";
import { SearchBar } from "../components/SearchBar";
import { BorrowedBooksSection } from "../components/BorrowedBooksSection";
import { AvailableBooksSection } from "../components/AvailableBooksSection";
import { EmptyState } from "../components/EmptyState";

import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Book, BorrowRecord } from "../types";

import { getBooks } from "../utils/books.api";
import { borrowBook, returnBook, getBorrowedBooks } from "../utils/books";
import { getCurrentUser } from "../utils/auth";
import { BACKEND_URL } from "../config";


// -------------------------------------------------------------
// 🟦 SECCIÓN B — ESTADOS (NUEVOS MARCADOS)
// -------------------------------------------------------------
const UserDashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 🆕 NUEVO — estado para selección de libro
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // 🆕 NUEVO — estado de carga
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });


// -------------------------------------------------------------
// 🟦 SECCIÓN C — FUNCIONES NUEVAS (COMPLETAS)
// -------------------------------------------------------------

  // 🆕 NUEVO — cargar libros y préstamos
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const [booksData, borrowedBooksData] = await Promise.all([
            getBooks(),
            getBorrowedBooks(currentUser.id)
          ]);
          setBooks(booksData);
          setBorrowedBooks(borrowedBooksData || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [currentUser?.id]);


  // 🆕 NUEVO — pedir libro
  const handleBorrow = async (bookId: string) => {
    if (!currentUser) return;
    try {
      await borrowBook(bookId, currentUser.id);
      const [updatedBooks, updatedBorrowedBooks] = await Promise.all([
        getBooks(),
        getBorrowedBooks(currentUser.id)
      ]);
      setBooks(updatedBooks);
      setBorrowedBooks(updatedBorrowedBooks);
      setSelectedBook(null);
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };


  // 🆕 NUEVO — devolver libro
  const handleReturn = async (bookId: string) => {
    if (!currentUser) return;
    try {
      await returnBook(bookId, currentUser.id);
      const [updatedBooks, updatedBorrowedBooks] = await Promise.all([
        getBooks(),
        getBorrowedBooks(currentUser.id)
      ]);
      setBooks(updatedBooks);
      setBorrowedBooks(updatedBorrowedBooks);
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };


  // 🆕 NUEVO — calcular días restantes
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };


// -------------------------------------------------------------
// 🟦 SECCIÓN D — FILTRADO REAL DE LIBROS (RESTAURADO)
// -------------------------------------------------------------
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.nameAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.nameCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.subtopicCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );


// -------------------------------------------------------------
// 🟦 SECCIÓN E — JSX FINAL
// -------------------------------------------------------------
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <DashboardHeader
        borrowedCount={borrowedBooks.length}
        availableCount={filteredBooks.length}
        headerRef={headerRef}
        headerInView={headerInView}
      />

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {borrowedBooks.length > 0 && (
        <BorrowedBooksSection
          books={books}
          borrowedBooks={borrowedBooks}
          handleReturn={handleReturn}
          getDaysRemaining={getDaysRemaining}
        />
      )}

      {filteredBooks.length > 0 && (
        <AvailableBooksSection
          filteredBooks={filteredBooks}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          handleBorrow={handleBorrow}
          BACKEND_URL={BACKEND_URL}
        />
      )}

      {filteredBooks.length === 0 && borrowedBooks.length === 0 && (
        <EmptyState message="No books found matching your search." />
      )}

    </div>
  );
};

export default UserDashboard;

