import axios from "axios";
import { getAuthToken } from "../utils/auth.storage";

export interface Author {
  authorId: number;
  nameAuthor: string;
}

const BASE_URL = "http://localhost:9800/authors";

export const authorsService = {

  // 🔵 NUEVO: Buscar todos los autores (GET localhost:9800/authors)
  async getAll(): Promise<Author[]> {
    const res = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return res.data.data;
  },

  // 🔵 NUEVO: Crear un autor (POST localhost:9800/authors)
  async create(author: Author): Promise<Author> { 
    const res = await axios.post(`${BASE_URL}`, author, { 
      headers: { 
        Authorization: `Bearer ${getAuthToken()}`, 
      }, 
    });  
    return res.data.data;
  },

    // 🔵 NUEVO: Update un autor (PUT localhost:9800/authors/id/:id)
    async update(id: number, author: Author): Promise<Author> {
      const res = await axios.put(`${BASE_URL}/id/${id}`, author, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return res.data.data;
    },   
    
    // 🔵 NUEVO: Borrar un autor (DELETE localhost:9800/authors/id/:id )
    async remove(id: number): Promise<void> {
      await axios.delete(`${BASE_URL}/id/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },

    // 🔵 NUEVO: Buscar autores por nombre (GET localhost:9800/authors/name/:name )
    async searchByName(name: string): Promise<Author[]> {
      const res = await axios.get(`${BASE_URL}/name/${encodeURIComponent(name)}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return res.data.data;
    }
};
