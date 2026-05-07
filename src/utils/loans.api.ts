import { BACKEND_URL } from "../config";
import { getAuthToken } from "./auth.storage";
import type { ActiveLoan } from "../types";

// Helper para obtener headers con token
const authHeaders = () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authenticated user");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Obtener préstamos del usuario autenticado
export const getMyLoans = async (): Promise<ActiveLoan[]> => {
  const response = await fetch(`${BACKEND_URL}/loans/me`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error fetching loans: ${response.status}`);
  }

  // Versión funcional para el backend en Spring Boot y Node.js
  const json = await response.json();

  // ✔ Si Spring Boot → json.data existe
  // ✔ Si Node.js → json es un array
  return Array.isArray(json) ? json : json.data; 
  
  // Versión funcional para el backend en Node.js
  // const data = await response.json();
  // return data as ActiveLoan[]; 
};

// Crear préstamo
export const createLoan = async (isbn: string, userId: number): Promise<void> => {
  const today = new Date();
  const loanDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

  const response = await fetch(`${BACKEND_URL}/loans`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      isbn,
      userId,
      loanDate
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Error creating loan");
  }
};


// Devolver préstamo
export const returnLoan = async (loanId: number): Promise<void> => {
  const response = await fetch(`${BACKEND_URL}/loans/id/${loanId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Error returning loan");
  }
};


