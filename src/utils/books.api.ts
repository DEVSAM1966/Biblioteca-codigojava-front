const API_URL = "http://localhost:9800/books/public";

export const getBooks = async (): Promise<Book[]> => {
  const response = await fetch(API_URL);
  const result = await response.json();
  if (!response.ok) throw new Error("Error fetching books");
  return result.data;
};
