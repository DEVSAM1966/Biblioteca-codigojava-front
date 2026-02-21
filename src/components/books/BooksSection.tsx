import React, { useEffect, useState } from "react";
import { Search, Eye, Edit, Trash2, Upload } from "lucide-react";
import { booksService, Book } from "../../services/books.service";

import BookCreateModal from "./BookCreateModal";
import BookEditModal from "./BookEditModal";
import BookViewModal from "./BookViewModal";
import BookFilesModal from "./BookFilesModal";
import BookDeleteModal from "./BookDeleteModal";

const BooksSection: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Modales
  const [showCreate, setShowCreate] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [viewBook, setViewBook] = useState<Book | null>(null);
  const [filesBook, setFilesBook] = useState<Book | null>(null);
  const [deleteBook, setDeleteBook] = useState<Book | null>(null);

  // Paginación frontend
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBooks = books.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(books.length / itemsPerPage);

  // Cargar todos los libros
  const loadBooks = async () => {
    try {
      const data = await booksService.getAll();
      setBooks(data);
      setError("");
      setCurrentPage(1); // reset paginación
    } catch {
      setError("Error cargando libros");
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Búsqueda inteligente
  const handleSearch = async () => {
    const term = search.trim();

    if (!term) {
      loadBooks();
      return;
    }

    const isIsbn = /^\d{10}(\d{3})?$/.test(term);

    try {
      if (isIsbn) {
        const book = await booksService.getByIsbn(term);
        setBooks([book]);
      } else {
        const results = await booksService.searchByTitle(term);
        setBooks(results);
      }
      setError("");
      setCurrentPage(1);
    } catch {
      setError("No se encontraron resultados");
    }
  };

  // Crear libro
  const handleCreate = async (data: any) => {
    try {
      await booksService.create(data);
      loadBooks();
    } catch {
      setError("Error creando libro");
    }
  };

  // Editar libro
  const handleUpdate = async (isbn: string, data: Partial<Book>) => {
    try {
      await booksService.update(isbn, data);
      loadBooks();
    } catch {
      setError("Error actualizando libro");
    }
  };

  // Subir ficheros
  const handleUpload = async (isbn: string, cover?: File, file?: File) => {
    try {
      await booksService.uploadFiles(isbn, cover, file);
      loadBooks();
    } catch {
      setError("Error subiendo ficheros");
    }
  };

  // Borrar libro
  const handleDelete = async (isbn: string) => {
    try {
      await booksService.remove(isbn);
      loadBooks();
    } catch {
      setError("Error eliminando libro");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">Libros</h1>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por ISBN o título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-80"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Buscar
        </button>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Nuevo libro
        </button>
      </div>

      {/* Errores */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
          <button
            onClick={loadBooks}
            className="ml-4 underline text-blue-700"
          >
            Recargar
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">ISBN</th>
              <th className="p-2">Título</th>
              <th className="p-2">Idioma</th>
              <th className="p-2">Pag.</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((b) => (
              <tr key={b.isbn} className="border-b">
                <td className="p-2">{b.isbn}</td>
                <td className="p-2">{b.title}</td>
                <td className="p-2">{b.language}</td>
                <td className="p-2">{b.pages}</td>
                <td className="p-2 flex gap-3">

                  <Eye
                    className="h-5 w-5 text-blue-600 cursor-pointer"
                    onClick={() => setViewBook(b)}
                  />

                  <Edit
                    className="h-5 w-5 text-yellow-600 cursor-pointer"
                    onClick={() => setEditBook(b)}
                  />

                  <Upload
                    className="h-5 w-5 text-green-600 cursor-pointer"
                    onClick={() => setFilesBook(b)}
                  />

                  <Trash2
                    className="h-5 w-5 text-red-600 cursor-pointer"
                    onClick={() => setDeleteBook(b)}
                  />

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                currentPage === num ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>

        </div>
      )}

      {/* Modales */}
      {showCreate && (
        <BookCreateModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {editBook && (
        <BookEditModal
          book={editBook}
          onClose={() => setEditBook(null)}
          onUpdate={handleUpdate}
        />
      )}

      {viewBook && (
        <BookViewModal
          book={viewBook}
          onClose={() => setViewBook(null)}
        />
      )}

      {filesBook && (
        <BookFilesModal
          book={filesBook}
          onClose={() => setFilesBook(null)}
          onUpload={handleUpload}
        />
      )}

      {deleteBook && (
        <BookDeleteModal
          isbn={deleteBook.isbn}
          title={deleteBook.title}
          onClose={() => setDeleteBook(null)}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
};

export default BooksSection;

