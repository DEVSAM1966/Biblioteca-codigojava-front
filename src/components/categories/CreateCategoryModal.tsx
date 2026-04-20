import React, { useState } from "react";
import { X } from "lucide-react";
import { categoriesService } from "../../services/categories.service";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CreateCategoryModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [nameCategory, setNameCategory] = useState("");
  const [subtopicCategory, setSubtopicCategory] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async () => {
    setError("");
    setSuccess("");

    if (nameCategory.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    setSaving(true);

    try {
      await categoriesService.create({
        nameCategory,
        subtopicCategory: subtopicCategory || null,
      });

      setSuccess("Categoría creada correctamente.");
      onCreated();

      setTimeout(() => onClose(), 700);

    } catch {
      setError("Error al crear la categoría.");
    } finally {
      setSaving(false);
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

        <h2 className="text-xl font-semibold mb-4">Crear Categoría</h2>

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
            onClick={handleCreate}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Crear"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateCategoryModal;
