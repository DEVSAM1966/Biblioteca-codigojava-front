import React from "react";
import { X, Trash2 } from "lucide-react";

interface Props {
  authorName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const AuthorDeleteModal: React.FC<Props> = ({ authorName, onClose, onConfirm }) => {
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

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Confirmar eliminación
        </h2>

        <p className="text-gray-700">
          ¿Seguro que deseas eliminar al autor{" "}
          <span className="font-semibold">{authorName}</span>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorDeleteModal;
