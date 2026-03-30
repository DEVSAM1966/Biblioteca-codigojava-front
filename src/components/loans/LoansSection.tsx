import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { loansService, Loan } from "../../services/loans.service";
import LoanViewModal from "./LoanViewModal";
import LoanEditModal from "./LoanEditModal";
import LoanDeleteModal from "./LoanDeleteModal";

const LoansSection: React.FC = () => {

    // ============================
    // 🔵 ESTADOS PRINCIPALES
    // ============================
    const [loans, setLoans] = useState<Loan[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ============================
    // 🔵 MODALES (NO FUNCIONAN AÚN)
    // ============================
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editLoan, setEditLoan] = useState<Loan | null>(null);
    const [deleteLoan, setDeleteLoan] = useState<Loan | null>(null);

    // ============================
    // 🔵 PAGINACIÓN
    // ============================
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentLoans = loans.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(loans.length / itemsPerPage);

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
    // 🔵 BÚSQUEDA (NO FUNCIONA AÚN)
    // ============================
    // ❌ Esto no funciona porque no existen searchByName, searchByUser, searchByIsbn
    // ❌ Lo dejamos comentado hasta implementar búsqueda real

    /*
    const handleSearch = async () => {
        const term = search.trim();
        if (!term) {
            const all = await loansService.getAll();
            setLoans(all);
            return;
        }

        try {
            let results: Loan[] = [];
            results = await loansService.searchByIsbn(term); // ❌ No existe
            setLoans(results);
        } catch {
            setError("Error realizando búsqueda");
        }
    };
    */

    return (
        <div className="space-y-4">

            {/* ============================
                🔵 HEADER
            ============================ */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Gestión de Préstamos</h2>

                <div className="flex items-center gap-3">

                    {/* 🔵 Input de búsqueda (NO FUNCIONAL AÚN) */}
                    <input
                        type="text"
                        placeholder="Buscar préstamos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {/* 🔵 Botón crear préstamo (modal no implementado) */}
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
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => setDeleteLoan(loan)}
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

            {/* ============================
                🔵 PAGINACION
            ============================ */}
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


            {/* ============================
                🔵 MODALES (NO IMPLEMENTADOS)
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

            {/*
            {showCreateModal && (
                <LoanCreateModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateLoan} />
            )}

            */}

        </div>
    );
};

export default LoansSection;

