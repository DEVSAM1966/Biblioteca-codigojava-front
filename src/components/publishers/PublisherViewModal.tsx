import React from "react";
import { X } from "lucide-react";
import { Publisher } from "./PublishersSection";

interface Props {
    publisher: Publisher | null;
    onClose: () => void;        
}

const PublisherViewModal: React.FC<Props> = ({ publisher, onClose }) => {
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

                <h2 className="text-xl font-bold mb-4">
                    Información del editor
                </h2>
                <div className="space-y-2"> 
                  <p>
                    <span className="font-semibold text-gray-700">ID:</span>{" "}
                    {publisher.publisherId}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Nombre:</span>{" "}
                    {publisher.namePublisher}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Dirección:</span>{" "}
                    {publisher.address}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Ciudad:</span>{" "}
                    {publisher.city}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Provincia:</span>{" "}
                    {publisher.province}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Código postal:</span>{" "}
                    {publisher.postalCode}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">País:</span>{" "}
                    {publisher.country}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Teléfono:</span>{" "}
                    {publisher.phone}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Notas:</span>{" "}
                    {publisher.notes}
                  </p>
                </div> 

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                 >
                    Cerrar
                 </button>
                </div>
            </div>
        </div>
    );
};

export default PublisherViewModal;
