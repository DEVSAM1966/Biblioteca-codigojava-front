import { DetailedBook, BookFileResponse } from "../types";

const API_URL = "http://localhost:9800/books/public";

export const getBooks = async (): Promise<Book[]> => {
  const response = await fetch(API_URL);
  const result = await response.json();
  if (!response.ok) throw new Error("Error fetching books");
  return result.data;
};


export const getBookByISBN = async (isbn: string): Promise<DetailedBook> => {
  const response = await fetch(`${API_URL}/isbn/${isbn}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching detailed book by ISBN");
  }

  return result.data;
};

export const getBookFileByISBN = async (isbn: string): Promise<BookFileResponse> => {
  const response = await fetch(`${API_URL}/file/${isbn}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching book file by ISBN");
  }

  // El backend envía: { data: { fileUrl: "http://..." }, timestamp: "..." }
  return result.data as BookFileResponse;
};

