import { BACKEND_URL } from "../config";
import type { Book, DetailedBook, BookFileResponse } from "../types";
import { getAuthToken } from "../utils/auth.storage";


const API_URL = `${BACKEND_URL}/books/private`;

// Obtener todos los libros públicos
export const getBooks = async (): Promise<Book[]> => {
  // Obtenemos el token guardado en localStorage
  const token = getAuthToken();

  // Realizamos la petición con el token en el header Authorization
  const response = await fetch(API_URL, { 
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` 
    } 
  });

  // Parseamos la respuesta JSON
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching books");
  }

  return result.data as Book[];
};

// Obtener libro detallado por ISBN
export const getBookByISBN = async (isbn: string): Promise<DetailedBook> => {
  // Obtenemos el token guardado en localStorage
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/isbn/${isbn}`, { 
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` 
    } 
  });

  // Parseamos la respuesta JSON
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching detailed book by ISBN");
  }

  return result.data as DetailedBook;
};

// Obtener archivo PDF por ISBN
export const getBookFileByISBN = async (isbn: string): Promise<BookFileResponse> => {
  // Obtenemos el token guardado en localStorage
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/file/${isbn}`, { 
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` 
    } 
  });

  // Parseamos la respuesta JSON
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching book file by ISBN");
  }

  return result.data as BookFileResponse;
};


