import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { loansService, Loan, LoanCreateDto } from "../../services/loans.service";
import LoanViewModal  from "./LoanViewModal";
import LoanEditModal from "./LoanEditModal";
import LoanDeleteModal from "./LoanDeleteModal";
import LoanCreateModal from "./LoanCreateModal";
import { getCurrentUser } from "../../utils/auth.storage";

const LoansSection: React.FC = () => {

    // ============================
    // 🔵 ESTADOS PRINCIPALES
    // ============================
    const [loans, setLoans] = useState<Loan[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ============================
    // 🔵 MODALES 
    // ============================
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editLoan, setEditLoan] = useState<Loan | null>(null);
    const [deleteLoan, setDeleteLoan] = useState<Loan | null>(null);
    const [createLoanModal, setCreateLoanModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Rol del usuario autenticado
    const currentUser = getCurrentUser();
    const isSupport = currentUser?.role === "SUPPORT";

    // ============================
    // 🔵 PAGINACIÓN
    // ============================
    const [isSearching, setIsSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(loans.length / itemsPerPage);

    // ⭐ FUNCIONES QUE NECESITA <Pagination /> 
    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    //const indexOfLast = currentPage * itemsPerPage;
    //const indexOfFirst = indexOfLast - itemsPerPage;
    const currentLoans = isSearching
    ? loans              // ⭐ en búsqueda NO paginamos
    : loans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    // =====================================================
    // 🔵 RESET AUTOMATICO AL BORRAR EÑ INPUT DE LA BUSQUEDA
    // =====================================================
    useEffect(() => {
        if (searchTerm.trim() === "") {
            loansService.getAll().then(setLoans);
        }
    }, [searchTerm]);

    // ============================
    // 🔵 CARGAR PRÉSTAMOS
    // ============================
    useEffect(() => {
        const loadLoans = async () => {
            try {
                setLoading(true);
                const data = await loansService.getAll();
                setLoans(data);
            } catch (err) {
                console.error("Error al cargar préstamos:", err);
                setError("No se pudieron cargar los préstamos.");
            } finally {
                setLoading(false);
            }
        };

        loadLoans();
    }, []);

    // ============================
    // 🔵 MODIFICAR PRÉSTAMOS
    // ============================
    const handleUpdateLoan = async (id: number, returnDate: string | null) => {
        try {
            const updated = await loansService.update(id, returnDate);

            // Actualizar en frontend
            setLoans((prev) =>
                prev.map((l) =>
                    l.loanId === id ? { ...l, returnDate: updated.returnDate } : l
                )
            );

            setEditLoan(null);
        } catch (err) {
            console.error("Error actualizando préstamo:", err);
            alert("No se pudo actualizar el préstamo.");
        }
    };

    // ============================
    // 🔵 ELIMINAR PRÉSTAMOS
    // ============================
    const handleDeleteLoan = async (id: number) => {
        try {
            await loansService.remove(id);

            setLoans((prev) => prev.filter((l) => l.loanId !== id));

            setDeleteLoan(null);
        } catch (err) {
            console.error("Error eliminando préstamo:", err);
            alert("No se pudo eliminar el préstamo.");
        }
    };

    // ============================
    // 🔵 CREAR PRÉSTAMOS
    // ============================
    const handleCreateLoan = async (data: LoanCreateDto) => {
        try {
            const newLoan = await loansService.create(data);

            // Insertar el nuevo préstamo en la tabla sin recargar
            setLoans((prev) => [...prev, newLoan]);

            // Cerrar modal
            setShowCreateModal(false);

        } catch (error) {
            console.error("Error creando préstamo:", error);
            alert("No se pudo crear el préstamo.");
        }
    };

    // ============================
    // 🔵 BUSCAR PRÉSTAMOS
    // ============================
    const handleSearch = async () => {
      const term = searchTerm.trim().toLowerCase();

      // Reset si está vacío
      if (term === "") {
        const all = await loansService.getAll();
        setLoans(all);
        setCurrentPage(1);
        setIsSearching(false);
        return;
      }

      // ============================
      // 🔵 1) BUSCAR POR PREFIJOS
      // ============================

      // user:ID
      if (term.startsWith("user:")) {
        const id = Number(term.replace("user:", ""));
        if (!isNaN(id)) {
            try {
                const loans = await loansService.getByUserId(id);
                setLoans(loans);
                setCurrentPage(1);
                setIsSearching(true);
                return;
            } catch {}
        }
      }

      // loan:ID
      if (term.startsWith("loan:")) {
        const id = Number(term.replace("loan:", ""));
        if (!isNaN(id)) {
            try {
                const loan = await loansService.getByLoanId(id);
                setLoans(loan ? [loan] : []);
                setCurrentPage(1);
                setIsSearching(true);
                return;
            } catch {}
        }
      }

      // isbn:XXXX
      if (term.startsWith("isbn:")) {
        const isbn = term.replace("isbn:", "");
        try {
            const loans = await loansService.getByIsbn(isbn);
            setLoans(loans);
            setCurrentPage(1);
            setIsSearching(true);
            return;
        } catch {}
      }

      // date:YYYY-MM-DD
      if (term.startsWith("date:")) {
        const date = term.replace("date:", "");
        try {
            const loans = await loansService.getByLoanData(date);
            setLoans(loans);
            setCurrentPage(1);
            setIsSearching(true);
            return;
        } catch {}
      }

      // ============================
      // 🔵 2) BÚSQUEDA AUTOMÁTICA SIN PREFIJO
      // ============================

      // ISBN-13
      if (/^\d{13}$/.test(term)) {
        try {
            const loans = await loansService.getByIsbn(term);
            setLoans(loans);
            setCurrentPage(1);
            setIsSearching(true);
            return;
        } catch {}
      }

      // ISBN-10
      if (/^\d{9}[\dX]$/.test(term)) {
        try {
            const loans = await loansService.getByIsbn(term);
            setLoans(loans);
            setCurrentPage(1);
            setIsSearching(true);
            return;
        } catch {}
      }

      // Número → userId primero, luego loanId
      if (!isNaN(Number(term))) {
        const num = Number(term);

        // userId
        try {
            const userLoans = await loansService.getByUserId(num);
            if (userLoans.length > 0) {
                setLoans(userLoans);
                setCurrentPage(1);
                setIsSearching(true);
                return;
            }
        } catch {}

        // loanId
        try {
            const loan = await loansService.getByLoanId(num);
            if (loan) {
                setLoans([loan]);
                setCurrentPage(1);
                setIsSearching(true);
                return;
            }
        } catch {}
      }

      // Fecha YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(term)) {
        try {
            const loans = await loansService.getByLoanData(term);
            setLoans(loans);
            setCurrentPage(1);
            setIsSearching(true);
            return;
        } catch {}
      }

      // Último recurso → ISBN textual
      try {
        const loans = await loansService.getByIsbn(term);
        setLoans(loans);
        setCurrentPage(1);
        setIsSearching(true);
        return;
      } catch {}

      // Sin resultados
      setLoans([]);
      setCurrentPage(1);
      setIsSearching(true);
    };


    // ====================================
    // 🔵 RESETEO DE PAGINACIÓN EN BUSQUEDAS
    // ====================================
    const handleClear = async () => {
        setSearchTerm("");
        const all = await loansService.getAll();
        setLoans(all);
        setCurrentPage(1);      // ⭐ reset
        setIsSearching(false);  // ⭐ modo normal
    };



    return (
        <div className="space-y-4">

            {/* ============================
                🔵 HEADER
                ============================ */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Gestión de Préstamos</h2>

                <div className="flex items-center gap-3">

                    {/* ============================
                        🔵 Input de búsqueda
                        ============================ */}
                    <button
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                        onClick={handleSearch}
                        >
                        Buscar
                    </button>

                    {/* ============================
                        🔵 Input de limpieza busqueda
                        ============================ */}
                    <button
                        className="bg-gray-300 text-black px-3 py-2 rounded hover:bg-gray-400"
                        onClick={handleClear}
                        >
                        Limpiar
                    </button>

                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        className="px-3 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {/* ============================
                        🔵 Botón crear préstamo  
                        ============================    */}
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus className="h-5 w-5" />
                        Agregar Préstamo
                    </button>
                </div>
            </div>

            {/* ============================
                🔵 MENSAJE DE ERROR
                ============================ */}
            {error && (
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-red-800 font-medium">{error}</p>

                    <button
                        onClick={async () => {
                            const all = await loansService.getAll();
                            setLoans(all);
                            setSearch("");
                            setError("");
                        }}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Recargar préstamos
                    </button>
                </div>
            )}

            {/* ============================
                🔵 TABLA DE PRÉSTAMOS
                ============================ */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">ID</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">User ID</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">ISBN</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">F. Préstamo</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">F. Devolución</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Estado</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentLoans.map((loan) => {
                            const isReturned = loan.returnDate
                                ? new Date(loan.returnDate) <= new Date()
                                : false;

                        return (
                            <tr key={loan.loanId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{loan.loanId}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{loan.userId}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{loan.isbn}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{loan.loanDate}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{loan.returnDate ?? "—"}</td>

                                <td className="px-6 py-4 border-b text-sm text-gray-900">
                                    {isReturned ? (
                                        <span className="text-green-600 font-semibold">Devuelto</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">Pendiente</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 border-b text-sm text-gray-900">
                                    <div className="flex gap-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => setSelectedLoan(loan)}
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>

                                        <button
                                            className="text-emerald-600 hover:text-emerald-800"
                                            onClick={() => setEditLoan(loan)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>

                                        <button
                                            onClick={() => !isSupport && setDeleteLoan(loan)}
                                            disabled={isSupport}
                                            className={`mr-2 ${
                                                isSupport
                                                    ? "text-red-400 cursor-not-allowed"
                                                    : "text-red-600 hover:text-red-800"
                                            }`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
        })}


                        {currentLoans.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                                    No hay préstamos para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mensaje cuando no hay resultados en la busqueda */}
            {loans.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                  No se encontraron resultados.
                </p>
            )}


            {/* ============================
                🔵 PAGINACION (solo si NO estamos buscando)
                ============================ */}
            {!isSearching && (
                <div className="flex justify-end items-center mt-4 gap-4">

                    <button
                     disabled={currentPage === 1}
                     onClick={() => setCurrentPage(currentPage - 1)}
                     className={`px-4 py-2 rounded-lg border ${
                        currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100"
                      }`}
                    >
                        Anterior
                    </button>

                    <span className="text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                     disabled={currentPage === totalPages}
                     onClick={() => setCurrentPage(currentPage + 1)}
                     className={`px-4 py-2 rounded-lg border ${
                     currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100"
                     }`}
                    >
                        Siguiente
                    </button>

                </div>
            )}

            {/* ============================
                🔵 MODALES (IMPLEMENTADOS)
                ============================ */}
 
            {selectedLoan && (
                <LoanViewModal
                    loan={selectedLoan}
                    onClose={() => setSelectedLoan(null)}
                />
            )}

            {editLoan && (
                <LoanEditModal
                    loan={editLoan}
                    onClose={() => setEditLoan(null)}
                    onUpdate={handleUpdateLoan}
                />
            )}

            {deleteLoan && (
                <LoanDeleteModal
                    loan={deleteLoan}
                    onClose={() => setDeleteLoan(null)}
                    onDelete={handleDeleteLoan}
                />
            )}

            
            {showCreateModal && (
                <LoanCreateModal 
                    onClose={() => setShowCreateModal(false)} 
                    onCreate={handleCreateLoan} />
            )}


        </div>
    );
};

export default LoansSection;

