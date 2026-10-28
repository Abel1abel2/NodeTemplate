import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchProductParams {
  query?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  tag?: string;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  success: boolean;
  products: Product[];
  pagination: Pagination;
}

export const productService = {
  // Search and fetch products with filters & pagination
  async search(params: SearchProductParams = {}): Promise<ProductResponse> {
    const cleanParams: Record<string, any> = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && val !== null) {
        cleanParams[key] = val;
      }
    });

    const res = await api.get<ProductResponse>("/product", { params: cleanParams });
    return res.data;
  },

  // Get single product
  async getById(id: number): Promise<Product> {
    const res = await api.get<{ success: boolean; product: Product }>(`/product/${id}`);
    return res.data.product;
  },

  // Create new product
  async create(data: { name: string; description: string; price: number; tags?: string }): Promise<Product> {
    const res = await api.post<{ success: boolean; product: Product; message: string }>("/product", data);
    return res.data.product;
  },

  // Update product (Full or Partial)
  async update(id: number, data: Partial<{ name: string; description: string; price: number; tags?: string }>): Promise<Product> {
    const res = await api.put<{ success: boolean; product: Product; message: string }>(`/product/${id}`, data);
    return res.data.product;
  },

  // Delete product
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/product/${id}`);
    return res.data;
  },
};

