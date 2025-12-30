export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}

// ======================= 
// OLD FRONTEND BOOK MODEL 
// =======================
// export interface Book {
//   id: string;
//   title: string;
//   author: string;
//   isbn: string;
//   imageUrl: string;
//   available: boolean;
//   description: string;
//   quantity: number;
//   availableQuantity: number;
// }

// ======================= 
// NEW BACKEND BOOK MODEL 
// =======================
export interface Book {
  isbn: string;
  title: string;
  language: string;
  bookCover: string;
  nameAuthor: string;
  nameCategory: string;
  subtopicCategory: string;
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