import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Author {
  authorId: number;
  nameAuthor: string;
}

interface Props {
  author: Author | null;
  onClose: () => void;
  onUpdate: (id: number, nameAuthor: string) => void;
}

const AuthorEditModal: React.FC<Props> = ({ author, onClose, onUpdate }) => {
  const [nameAuthor, setNameAuthor] = useState("");
  const [error, setError] = useState("");

  // Cargar datos del autor al abrir el modal
  useEffect(() => {
    if (author) {
      setNameAuthor(author.nameAuthor);
    }
  }, [author]);

  if (!author) return null;

  const handleSubmit = () => {
    if (!nameAuthor.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    onUpdate(author.authorId, nameAuthor.trim());
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

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Editar autor
        </h2>

        <div className="space-y-3">
          <label className="block">
            <span className="text-gray-700 font-medium">Nombre del autor</span>
            <input
              type="text"
              value={nameAuthor}
              onChange={(e) => setNameAuthor(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorEditModal;
