import React from "react";
import { X, Trash2 } from "lucide-react";

interface Props {
  isbn: string;
  title: string;
  onClose: () => void;
  onDelete: (isbn: string) => void;
}

const BookDeleteModal: React.FC<Props> = ({ isbn, title, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete(isbn);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Eliminar libro
          </h2>
        </div>

        <p className="text-gray-700 mb-6">
          ¿Seguro que deseas eliminar el libro <span className="font-semibold">"{title}"</span>  
          con ISBN <span className="font-semibold">{isbn}</span>?  
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookDeleteModal;
