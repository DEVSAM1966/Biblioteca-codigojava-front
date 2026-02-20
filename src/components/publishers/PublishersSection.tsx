// src/components/publishers/PublishersSection.tsx

import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";
import PublisherViewModal from "./PublisherViewModal";
import PublisherEditModal from "./PublisherEditModal";
import PublisherDeleteModal from "./PublisherDeleteModal";
import PublisherCreateModal from "./PublisherCreateModal";
import { publishersService } from "../../services/publishers.service";

export interface Publisher {
    publisherId: number;
    namePublisher: string;
    address: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    country: string | null;
    phone: string | null;
    notes: string | null;
}

const ITEMS_PER_PAGE = 10;

// 🔵 Datos mock
// const MOCK_PUBLISHERS: Publisher[] = [
//    {
//      publisherId: 1001,
//      namePublisher: "Editorial Alfa",
//      address: "Calle Falsa 123",
//      city: "Madrid",
//      province: "Madrid",
//      postalCode: "28001",
//      country: "España",
//      phone: "+34912345678",
//      notes: "Especializada en literatura contemporánea."
//  },
//  {
//        publisherId: 1002,
//        namePublisher: "Editorial Beta",
//        address: "Avenida Siempre Viva 456",
//        city: "Barcelona",
//        province: "Cataluña",
//        postalCode: "08001",
//        country: "España",
//        phone: "+34987654321",
//        notes: "Foco en libros de ciencia ficción."
//    }
//];

const PublishersSection: React.FC = () => {
    // 🔵 Estado inicial vacío (ya no usamos MOCK_PUBLISHERS)
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔵 Estado de búsqueda
    const [search, setSearch] = useState("");

    // 🔵 Paginación basada en filtrados
    const [currentPage, setCurrentPage] = useState(1);

    // 🔵 Estados de modales
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
    const [editPublisher, setEditPublisher] = useState<Publisher | null>(null);
    const [deletePublisher, setDeletePublisher] = useState<Publisher | null>(null);
    
    // 🔵 Cargar editoress reales desde backend
    useEffect(() => {
        const loadPublishers = async () => {
            try {
                setLoading(true);
                const data = await publishersService.getAll();
                setPublishers(data);
            } catch (err) {
                console.error("Error al cargar editoriales:", err);
                setError("No se pudieron cargar las editoriales. Intenta de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        loadPublishers();   
    }, []);

    // 🔵 Mostrar estados de carga o error
    if (loading) return <div>Cargando editores ...</div>;
    // if (error) return <div className="text-red-600">{error}</div>;

    // 🔵 Tratamiento de la paginación
    const totalPages = Math.max(1, Math.ceil(publishers.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = publishers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
    // 🔵 Funciones de paginación
    const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
    const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

    // 🔵 Crear editor
    const handleCreatePublisher = async (newPublisher: Publisher) => {
        try {
            const createdPublisher = await publishersService.create(newPublisher);
            setPublishers(prev => [...prev, createdPublisher]);
            setShowCreateModal(false);
        } catch (err) {
            console.error("Error al crear editorial:", err);
            setError("No autorizado para crear editoriales o error al crear editor");
        }
    };

    // 🔵 Editar editor
    const handleUpdatePublisher = async (updatedPublisher: Publisher) => {
    try {
            const updated = await publishersService.update(
                updatedPublisher.publisherId,
                updatedPublisher
            );

            setPublishers(prev =>
                prev.map(pub =>
                    pub.publisherId === updated.publisherId ? updated : pub
                )
            );

            setEditPublisher(null);
        } catch (err) {
            setError("No autorizado o error al actualizar editor");
        }
    };


    // 🔵 Borrar editor
    const handleDeletePublisher = async (publisherId: number) => {
        try {
            await publishersService.delete(publisherId);
            setPublishers((prev) =>
                prev.filter((pub) => pub.publisherId !== publisherId)
            );
        } catch (err) {
            console.error("Error al borrar editorial:", err);
            setError("No autorizado para borrar editoriales o error al eliminar editorial");
        }
    };

    return (
    <div className="space-y-4">

        {/* 🔵 HEADER + búsqueda + botón nuevo */}
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Gestión de Editoriales</h2>

            <div className="flex items-center gap-3">

                {/* 🔵 Input de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar editor..."
                    value={search}
                    onChange={async (e) => {
                        const value = e.target.value;
                        setSearch(value);
                        setCurrentPage(1);

                        try {
                            if (value.trim() === "") {
                                const all = await publishersService.getAll();
                                setPublishers(all);
                                setError(null);
                            } else {
                                const results = await publishersService.searchByName(value);
                                if (results.length === 0) { 
                                    setPublishers([]); 
                                    setError(null); 
                                    return;
                                }
                                setPublishers(results);
                                setError(null);
                            }
                        } catch (err) {
                            console.error("ERROR EN BÚSQUEDA:", err);

                            setError("Error al buscar editoriales");
                            setPublishers([]);
                        }
                    }}
                    className="px-3 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* 🔵 Botón de crear editor */}
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus className="h-5 w-5" />
                    Agregar Editorial
                </button>
            </div>
        </div>

        {/* 🔵 Mensaje cuando no hay resultados y fuera del flex*/}
        {error && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-red-800 font-medium">
                    {error}
                </p>

                <button
                    onClick={async () => {
                        const all = await publishersService.getAll();
                        setPublishers(all);
                        setSearch("");
                        setError(null);
                    }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Recargar todos los editores
                </button>
            </div>
        )}

        {/* 🔵 TABLA */}
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">ID</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Nombre</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">País</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Teléfono</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {publishers.map((publisher) => (
                        <tr key={publisher.publisherId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 border-b text-sm text-gray-900">{publisher.publisherId}</td>
                            <td className="px-6 py-4 border-b text-sm text-gray-900">{publisher.namePublisher}</td>
                            <td className="px-6 py-4 border-b text-sm text-gray-900">{publisher.country}</td>
                            <td className="px-6 py-4 border-b text-sm text-gray-900">{publisher.phone}</td>
                            <td className="px-6 py-4 border-b text-sm text-gray-900">
                                <div className="flex gap-2">
                                    <button
                                        className="text-emerald-600 hover:text-emerald-800"
                                        onClick={() => setSelectedPublisher(publisher)}
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>

                                    <button
                                        className="text-emerald-600 hover:text-emerald-800"
                                        onClick={() => setEditPublisher(publisher)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>

                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => setDeletePublisher(publisher)}
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
                                colSpan={5}
                                className="px-4 py-4 text-center text-sm text-gray-500"
                            >
                                No hay editoriales para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>



            {/* 🔵 MODALES (siempre al final del componente) */}
            {selectedPublisher && (
                <PublisherViewModal
                    publisher={selectedPublisher}
                    onClose={() => setSelectedPublisher(null)}
                />
            )}

            {showCreateModal && (
                <PublisherCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreatePublisher}
                />
            ) }

            {editPublisher && (
                <PublisherEditModal
                    publisher={editPublisher}
                    onClose={() => setEditPublisher(null)}
                    onUpdate={handleUpdatePublisher}
                />
            )}

            {deletePublisher && (
                <PublisherDeleteModal
                    publisher={deletePublisher}
                    onClose={() => setDeletePublisher(null)}
                    onConfirm={handleDeletePublisher}
                />
            )}      

        </div>
    );
};

export default PublishersSection;

