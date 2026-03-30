import axios from "axios";
import { getAuthToken } from "../utils/auth.storage";

export interface Loan {
  loanId: number;
  userId: number;
  isbn: string;
  loanDate: string;
  returnDate: string | null;
}

export interface LoanCreateDto {
  userId: number;
  isbn: string;
  loanDate: string;
  returnDate: string | null;
}

const BASE_URL = "http://localhost:9800/loans";

export const loansService = {

  // 🔵 NUEVO: Buscar todos los préstamos (GET localhost:9800/loans)
  async getAll(): Promise<Loan[]> {
    const res = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return res.data.data;
  },

  // 🔵 NUEVO: Crear un préstamo (POST localhost:9800/loans)
  async create(data: LoanCreateDto): Promise<Loan> { 
    const res = await axios.post(`${BASE_URL}`, data, { 
      headers: { 
        Authorization: `Bearer ${getAuthToken()}`, 
      }, 
    });  
    return res.data.data;
  },

    // 🔵 NUEVO: Update un préstamo (PUT localhost:9800/loans/id/:id)
    async update(id: number, returnDate: string | null): Promise<Loan> {
      const res = await axios.put(
        `${BASE_URL}/id/${id}`, 
        { returnDate }, 
        {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return res.data.data;
    },   
    
    // 🔵 NUEVO: Borrar un préstamo (DELETE localhost:9800/loans/id/:id )
    async remove(id: number): Promise<void> {
      await axios.delete(`${BASE_URL}/id/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    },

    // 🔵 NUEVO: Buscar préstamos por usuario (GET localhost:9800/loans/user/:userId)
    async getByUserId(userId: number): Promise<Loan[]> {
      const res = await axios.get(`${BASE_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return res.data.data;
    },

    // 🔵 NUEVO: Buscar préstamos por ISBN (GET localhost:9800/loans/isbn/:isbn)
    async getByIsbn(isbn: string): Promise<Loan[]> {
      const res = await axios.get(`${BASE_URL}/isbn/${isbn}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return res.data.data;
    },
};
