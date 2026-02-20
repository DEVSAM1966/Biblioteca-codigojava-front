import axios from "axios";
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

    async getAll(): Promise<Publisher[]> {
        const res = await axios.get(`${BASE_URL}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return res.data.data;
    },

    async create(publisher: Publisher): Promise<Publisher> {
        const res = await axios.post(`${BASE_URL}`, publisher, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return res.data.data;
    },

    async update(id: number, publisher: Publisher): Promise<Publisher> {
        const res = await axios.put(`${BASE_URL}/id/${id}`, publisher, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return res.data.data;
    },

    async delete(id: number): Promise<void> {
        await axios.delete(`${BASE_URL}/id/${id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
    },

    async searchByName(name: string): Promise<Publisher[]> {
        const res = await axios.get(`${BASE_URL}/name/${encodeURIComponent(name)}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return res.data.data;
    }
};
