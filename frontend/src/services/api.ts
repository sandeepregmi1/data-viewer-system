import axios from "axios";
import { Registration } from "../types/registration";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const getRegistrations = async (): Promise<Registration[]> => {
    const res = await API.get("/registrations");

    // 🔥 Normalize MongoDB format
    return res.data.map((item: any) => ({
        ...item,
        _id: item._id?.$oid || item._id,
        createdAt: item.createdAt?.$date || item.createdAt,
        updatedAt: item.updatedAt?.$date || item.updatedAt,
    }));
};