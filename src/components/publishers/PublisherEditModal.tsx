import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Publisher } from './PublishersSection';

interface Props {
    publisher: Publisher | null;
    onClose: () => void;
    onUpdate: (updatedPublisher: Publisher) => void;
}

const PublisherEditModal: React.FC<Props> = ({ publisher, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<Publisher>({
        publisherId: 0,
        namePublisher: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
        phone: '',
        notes: ''
    });

    useEffect(() => {
        if (publisher) {
            setFormData(publisher);
        }
    }, [publisher]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
    };

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
                    Editar editor
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <input 
                            type="number"
                            name="publisherId"
                            value={formData.publisherId}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input 
                            type="text"
                            name="namePublisher"
                            value={formData.namePublisher}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                        <input 
                            type="text"
                            name="address"
                            value={formData.address ?? ""}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                        <input 
                            type="text"
                            name="city"
                            value={formData.city ?? ""}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Provincia</label>
                        <input 
                            type="text"
                            name="province"
                            value={formData.province ?? ""}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Código postal</label>
                        <input 
                            type="text"
                            name="postalCode"
                            value={formData.postalCode ?? ""}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">País</label>
                        <input 
                            type="text"
                            name="country"
                            value={formData.country ?? ""}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input 
                            type="text"
                            name="phone"
                            value={formData.phone ?? ""}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notas</label>
                        <input 
                            type="text"
                            name="notes"
                            value={formData.notes ?? ""}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                        Cancelar
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                        Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PublisherEditModal;  
