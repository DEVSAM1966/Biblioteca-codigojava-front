import { DashboardHeader } from "../components/DashboardHeader";
import { SearchBar } from "../components/SearchBar";
import { BorrowedBooksSection } from "../components/BorrowedBooksSection";
import { AvailableBooksSection } from "../components/AvailableBooksSection";
import { EmptyState } from "../components/EmptyState";
import { DetailedBookView } from "../components/DetailedBookView";

import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Book, DetailedBook, ActiveLoan } from "../types";

import { getBooks, getBookByISBN, getBookFileByISBN } from "../utils/books.api";
import { createLoan, returnLoan, getMyLoans } from "../utils/loans.api";
import { getCurrentUser } from "../utils/auth.storage";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

import { Toast } from "../components/Toast";  
import { useToast } from "../components/hooks/useToast";

const UserDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const { toastMessage, showToast, hideToast } = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<ActiveLoan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [detailedBook, setDetailedBook] = useState<DetailedBook | null>(null);
  const [loading, setLoading] = useState(true);

  const [borrowedIsbns, setBorrowedIsbns] = useState<Set<string>>(new Set());

  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Añadir dueDate (14 días después)
  const addDueDate = (loan: ActiveLoan): ActiveLoan => {
    const borrow = new Date(loan.loanDate); 
    const due = new Date(borrow);
    due.setDate(due.getDate() + 14);

    return {
      ...loan,
      dueDate: due.toISOString(),
    };
  };

  // 🔵 Filtro universal de préstamos activos
  const filterActiveLoans = (loans: ActiveLoan[]) => {
    const today = new Date();
    return loans
      .map(addDueDate)
      .filter(loan =>
        !loan.returnDate || new Date(loan.returnDate) >= today
      );
  };

  // Redirección si no hay usuario
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Carga inicial de datos
  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [booksData, loansData] = await Promise.all([
          getBooks(),
          getMyLoans(),
        ]);

        console.log("LIBROS DESDE EL BACKEND:", booksData);

        setBooks(booksData);
        
        // Guardamos SOLO préstamos activos
        const today = new Date();

        const activeLoans = loansData
          .map(addDueDate)
          .filter(loan =>
            !loan.returnDate || new Date(loan.returnDate) >= today
        );

        setBorrowedBooks(activeLoans);
        // ===========================================
        // NUEVO: Set con los ISBN de libros prestados
        // ===========================================
        setBorrowedIsbns(new Set(activeLoans.map(b => b.isbn)));

      } catch (error) {
        console.error("Error al obtener los datos de libros: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.userId]);

  // Bloquear scroll cuando el PDF modal está abierto
  useEffect(() => {
    document.body.style.overflow = showPdfModal ? "hidden" : "auto";
  }, [showPdfModal]);

  // ---------------------------
  //      BORROW BOOK
  // ---------------------------
  const handleBorrow = async (isbn: string) => {
    try {
      if (!currentUser) throw new Error("User not authenticated");

      // 🔵 Control de máximo 2 préstamos activos
      if (borrowedBooks.length >= 2) {
        showToast("Has alcanzado el máximo de 2 préstamos activos.");
        return;
      }

      // Crear préstamo
      await createLoan(isbn, currentUser.userId);

      // Mostrar PDF
      const fileData = await getBookFileByISBN(isbn);
      setPdfUrl(fileData.fileUrl);
      setShowPdfModal(true);

      // Actualizar préstamos
      const updatedLoans = await getMyLoans();
      const activeLoans = filterActiveLoans(updatedLoans);
      setBorrowedBooks(activeLoans);
      setBorrowedIsbns(new Set(activeLoans.map(b => b.isbn)));


      // Actualizar libros
      const updatedBooks = await getBooks();
      setBooks(updatedBooks);

      setSelectedBook(null);
    } catch (error) {
      console.error("Error préstamo libro: ", error);
    }
  };

  // ---------------------------
  //      RETURN BOOK
  // ---------------------------
  const handleReturn = async (isbn: string) => {
    if (!currentUser) return;

    try {
      const loan = borrowedBooks.find((l) => l.isbn === isbn);
      if (!loan) return;

      await returnLoan(loan.loanId);

      const updatedLoans = await getMyLoans();

      const activeLoans = filterActiveLoans(updatedLoans);
      setBorrowedBooks(activeLoans);
      setBorrowedIsbns(new Set(activeLoans.map(b => b.isbn)));

      const updatedBooks = await getBooks();
      setBooks(updatedBooks);


    } catch (error) {
      console.error("Error devuelto por libro: ", error);
    }
};


  // ---------------------------
  //      READ LATER
  // ---------------------------
  const handleReadLater = async (isbn: string) => {
    try {
      const book = await getBookByISBN(isbn);
      setDetailedBook(book);
      setSelectedBook(null);
    } catch (error) {
      console.error("Error al obtener el libro detallado: ", error);
    }
  };

  // ---------------------------
  //   READ LATER FROM BORROWED
  // ---------------------------
  const handleReadBorrowed = async (isbn: string) => {
    try {
      const fileData = await getBookFileByISBN(isbn);
      setPdfUrl(fileData.fileUrl);
      setShowPdfModal(true);
    } catch (error) {
      console.error("Error abriendo el PDF de un libro prestado:", error);
    }
  };

  const handleBackToDashboard = () => {
    setDetailedBook(null);
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.nameAuthor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.nameCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.subtopicCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <DashboardHeader
        borrowedCount={borrowedBooks.length}
        availableCount={filteredBooks.length}
        headerRef={headerRef}
        headerInView={headerInView}
      />

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {detailedBook && (
        <DetailedBookView
          book={detailedBook}
          onLoan={(isbn) => handleBorrow(isbn)}
          BACKEND_URL={BACKEND_URL}
          onBack={handleBackToDashboard}
        />
      )}

      {!detailedBook && borrowedBooks.length > 0 && (
        <BorrowedBooksSection
          books={books}
          borrowedBooks={borrowedBooks}
          handleReturn={(isbn) => handleReturn(isbn)}
          getDaysRemaining={getDaysRemaining}
          onRead={(isbn) => handleReadBorrowed(isbn)}
        />
      )}

      {!detailedBook && filteredBooks.length > 0 && (
        <AvailableBooksSection
          filteredBooks={filteredBooks}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          handleBorrow={handleBorrow}
          BACKEND_URL={BACKEND_URL}
          onReadLater={handleReadLater}
          borrowedIsbns={borrowedIsbns}   
        />
      )}

      {filteredBooks.length === 0 && borrowedBooks.length === 0 && (
        <EmptyState message="No books found matching your search." />
      )}

      {showPdfModal && pdfUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="relative w-full h-full md:w-11/12 md:h-5/6 bg-white rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPdfModal(false)}
              className="absolute top-4 right-4 z-50 bg-black/60 text-white px-3 py-1 rounded-lg"
            >
              Close
            </button>

            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full select-none pointer-events-auto"
              sandbox="allow-scripts allow-same-origin"
              style={{
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
              allow="fullscreen"
            ></iframe>
          </div>
        </div>
      )}

      {/* 🔵 Toast lugar donde se renderiza */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={hideToast} />
      )}
    </div>
  );
};

export default UserDashboard;
