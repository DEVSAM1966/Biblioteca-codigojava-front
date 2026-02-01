// -------------------------------------------------------------
// 🟦 SECCIÓN A — IMPORTS
// -------------------------------------------------------------
import { DashboardHeader } from "../components/DashboardHeader";
import { SearchBar } from "../components/SearchBar";
import { BorrowedBooksSection } from "../components/BorrowedBooksSection";
import { AvailableBooksSection } from "../components/AvailableBooksSection";
import { EmptyState } from "../components/EmptyState";
import { DetailedBookView } from "../components/DetailedBookView";

import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Book, BorrowRecord, DetailedBook } from "../types";

import { getBooks, getBookByISBN, getBookFileByISBN } from "../utils/books.api";
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

  // 🆕 NUEVO — estado para el libro detallado
  const [detailedBook, setDetailedBook] = useState<DetailedBook | null>(null);

  // 🆕 NUEVO — estado de carga
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 🆕 NUEVO — estado para la URL del PDF
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // 🆕 NUEVO — estado para mostrar/ocultar modal PDF
  const [showPdfModal, setShowPdfModal] = useState(false);



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

  // 🆕 NUEVO — controlar overflow al mostrar modal PDF
  useEffect(() => {
    if (showPdfModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showPdfModal]);

  // 🆕 NUEVO — pedir libro
  const handleBorrow = async (bookId: string) => {
    if (!currentUser) return;
    try {
      // 1. Registrar el préstamo en Firestore
      await borrowBook(bookId, currentUser.id);

      // 2. Obtener la URL del PDF desde el backend de Node.js
      const fileData = await getBookFileByISBN(bookId); 
      setPdfUrl(fileData.fileUrl);
      setShowPdfModal(true);


      // 3. Actualizar libros y préstamos
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

  // 🆕 NUEVO — seleccionar libro para vista detallada
  const handleReadLater = async (isbn: string) => {
    try {
      // Llamamos al endpoint detallado
      const book = await getBookByISBN(isbn);

      // Guardamos el libro detallado
      setDetailedBook(book);

      // Ocultamos selección previa
      setSelectedBook(null);

      // Opcional: limpiar búsqueda para evitar confusiones
      // setSearchQuery("");
    } catch (error) {
      console.error("Error fetching detailed book:", error);
    }
  };

  // 🆕 NUEVO — volver al dashboard normal
  const handleBackToDashboard = () => {
    setDetailedBook(null);
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

      {/* 🆕 NUEVO — Vista detallada del libro */} 
      {detailedBook && (
         <DetailedBookView 
          book={detailedBook} 
          onLoan={handleBorrow} 
          BACKEND_URL={BACKEND_URL} 
          onBack={handleBackToDashboard}   // 🆕 NUEVO
         /> 
        )}

      {!detailedBook && borrowedBooks.length > 0 && (
        <BorrowedBooksSection
          books={books}
          borrowedBooks={borrowedBooks}
          handleReturn={handleReturn}
          getDaysRemaining={getDaysRemaining}
        />
      )}

      {!detailedBook && filteredBooks.length > 0 && (
        <AvailableBooksSection
          filteredBooks={filteredBooks}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          handleBorrow={handleBorrow}
          BACKEND_URL={BACKEND_URL}
          onReadLater={handleReadLater}   // 🆕 NUEVO
        />
      )}

      {filteredBooks.length === 0 && borrowedBooks.length === 0 && (
        <EmptyState message="No books found matching your search." />
      )}

      {/* 🆕 NUEVO — Modal para mostrar PDF */}
      {showPdfModal && pdfUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onContextMenu={(e) => e.preventDefault()} // bloquea clic derecho
        >
        <div 
          className="relative w-full h-full md:w-11/12 md:h-5/6 bg-white rounded-lg shadow-xl overflow-hidden" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={() => setShowPdfModal(false)}
            className="absolute top-4 right-4 z-50 bg-black/60 text-white px-3 py-1 rounded-lg"
          >
            Close
          </button>

          {/* Visor PDF */}
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full select-none pointer-events-auto"
            sandbox="allow-scripts allow-same-origin"
            style={{
              WebkitTouchCallout: "none", // iOS: bloquea menú táctil
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
            allow="fullscreen"
          ></iframe>
        </div>
      </div>
  )}


    </div>
  );
};

export default UserDashboard;

