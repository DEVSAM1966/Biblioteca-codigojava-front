// src/components/authors/AuthorsSection.tsx

import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import AuthorViewModal from "./AuthorViewModal";
import AuthorCreateModal from "./AuthorCreateModal";
import AuthorEditModal from "./AuthorEditModal";
import AuthorDeleteModal from "./AuthorDeleteModal";
import { authorsService } from "../../services/authors.service";


interface Author {
  authorId: number;
  nameAuthor: string;
}

const ITEMS_PER_PAGE = 10;

// 🔵 Datos mock
// const MOCK_AUTHORS: Author[] = [
//   { authorId: 1, nameAuthor: "Frank Herbert" },
//   { authorId: 2, nameAuthor: "Isaac Asimov" },
//   { authorId: 3, nameAuthor: "Ursula K. Le Guin" },
//   { authorId: 4, nameAuthor: "Arthur C. Clarke" },
//   { authorId: 5, nameAuthor: "Philip K. Dick" },
//   { authorId: 6, nameAuthor: "Ray Bradbury" },
//   { authorId: 7, nameAuthor: "J. R. R. Tolkien" },
//   { authorId: 8, nameAuthor: "C. S. Lewis" },
//   { authorId: 9, nameAuthor: "Neil Gaiman" },
//   { authorId: 10, nameAuthor: "Terry Pratchett" },
//   { authorId: 11, nameAuthor: "Brandon Sanderson" },
// ];

const AuthorsSection: React.FC = () => {
  // 🔵 Estado inicial vacío (ya no usamos MOCK_AUTHORS)
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔵 Estado de búsqueda
  const [search, setSearch] = useState("");

  // 🔵 Paginación basada en filtrados
  const [currentPage, setCurrentPage] = useState(1);
  
  // 🔵 Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [editAuthor, setEditAuthor] = useState<Author | null>(null);
  const [deleteAuthor, setDeleteAuthor] = useState<Author | null>(null);

  // 🔵 Cargar autores reales desde backend
  useEffect(() => {
    const loadAuthors = async () => {
        try {
        setLoading(true);
        const data = await authorsService.getAll();

        // console.log("🔍 Backend devolvió:", data);

        setAuthors(data);
        } catch (err) {
            setError("No se pudieron cargar los autores");
        } finally {
            setLoading(false);
     }
    };

    loadAuthors();
  }, []);

  // 🔵 Mostrar estados de carga o error 
  if (loading) return <div>Cargando autores...</div>; 
  if (error) return <div className="text-red-600">{error}</div>; 

  // 🔵 Filtrado en tiempo real con los datos que exista en frontend
  // const filteredAuthors = authors.filter((a) =>
  //  a.nameAuthor.toLowerCase().includes(search.toLowerCase())
  //);

  const totalPages = Math.max(1, Math.ceil(authors.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = authors.slice(startIndex, startIndex + ITEMS_PER_PAGE);


  // 🔵 Funciones de paginación
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // 🔵 Crear autor
  const handleCreateAuthor = async (nameAuthor: string) => {
    try { 
      const created = await authorsService.create(nameAuthor); 
      setAuthors((prev) => [...prev, created]); 
    } catch (err) { 
      setError("No autorizado o error al crear autor"); 
    }
  };

  // 🔵 Editar autor
  const handleUpdateAuthor = async (id: number, nameAuthor: string) => {
    try {
      const updated = await authorsService.update(id, nameAuthor);

      setAuthors((prev) =>
        prev.map((a) => (a.authorId === id ? updated : a))
      );
    } catch (err) {
      setError("No autorizado o error al actualizar autor");
    }
  };

  // 🔵 Borrar autor
  const handleDeleteAuthor = async (id: number) => {
    try {
      await authorsService.remove(id);
      setAuthors((prev) => prev.filter((a) => a.authorId !== id));
    } catch (err) {
      setError("No autorizado o error al eliminar autor");
    }
  };


  return (
    <div className="space-y-4">
      {/* 🔵 HEADER + búsqueda + botón nuevo */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Autores</h2>

        <div className="flex items-center gap-3">
          {/* 🔵 Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar autor..."
            value={search}
            onChange={async (e) => {
              const value = e.target.value;
              setSearch(value);
              setCurrentPage(1);

              try {
                if (value.trim() === "") {
                  // Input vacío → cargar todos
                  const all = await authorsService.getAll();
                  setAuthors(all);
                } else {
                  // Input con texto → buscar en backend
                  const results = await authorsService.searchByName(value);
                  setAuthors(results);
                }
              } catch (err) {
                setError("No autorizado o error al buscar autores");
              }
            }}
            className="px-3 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo autor</span>
          </button>
        </div>
      </div>

      {/* 🔵 TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                Nombre del autor
              </th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border-b">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((author) => (
              <tr key={author.authorId} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  {author.authorId}
                </td>

                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  {author.nameAuthor}
                </td>

                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="flex items-center justify-center gap-3">
                    {/* 🔵 Ver */}
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setSelectedAuthor(author)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* 🔵 Editar */}
                    <button
                      className="text-emerald-600 hover:text-emerald-800"
                      onClick={() => setEditAuthor(author)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* 🔵 Borrar */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setDeleteAuthor(author)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {currentItems.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-4 text-center text-sm text-gray-500"
                >
                  No hay autores para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔵 PAGINACIÓN */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Página {currentPage} de {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border text-sm ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border text-sm ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* 🔵 MODALES (siempre al final del componente) */}
      <AuthorViewModal
        author={selectedAuthor}
        onClose={() => setSelectedAuthor(null)}
      />

      {showCreateModal && (
        <AuthorCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAuthor}
        />
      )}

      {editAuthor && (
        <AuthorEditModal
          author={editAuthor}
          onClose={() => setEditAuthor(null)}
          onUpdate={handleUpdateAuthor}
        />
      )}

      {deleteAuthor && (
        <AuthorDeleteModal
          authorName={deleteAuthor.nameAuthor}
          onClose={() => setDeleteAuthor(null)}
          onConfirm={() => {
            handleDeleteAuthor(deleteAuthor.authorId);
            setDeleteAuthor(null);
          }}
        />
      )}
    </div>
  );
};

export default AuthorsSection;

