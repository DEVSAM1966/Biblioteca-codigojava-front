import React from "react";
import { X } from "lucide-react";
import { Book } from "../../services/books.service";

interface Props {
  book: Book;
  onClose: () => void;
}

const BookViewModal: React.FC<Props> = ({ book, onClose }) => {
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
          Detalles del libro — {book.isbn}
        </h2>

        <div className="space-y-3">

          <div>
            <span className="font-medium text-gray-700">Título:</span>
            <p className="text-gray-900">{book.title}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Resumen:</span>
            <p className="text-gray-900 whitespace-pre-line">{book.summary}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Páginas:</span>
            <p className="text-gray-900">{book.pages}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Fecha edición:</span>
            <p className="text-gray-900">
              {book.editionDate?.substring(0, 10)}
            </p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Idioma:</span>
            <p className="text-gray-900">{book.language}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Autor:</span>
            <p className="text-gray-900">{book.authors}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">ID Autor:</span>
            <p className="text-gray-900">{book.authorId}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">ID Editorial:</span>
            <p className="text-gray-900">{book.publisherId}</p>
          </div>

          <div>
            <span className="font-medium text-gray-700">ID Categoría:</span>
            <p className="text-gray-900">{book.categoryId}</p>
          </div>

          {/* Portada si existe */}
          {book.bookCover && (
            <div>
              <span className="font-medium text-gray-700">Portada:</span>
              <img
                src={`http://localhost:9800${book.bookCover}`}
                alt="Portada del libro"
                className="mt-2 w-40 rounded shadow"
              />
            </div>
          )}

          {/* Archivo del libro si existe */}
          {book.bookFile && (
            <div>
              <span className="font-medium text-gray-700">Archivo:</span>
              <a
                href={`http://localhost:9800${book.bookFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Descargar archivo
              </a>
            </div>
          )}

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookViewModal;
