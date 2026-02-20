import { getAuthToken } from "../utils/auth.storage";

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

const BASE_URL = "http://localhost:9800/publishers";

export const publishersService = {
    // 🔵 NUEVO: Buscar todos los editores (GET localhost:9800/publishers)
    async getAll(): Promise<Publisher[]> {
        const res = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        if (!res.ok) {
            throw new Error("Error al obtener editores");
        }

        const json = await res.json();
        return json.data;
    },
    
    // 🔵 NUEVO: Crear un editor (POST localhost:9800/publishers)
    async create(publisher: Publisher): Promise<Publisher> {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(publisher),
        });

        if (!res.ok) {
            throw new Error("Error al crear editor");
        }
        
        const json = await res.json();
        return json.data; // asumiendo misma estructura { data: { ...publisher } }
    },

    // 🔵 NUEVO: Update un editor (PUT localhost:9800/publishers/id/:id)
    async update(id: number, publisher: Publisher): Promise<Publisher> {    
        const res = await fetch(`${BASE_URL}/id/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(publisher),
        });
        
        if (!res.ok) {
            throw new Error("Error al actualizar editor");
        }
        const json = await res.json();
        return json.data;
    },

    // 🔵 NUEVO: Eliminar un editor (DELETE localhost:9800/publishers/id/:id
    async delete(id: number): Promise<void> {
        const res = await fetch(`${BASE_URL}/id/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        if (!res.ok) {
            throw new Error("Error al eliminar editor");
        }
    },

    // 🔵 NUEVO: Buscar un editor por nombre (GET localhost:9800/publishers/name/:name)
    async searchByName(name: string): Promise<Publisher[]> {
        const res = await fetch(`${BASE_URL}/name/${encodeURIComponent(name)}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        // ⭐ Si es 404 → devolver lista vacía 
        if (res.status === 404) { 
            return []; 
        }
        
        if (!res.ok) {
            throw new Error("Error al buscar editor por nombre");
        }   
        const json = await res.json();
        return json.data; 
    }
};