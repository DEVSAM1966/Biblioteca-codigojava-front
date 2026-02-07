import React, { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onCreate: (nameAuthor: string) => void;
}

const AuthorCreateModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [nameAuthor, setNameAuthor] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!nameAuthor.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    onCreate(nameAuthor.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Nuevo autor
        </h2>

        <div className="space-y-3">
          <label className="block">
            <span className="text-gray-700 font-medium">Nombre del autor</span>
            <input
              type="text"
              value={nameAuthor}
              onChange={(e) => setNameAuthor(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Frank Herbert"
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
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorCreateModal;
