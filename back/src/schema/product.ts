import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100),
  description: z.string().min(3, "Description must be at least 3 characters").max(1000),
  price: z.coerce.number().positive("Price must be a positive number"),
  tags: z.string().optional().nullable(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100).optional(),
  description: z.string().min(3, "Description must be at least 3 characters").max(1000).optional(),
  price: z.coerce.number().positive("Price must be a positive number").optional(),
  tags: z.string().optional().nullable(),
});

export const searchProductSchema = z.object({
  query: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  tag: z.string().optional(),
  sortBy: z.enum(["name", "price", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type SearchProductInput = z.infer<typeof searchProductSchema>;

