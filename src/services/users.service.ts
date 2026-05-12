import axios from "axios";
import { getAuthToken } from "../utils/auth.storage";

export interface User {
    userId: number;
    dni: string;
    address: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    country: string | null;
    phone: string;
    email: string;
    password: string;
    registrationDate: string | null;
    userDrop: boolean;
    daysDisciplinary: number;
    role: string;
    fullname: string;
    }

const BASE_URL = "http://localhost:9800/users";
    
export const usersService = {

    // 🔵 Buscar todos los usuarios (GET localhost:9800/users)
    async getAll():  Promise<User[]> {
      const res = await axios.get(`${BASE_URL}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
     });
     return Array.isArray(res.data) ? res.data : res.data.data;

     // return res.data.data;
    },

    // 🔵 Buscar un usuario (GET localhost:9800/users/id/:id)
    async getById(id: number): Promise<User> {
      const res = await axios.get(`${BASE_URL}/id/${id}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
     });
     return res.data.data ?? res.data;

     //return res.data.data;
    },

    // 🔵 Buscar un usuario por fullname (GET localhost:9800/users/name/:name)
    async getByName(name: string): Promise<User> {
      const res = await axios.get(`${BASE_URL}/name/${name}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
     });
     return res.data.data ?? res.data;

     // return res.data.data;
    },
    
    // 🔵 Crear un usuario (POST localhost:9800/users)
    async create(data: Omit<User, "userId">): Promise<User> { 
      const res = await axios.post(`${BASE_URL}`, data, { 
        headers: { 
          Authorization: `Bearer ${getAuthToken()}`, 
        }, 
      });  
      return res.data.data;

      // return res.data.data;
    },

    // 🔵 Update un usuario (PUT localhost:9800/users/id/:id)
    async update(id: number, data: Partial<User>): Promise<User> {

      // Payload universal compatible con Spring Boot y Node.js
      const payload = {
        userId: id, // ✔ obligatorio para Spring Boot

        fullname: data.fullname?.trim() ?? "",
        dni: data.dni?.trim() ?? "",
        address: data.address?.trim() ?? null,
        city: data.city?.trim() ?? null,
        province: data.province?.trim() ?? null,
        postalCode: data.postalCode?.trim() ?? null,
        country: data.country?.trim() ?? null,
        phone: data.phone?.trim() ?? "",
        email: data.email?.trim() ?? "",
        daysDisciplinary: data.daysDisciplinary ?? 0,
        role: data.role ?? "USER"
      };
      const res = await axios.put(`${BASE_URL}/id/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return res.data.data ?? res.data;

      // return res.data.data;
    },

    // 🔵 Borrado fisico de un usuario (DELETE localhost:9800/users/id/:id)
    async delete(id: number): Promise<void> {
      await axios.delete(`${BASE_URL}/id/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },

    // 🔵 Borrado lógico de un usuario (DELETE localhost:9800/users/drop/id/:id)
    async drop(id: number): Promise<void> {
      await axios.delete(`${BASE_URL}/drop/id/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },

  }
