export interface User {
  userId: number;                       // ID del usuario
  fullname: string;                     // Nombre completo del usuario  
  registrationDate: string;             // Fecha de registro del usuario (YYYY-MM-DD)
  role: 'ADMIN' | 'SUPPORT' | 'USER';   // Rol del usuario (ADMIN, SUPPORT o USER)
  userDrop: boolean;                    // Indica si el usuario ha sido dado de baja (true) o no (false)
}


// ============================ 
// NEW BACKEND BOOK LIGHT MODEL 
// ============================
export interface Book {
  isbn: string;                       // ISBN del libro
  title: string;                      // Título del libro
  language: string;                   // Idioma del libro
  bookCover: string;                  // URL de la portada del libro
  nameAuthor: string;                 // Nombre del autor del libro
  nameCategory: string;               // Nombre de la categoría del libro
  subtopicCategory: string;           // Subtema de la categoría del libro  
}

// ============================ 
// NEW BACKEND BOOK HIGH MODEL 
// ============================
export interface DetailedBook {
  isbn: string;                       // ISBN del libro
  title: string;                      // Título del libro
  pages: number | null;               // Número de páginas del libro (puede ser null si no se conoce) 
  summary: string | null;             // Resumen del libro (puede ser null si no se conoce)
  editionDate: string | null;         // Fecha de edición del libro (puede ser null si no se conoce) 
  bookCover: string | null;           // URL de la portada del libro (puede ser null si no se conoce)
  language: string | null;            // Idioma del libro (puede ser null si no se conoce)
  nameAuthor: string | null;          // Nombre del autor del libro (puede ser null si no se conoce)
  authors: string | null;             // Autores del libro (puede ser null si no se conoce)
  nameCategory: string | null;        // Nombre de la categoría del libro (puede ser null si no se conoce)
  subtopicCategory: string | null;    // Subtema de la categoría del libro (puede ser null si no se conoce)
  namePublisher: string | null;       // Nombre del editor del libro (puede ser null si no se conoce)
}

// ========================
// FIND FILE BOOK MODEL
// ========================
export interface BookFileResponse {
  fileUrl: string;        // URL del archivo del libro
}

// ========================
// NEW BACKEND AUTHOR MODEL
// ========================
export interface Author {
  authorId: number;        // ID del autor
  nameAuthor: string;      // Nombre del autor  
}


// ============================
// BACKEND LOAN RAW MODEL
// ============================
export interface LoanBackend {
  loanId: number;               // ID del préstamo
  loanDate: string | null;      // Fecha del préstamo
  returnDate: string | null;    // Fecha de devolución
  userId: number | null;        // ID del usuario
  isbn: string | null;          // ISBN del libro
}

// ============================
// FRONTEND ACTIVE LOAN MODEL
// ============================
export interface ActiveLoan {
  loanId: number;        // ID del préstamo
  loanDate: string;      // Fecha del préstamo (YYYY-MM-DD)
  returnDate?: string;   // Fecha de devolución (opcional)
  isbn: string;          // ISBN del libro
  userId: number;        // ID del usuario

  // Campo calculado en frontend 
  dueDate?: string;
}

// ===========================
// NEW BACKEND PUBLISHER MODEL
// ===========================
export interface Publisher {
        publisherId: number;        // ID del editor
        namePublisher: string;      // Nombre del editor
        address: string | null;     // Dirección del editor
        city: string | null;        // Ciudad del editor
        province: string | null;    // Provincia del editor
        postalCode: string | null;  // Código postal del editor
        country: string | null;     // País del editor
        phone: string | null;       // Teléfono del editor
        notes: string | null;       // Notas del editor
}
