import axios from "axios";
import { getAuthToken } from "../utils/auth.storage";

export interface Category {
  categoryId: number;
  nameCategory: string;
  subtopicCategory?: string | null;
}

const BASE_URL = "http://localhost:9800/categories";

export const categoriesService = {

  // 🔵 NUEVO: Buscar todas la categorias (GET localhost:9800/categories)
  async getAll(): Promise<Category[]> {
    const res = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return res.data.data;
  },

  // 🔵 NUEVO: Buscar una categoria por ID (GET localhost:9800/categories/id/:id)
  async getById(id: number): Promise<Category | null> {
    try {
      const res = await axios.get(`${BASE_URL}/id/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return res.data.data;
    } catch {
      return null;
    }
  },

  // 🔵 NUEVO: Buscar categorias por nombre (GET localhost:9800/categories/name/:name)
  async getByName(name: string): Promise<Category[]> {
    try {
      const res = await axios.get(`${BASE_URL}/name/${name}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return res.data.data;
    } catch {
      return [];
    }
  },

  // 🔵 NUEVO: Crear una nueva categoria (POST localhost:9800/categories)
  async create(data: {
    nameCategory: string;
    subtopicCategory?: string | null;
  }): Promise<Category> {
    const res = await axios.post(`${BASE_URL}`, data, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return res.data.data;
  },

  // 🔵 NUEVO: Actualizar una categoria (PUT localhost:9800/categories/id/:id)
  async update(
    id: number,
    data: {
      nameCategory: string;
      subtopicCategory?: string | null;
    }
  ): Promise<Category> {
    const res = await axios.put(`${BASE_URL}/id/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return res.data.data;
  },

  // 🔵 NUEVO: Eliminar una categoria (DELETE localhost:9800/categories/id/:id)
  async delete(id: number): Promise<boolean> {
    const res = await axios.delete(`${BASE_URL}/id/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return res.data.data;
  },
};
