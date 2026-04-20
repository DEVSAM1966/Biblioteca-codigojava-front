import React, { useState } from "react";
import { X } from "lucide-react";
import { categoriesService, Category } from "../../services/categories.service";

interface Props {
  category: Category;
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteCategoryModal: React.FC<Props> = ({ category, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDelete = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await categoriesService.delete(category.categoryId);

      setSuccess("Categoría eliminada correctamente.");
      onDeleted();

      setTimeout(() => onClose(), 700);

    } catch {
      setError("Error al eliminar la categoría.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Eliminar Categoría
        </h2>

        <p className="mb-4">
          ¿Estás seguro de que deseas eliminar la categoría:
          <span className="font-semibold"> {category.nameCategory}</span>?
        </p>

        <p className="text-sm text-gray-600 mb-4">
          Esta acción no se puede deshacer.
        </p>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteCategoryModal;
