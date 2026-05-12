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
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/file/${isbn}`, { 
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` 
    } 
  });

  const result = await response.json();

  // console.log("📘 [DEBUG] Respuesta cruda del backend:", result);
  // console.log("📘 [DEBUG] Tipo de result:", typeof result);
  // console.log("📘 [DEBUG] result.data:", result?.data);
  // console.log("📘 [DEBUG] result.fileUrl:", result?.fileUrl);

  if (!response.ok) {
    throw new Error("Error fetching book file by ISBN");
  }

  // 🟦 SPRING BOOT → { data: { bookFile: "uploads/file/..." } }
  if (result?.data?.bookFile) {
    // console.log("📘 [DEBUG] Detectado formato Spring Boot (data.bookFile)");
    return {
      fileUrl: `${BACKEND_URL}/${result.data.bookFile}`
    };
  }

  // 🔵 NODE.JS → { data: { fileUrl: "http://..." } }
  if (result?.data?.fileUrl) {
    // console.log("📘 [DEBUG] Detectado formato Node.js (data.fileUrl)");
    return {
      fileUrl: result.data.fileUrl   // ya viene ABSOLUTA
    };
  }

  // 🔵 NODE.JS → { fileUrl: "uploads/file/..." }
  if (result?.fileUrl) {
    // console.log("📘 [DEBUG] Detectado formato Node.js (fileUrl)");
    return {
      fileUrl: `${BACKEND_URL}/${result.fileUrl}`
    };
  }

  // 🔵 NODE.JS → { data: "uploads/file/..." }
  if (typeof result?.data === "string") {
    // console.log("📘 [DEBUG] Detectado formato Node.js (data string)");
    return {
      fileUrl: `${BACKEND_URL}/${result.data}`
    };
  }

  // 🔵 NODE.JS → "uploads/file/..."
  if (typeof result === "string") {
    // console.log("📘 [DEBUG] Detectado formato Node.js (string directo)");
    return {
      fileUrl: `${BACKEND_URL}/${result}`
    };
  }

  // console.error("🟥 [ERROR] Formato desconocido:", result);
  throw new Error("Formato de respuesta desconocido en getBookFileByISBN");
};





