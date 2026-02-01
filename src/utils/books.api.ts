import { BACKEND_URL } from "../config";
import type { Book, DetailedBook, BookFileResponse } from "../types";

const API_URL = `${BACKEND_URL}/books/public`;

// Obtener todos los libros públicos
export const getBooks = async (): Promise<Book[]> => {
  const response = await fetch(API_URL);
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching books");
  }

  return result.data as Book[];
};

// Obtener libro detallado por ISBN
export const getBookByISBN = async (isbn: string): Promise<DetailedBook> => {
  const response = await fetch(`${API_URL}/isbn/${isbn}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching detailed book by ISBN");
  }

  return result.data as DetailedBook;
};

// Obtener archivo PDF por ISBN
export const getBookFileByISBN = async (isbn: string): Promise<BookFileResponse> => {
  const response = await fetch(`${API_URL}/file/${isbn}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching book file by ISBN");
  }

  return result.data as BookFileResponse;
};


