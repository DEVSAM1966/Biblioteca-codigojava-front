import React, { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onCreate: (bookData: {
    isbn: string;
    title: string;
    summary: string;
    pages: number;
    editionDate: string;
    language: string;
    authorId: number;
    publisherId: number;
    categoryId: number;
  }) => void;
}

const BookCreateModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [pages, setPages] = useState("");
  const [editionDate, setEditionDate] = useState("");
  const [language, setLanguage] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!isbn.trim() || !title.trim()) {
      setError("ISBN y título son obligatorios");
      return;
    }

    onCreate({
      isbn: isbn.trim(),
      title: title.trim(),
      summary: summary.trim(),
      pages: Number(pages),
      editionDate,
      language: language.trim(),
      authorId: Number(authorId),
      publisherId: Number(publisherId),
      categoryId: Number(categoryId),
    });

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
          Nuevo libro
        </h2>

        <div className="space-y-3">

          <label className="block">
            <span className="text-gray-700 font-medium">ISBN</span>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="9780000000001"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Título</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="Fundación"
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
              placeholder="Español"
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
            Crear libro
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookCreateModal;
