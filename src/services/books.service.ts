import axios from "axios";
import { getAuthToken } from "../utils/auth.storage";

export interface Book {
  isbn: string;
  title: string;
  pages: number;
  summary: string;
  editionDate: string;
  bookCover: string | null;
  bookFile: string | null;
  language: string;
  authorId: number;
  authors: string;
  publisherId: number;
  categoryId: number;
}

const BASE_URL = "http://localhost:9800/books";

export const booksService = {

  // 🔵 Obtener todos los libros
  async getAll(): Promise<Book[]> {
    const res = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return res.data.data;
  },

  // 🔵 Obtener un libro por ISBN
  async getByIsbn(isbn: string): Promise<Book> {
    const res = await axios.get(`${BASE_URL}/isbn/${isbn}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return res.data.data;
  },

  // 🔵 Buscar libros por título
  async searchByTitle(title: string): Promise<Book[]> {
    const res = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return res.data.data;
  },

  // 🔵 Crear un libro (sin ficheros)
  async create(book: Partial<Book>): Promise<Book> {
    const res = await axios.post(`${BASE_URL}`, book, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return res.data.data;
  },

  // 🔵 Actualizar metadatos de un libro (sin ficheros)
  async update(isbn: string, book: Partial<Book>): Promise<Book> {
    const res = await axios.put(`${BASE_URL}/isbn/${isbn}`, book, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return res.data.data;
  },

  // 🔵 Borrar un libro
  async remove(isbn: string): Promise<void> {
    await axios.delete(`${BASE_URL}/isbn/${isbn}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
  },

  // 🔵 Subir portada y/o fichero del libro
  async uploadFiles(isbn: string, cover?: File, file?: File): Promise<any> {
    const formData = new FormData();

    if (cover) formData.append("bookCover", cover);
    if (file) formData.append("bookFile", file);

    const res = await axios.put(`${BASE_URL}/${isbn}/files`, formData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  }

};
