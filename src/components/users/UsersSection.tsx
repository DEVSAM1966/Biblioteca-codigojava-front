import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Search, Ban } from "lucide-react";
import { User, usersService } from "../../services/users.service";
import ViewUserModal from "./ViewUserModal";
import DropUserModal from "./DropUserModal";
import DeleteUserModal from "./DeleteUserModal";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import { getCurrentUser } from "../../utils/auth.storage";

const UsersSection: React.FC = () => {
  // 1. Estados principales
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [viewUserId, setViewUserId] = useState<number | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [dropUser, setDropUser] = useState<User | null>(null);

  // Rol del usuario autenticado
  const currentUser = getCurrentUser();
  const isSupport = currentUser?.role === "SUPPORT";

  // Estados para ordenación especiales por rol y fecha creación
  const [sortField, setSortField] = useState<"registrationDate" | "fullname" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  // 2. Modales
  // Cargar todos los usuarios
  const loadUsers = async () => {
    try {
      const data = await usersService.getAll();
      setUsers(data);
      setError("");
      setCurrentPage(1); // reset paginación
    } catch {
      setError("Error cargando usuarios");
    }
  };

  // Función generica de ordenamiento
  // Orden genérico
  const sortBy = (
    field: "role" | "registrationDate" | "fullname",
    direction: "asc" | "desc"
  ) => {
    const sorted = [...users].sort((a, b) => {
      let valueA: any = a[field];
      let valueB: any = b[field];

      if (field === "registrationDate") {
        valueA = new Date(a.registrationDate).getTime();
        valueB = new Date(b.registrationDate).getTime();
      }

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sorted);
  };


  // Función Botón. A - ordenar por rol y ordenar por fecha creación
  const [toggleA, setToggleA] = useState<0 | 1>(0);

  const handleSortA = () => {
    if (toggleA === 0) {
      sortBy("role", "asc");
      setToggleA(1);
    } else {
      sortBy("registrationDate", "asc");
      setToggleA(0);
    }
  };


  // Función Botón. B -ordenar por fecha creación y ordenar por nombre completo.
  const [toggleB, setToggleB] = useState<0 | 1>(0);

  const handleSortFechaNombre = () => {
    if (toggleB === 0) {
      sortBy("registrationDate", "asc");
      setToggleB(1);
    } else {
      sortBy("fullname", "asc");
      setToggleB(0);
    }
  };

  // 3. useEffect . cargar usuarios.
  useEffect(() => {
    loadUsers();
  }, []);

  // 4. Funciones principales
  // Búsqueda inteligente
  const handleSearch = async () => {
    const term = search.trim().toLowerCase();

    if (!term) {
        loadUsers();
        return;
    }

    try {
        // Prefijo: user:ID
        if (term.startsWith("user:")) {
            const id = Number(term.replace("user:", ""));
            const user = await usersService.getById(id);
            setUsers(user ? [user] : []);
            setCurrentPage(1);
            return;
        }

        // Prefijo: email:
        if (term.startsWith("email:")) {
            const email = term.replace("email:", "");
            // (lo implementaremos cuando tengas endpoint)
        }

        // Prefijo: role:
        if (term.startsWith("role:")) {
            const role = term.replace("role:", "");
            // (lo implementaremos cuando tengas endpoint)
        }

        // Búsqueda normal (ID o nombre)
        if (/^\d+$/.test(term)) {
            const user = await usersService.getById(Number(term));
            setUsers(user ? [user] : []);
            setCurrentPage(1);
            return;
        }

        const result = await usersService.getByName(term);
        if (Array.isArray(result)) {
          setUsers(result);
          setCurrentPage(1);
          return;
        }

        if (result) {
          setUsers([result]);
          setCurrentPage(1);
          return;
        }

        setUsers([]);
        setCurrentPage(1);

    } catch {
        setUsers([]);
        setError("Usuario no encontrado");
    }
 };

return (
  <div className="p-6 max-w-6xl mx-auto text-sm">
    {/* Título + barra de búsqueda en la misma línea */}
    <div className="flex justify-between items-center mb-4 flex-wrap">
      <h1 className="text-xl font-semibold m-0">Usuarios</h1>

      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por ID o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-64"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Buscar
        </button>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Nuevo usuario
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSortA}
          className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Ordenar Rol / Fecha
        </button>

        <button
          onClick={handleSortFechaNombre}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Ordenar Fecha creación
        </button>
      </div>
    </div>

    {/* Errores */}
    {error && (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
        {error}
        <button
          onClick={loadUsers}
          className="ml-4 underline text-blue-700"
        >
          Recargar
        </button>
      </div>
    )}

    {/* Tabla */}
    <div className="overflow-x-auto">
      <table className="w-full bg-white border text-sm">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b w-20 font-normal text-left">Id</th>
            <th className="py-2 px-4 border-b w-64 font-normal text-left">Nombre completo</th>
            <th className="py-2 px-4 border-b w-28 font-normal text-left">F. Alta</th>
            <th className="py-2 px-4 border-b w-32 font-normal text-left">Rol</th>
            <th className="py-2 px-4 border-b w-48 font-normal text-left">Borrado lógico</th>
            <th className="py-2 px-4 border-b w-48 font-normal text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user.userId}
              className={`hover:bg-gray-100 ${user.userDrop ? "opacity-50" : ""}`}
              >
              <td className="py-2 px-4 border-b">{user.userId}</td>
              <td className="py-2 px-4 border-b">
                {user.fullname.length > 60
                  ? user.fullname.slice(0, 60) + "…"
                  : user.fullname}
              </td>
              <td className="py-2 px-4 border-b">
                {user.registrationDate
                    ? user.registrationDate.slice(0, 10)
                    : ""}
              </td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                {user.userDrop ? "Sí" : "No"}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => setViewUserId(user.userId)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    console.log("USER EN TABLA:", user);
                    setEditUserId(user.userId)}}
                  className="text-green-600 hover:text-green-800 mr-2"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => !isSupport && setDeleteUser(user)}
                  disabled={isSupport}
                  className={`mr-2 ${
                      isSupport
                        ? "text-red-400 cursor-not-allowed"
                        : "text-red-600 hover:text-red-800"
                    }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDropUser(user)} 
                  className="text-yellow-600 hover:text-yellow-800 mr-2"
                >
                  <Ban className="w-4 h-4" />
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Paginación */}
    {totalPages > 1 && (
      <div className="flex justify-end mt-4 items-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded ${
              currentPage === num ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    )}

    {/* Modales */}
    {viewUserId && (
        <ViewUserModal
            userId={viewUserId}
            onClose={() => setViewUserId(null)}
        />
    )}

    {dropUser && (
      <DropUserModal
        user={dropUser}
        onClose={() => setDropUser(null)}
        onDropped={loadUsers}
      />
    )}

    {deleteUser && (
      <DeleteUserModal
        user={deleteUser}
        onClose={() => setDeleteUser(null)}
        onDeleted={loadUsers}
      />
    )}

    {showCreate && (
      <CreateUserModal
        onClose={() => setShowCreate(false)}
        onCreated={loadUsers}
      />
    )}

    {editUserId !== null && (
      <EditUserModal
        userId={editUserId}
        onClose={() => setEditUserId(null)}
        onUpdated={loadUsers}
      />
    ) }


  </div>
);

};

export default UsersSection;
