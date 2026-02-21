import React, { useState } from "react";
import { X } from "lucide-react";
import { Book } from "../../services/books.service";

interface Props {
  book: Book;
  onClose: () => void;
  onUpload: (isbn: string, cover?: File, file?: File) => void;
}

const BookFilesModal: React.FC<Props> = ({ book, onClose, onUpload }) => {
  const [coverFile, setCoverFile] = useState<File | undefined>();
  const [bookFile, setBookFile] = useState<File | undefined>();
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!coverFile && !bookFile) {
      setError("Debes seleccionar al menos un fichero");
      return;
    }

    onUpload(book.isbn, coverFile, bookFile);
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
          Subir ficheros — {book.isbn}
        </h2>

        <div className="space-y-4">

          {/* Portada actual */}
          {book.bookCover && (
            <div>
              <span className="font-medium text-gray-700">Portada actual:</span>
              <img
                src={`http://localhost:9800${book.bookCover}`}
                alt="Portada actual"
                className="mt-2 w-40 rounded shadow"
              />
            </div>
          )}

          {/* Archivo actual */}
          {book.bookFile && (
            <div>
              <span className="font-medium text-gray-700">Archivo actual:</span>
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

          {/* Subir nueva portada */}
          <label className="block">
            <span className="text-gray-700 font-medium">Nueva portada</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setCoverFile(e.target.files?.[0])}
              className="mt-1 w-full"
            />
          </label>

          {/* Subir nuevo archivo del libro */}
          <label className="block">
            <span className="text-gray-700 font-medium">Nuevo archivo del libro</span>
            <input
              type="file"
              accept="application/pdf,application/epub+zip"
              onChange={(e) => setBookFile(e.target.files?.[0])}
              className="mt-1 w-full"
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Subir ficheros
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookFilesModal;
