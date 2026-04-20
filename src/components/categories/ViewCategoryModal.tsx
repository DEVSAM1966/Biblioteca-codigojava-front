import React from "react";
import { X } from "lucide-react";
import { Category } from "../../services/categories.service";

interface Props {
  category: Category;
  onClose: () => void;
}

const ViewCategoryModal: React.FC<Props> = ({ category, onClose }) => {
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

        <h2 className="text-xl font-semibold mb-4">Detalles de la Categoría</h2>

        <div className="flex flex-col gap-3">

          <div>
            <p className="text-sm text-gray-500">ID</p>
            <p className="font-medium">{category.categoryId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-medium">{category.nameCategory}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Subtema</p>
            <p className="font-medium">
              {category.subtopicCategory || "—"}
            </p>
          </div>

        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewCategoryModal;
