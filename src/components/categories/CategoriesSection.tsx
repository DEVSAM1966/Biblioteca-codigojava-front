import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { categoriesService, Category } from "../../services/categories.service";

import { getCurrentUser } from "../../utils/auth.storage";
import ViewCategoryModal from "./ViewCategoryModal";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Modales (se implementarán en pasos posteriores)
  const [viewCategory, setViewCategory] = useState<Category | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [createCategory, setCreateCategory] = useState<boolean>(false);

  // Roles
  const currentUser = getCurrentUser();
  const isSupport = currentUser?.role === "SUPPORT";
  const isAdmin = currentUser?.role === "ADMIN";

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch {
      setCategories([]);
      setError("No se pudieron cargar las categorías");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Búsqueda inteligente
  const handleSearch = async () => {
    const term = search.trim().toLowerCase();

    if (!term) {
      loadCategories();
      return;
    }

    try {
      // Buscar por ID
      if (/^\d+$/.test(term)) {
        const result = await categoriesService.getById(Number(term));
        setCategories(result ? [result] : []);
        setCurrentPage(1);
        return;
      }

      // Buscar por nombre parcial
      const result = await categoriesService.getByName(term);
      setCategories(result);
      setCurrentPage(1);

    } catch {
      setCategories([]);
      setError("Categoría no encontrada");
    }
  };

  // Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Gestión de Categorías</h1>

      {/* Buscador */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por ID o nombre..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buscar
        </button>

        <button
          onClick={() => setCreateCategory(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      {/* Tabla */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Subtema</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {currentCategories.map((c) => (
            <tr key={c.categoryId} className="border-b">
              <td className="p-2">{c.categoryId}</td>
              <td className="p-2">{c.nameCategory}</td>
              <td className="p-2">{c.subtopicCategory || "-"}</td>

              <td className="p-2 flex gap-3">

                {/* Ver */}
                <Eye
                  className="h-5 w-5 text-blue-600 cursor-pointer"
                  onClick={() => setViewCategory(c)}
                />

                {/* Editar */}
                <Pencil
                  className="h-5 w-5 text-yellow-600 cursor-pointer"
                  onClick={() => setEditCategory(c)}
                />

                {/* Borrar (solo ADMIN) */}
                <button
                  onClick={() => isAdmin && setDeleteCategory(c)}
                  disabled={!isAdmin}
                  className={`${
                    isAdmin
                      ? "text-red-600 hover:text-red-800"
                      : "text-red-400 cursor-not-allowed"
                  }`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 mt-3">{error}</p>}

    {/* 🔵 NUEVO — Modales */}

      {viewCategory && (
        <ViewCategoryModal
          category={viewCategory}
          onClose={() => setViewCategory(null)}
        />
      )}

      {createCategory && (
        <CreateCategoryModal
          onClose={() => setCreateCategory(false)}
          onCreated={loadCategories}
        />
      )}

      {editCategory && (
        <EditCategoryModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onUpdated={loadCategories}
        />
      )}

      {deleteCategory && (
        <DeleteCategoryModal
          category={deleteCategory}
          onClose={() => setDeleteCategory(null)}
          onDeleted={loadCategories}
        />
      )}
    </div>
  );
};

export default CategoriesSection;
