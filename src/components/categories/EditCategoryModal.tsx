import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { categoriesService, Category } from "../../services/categories.service";

interface Props {
  category: Category;
  onClose: () => void;
  onUpdated: () => void;
}

const EditCategoryModal: React.FC<Props> = ({ category, onClose, onUpdated }) => {
  const [nameCategory, setNameCategory] = useState("");
  const [subtopicCategory, setSubtopicCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    if (category) {
      setNameCategory(category.nameCategory || "");
      setSubtopicCategory(category.subtopicCategory || "");
      setLoading(false);
    }
  }, [category]);

  const handleUpdate = async () => {
    setError("");
    setSuccess("");

    if (nameCategory.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    setSaving(true);

    try {
      await categoriesService.update(category.categoryId, {
        nameCategory,
        subtopicCategory: subtopicCategory || null,
      });

      setSuccess("Categoría actualizada correctamente.");
      onUpdated();

      setTimeout(() => onClose(), 700);

    } catch {
      setError("Error al actualizar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
          Cargando datos...
        </div>
      </div>
    );
  }

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

        <h2 className="text-xl font-semibold mb-4">Editar Categoría</h2>

        <div className="flex flex-col gap-3">

          <input
            type="text"
            placeholder="Nombre de la categoría"
            className="border px-3 py-2 rounded"
            value={nameCategory}
            onChange={(e) => setNameCategory(e.target.value)}
          />

          <input
            type="text"
            placeholder="Subtema (opcional)"
            className="border px-3 py-2 rounded"
            value={subtopicCategory}
            onChange={(e) => setSubtopicCategory(e.target.value)}
          />

        </div>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-3">{success}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditCategoryModal;
