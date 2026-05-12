import React from "react";
import { X } from "lucide-react";
import { Publisher } from "./PublishersSection";

interface Props {
    publisher: Publisher | null;
    onClose: () => void;
    onConfirm: (publisherId: number) => void;
}

const PublisherDeleteModal: React.FC<Props> = ({ publisher, onClose, onConfirm }) => {
    if (!publisher) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold mb-4 text-red-600">
                    Confirmar eliminación
                </h2>

                <p className="mb-6">
                    ¿Estás seguro de que deseas eliminar el editor 
                    <span className="font-semibold"> {publisher.namePublisher}</span>?
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>

                    <button 
                        onClick={() => {
                            onConfirm(publisher.publisherId);
                            setTimeout(() => onClose(), 600); // ✔ cierre automático del modal
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                        Eliminar
                    </button>

                </div>
            </div>
        </div>  
    );
};

export default PublisherDeleteModal;
