import React, { useState } from "react";
import { X } from "lucide-react";
import { Book } from "../../services/books.service";

interface Props {
  book: Book;
  onClose: () => void;
  onUpdate: (isbn: string, updatedData: Partial<Book>) => void;
}

const BookEditModal: React.FC<Props> = ({ book, onClose, onUpdate }) => {
  const [title, setTitle] = useState(book.title);
  const [summary, setSummary] = useState(book.summary);
  const [pages, setPages] = useState(String(book.pages));
  const [editionDate, setEditionDate] = useState(
    book.editionDate?.substring(0, 10)
  );
  const [language, setLanguage] = useState(book.language);
  const [authorId, setAuthorId] = useState(String(book.authorId));
  const [publisherId, setPublisherId] = useState(String(book.publisherId));
  const [categoryId, setCategoryId] = useState(String(book.categoryId));

  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    const updated: Partial<Book> = {
      title: title.trim(),
      summary: summary.trim(),
      pages: Number(pages),
      editionDate,
      language: language.trim(),
      authorId: Number(authorId),
      publisherId: Number(publisherId),
      categoryId: Number(categoryId),
    };

    onUpdate(book.isbn, updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Editar libro — {book.isbn}
        </h2>

        <div className="space-y-3">

          <label className="block">
            <span className="text-gray-700 font-medium">Título</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Resumen</span>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              rows={3}
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Páginas</span>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Fecha edición</span>
            <input
              type="date"
              value={editionDate}
              onChange={(e) => setEditionDate(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Idioma</span>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">ID Autor</span>
            <input
              type="number"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">ID Editorial</span>
            <input
              type="number"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">ID Categoría</span>
            <input
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookEditModal;

