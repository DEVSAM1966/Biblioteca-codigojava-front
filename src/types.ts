export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}

// ============================ 
// NEW BACKEND BOOK LIGHT MODEL 
// ============================
export interface Book {
  isbn: string;
  title: string;
  language: string;
  bookCover: string;
  nameAuthor: string;
  nameCategory: string;
  subtopicCategory: string;
}

// ============================ 
// NEW BACKEND BOOK HIGH MODEL 
// ============================
export interface DetailedBook {
  isbn: string;
  title: string;
  pages: number | null;
  summary: string | null;
  editionDate: string | null;
  bookCover: string | null;
  language: string | null;
  nameAuthor: string | null;
  authors: string | null; 
  nameCategory: string | null;
  subtopicCategory: string | null;
  namePublisher: string | null;
}

// ========================
// FIND FILE BOOK MODEL
// ========================
export interface BookFileResponse {
  fileUrl: string;
}

// ========================
// NEW BACKEND AUTHOR MODEL
// ========================
export interface Author {
  authorId: number; 
  nameAuthor: string; 
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
}

export interface BorrowedBookDetails extends BorrowRecord {
  book: Book;
  user: User;
}