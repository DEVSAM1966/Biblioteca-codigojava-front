import { getAuthToken } from "../utils/auth.storage";

export interface Author {
  authorId: number;
  nameAuthor: string;
}

const BASE_URL = "http://localhost:9800/authors";

export const authorsService = {
  // 🔵 NUEVO: Buscar todos los autores (GET localhost:9800/authors)
  async getAll(): Promise<Author[]> {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al obtener autores");
    }

    const json = await res.json();
    return json.data;
  },

  // 🔵 NUEVO: Crear un autor (POST localhost:9800/authors)
  async create(nameAuthor: string): Promise<Author> { 
    const res = await fetch(BASE_URL, { 
      method: "POST", 
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${getAuthToken()}`, 
      }, 
      body: JSON.stringify({ nameAuthor }), 
    }); 
    
    if (!res.ok) { throw new Error("Error al crear autor");
    } 
    
    const json = await res.json(); 
    return json.data; // asumiendo misma estructura { data: { ...author } } 
    },

    // 🔵 NUEVO: Update un autor (PUT localhost:9800/authors/id/:id)
    async update(id: number, nameAuthor: string): Promise<Author> {
      const res = await fetch(`${BASE_URL}/id/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ nameAuthor }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar autor");
      }

      const json = await res.json();
      return json.data; // si tu backend envuelve en { data: {...} }
    },   
    
    // 🔵 NUEVO: Borrar un autor (DELETE localhost:9800/authors/id/:id )
    async remove(id: number): Promise<void> {
      const res = await fetch(`${BASE_URL}/id/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al eliminar autor");
      }
    },

    // 🔵 NUEVO: Buscar autores por nombre (GET localhost:9800/authors/name/:name )
    async searchByName(name: string): Promise<Author[]> {
      const res = await fetch(`${BASE_URL}/name/${encodeURIComponent(name)}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al buscar autores");
      }

      const json = await res.json();
      return json.data; // si tu backend envuelve en { data: [...] }
    }
};
