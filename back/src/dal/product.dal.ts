// Import types from your generated folder
import type { PrismaClient, Prisma } from "../generated/prisma/client.js";
import type { Product } from "../generated/prisma/client.js";
import { BaseDAL } from "./base.dal.js";

export interface ProductSearchParams {
    query?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    tag?: string | undefined;
    sortBy?: "name" | "price" | "createdAt" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    skip?: number | undefined;
    take?: number | undefined;
}

export class ProductDal extends BaseDAL<Product> {
    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    // Required by BaseDAL
    protected getModel() {
        return this.prisma.product;
    }

    async searchProducts(params: ProductSearchParams): Promise<{ products: Product[]; total: number }> {
        const where: any = {};

        if (params.query) {
            where.OR = [
                { name: { contains: params.query, mode: "insensitive" } },
                { description: { contains: params.query, mode: "insensitive" } },
                { tags: { contains: params.query, mode: "insensitive" } },
            ];
        }

        if (params.tag) {
            where.tags = { contains: params.tag, mode: "insensitive" };
        }

        if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            where.price = {};
            if (params.minPrice !== undefined) {
                where.price.gte = params.minPrice;
            }
            if (params.maxPrice !== undefined) {
                where.price.lte = params.maxPrice;
            }
        }

        const orderBy: any = {};
        if (params.sortBy) {
            orderBy[params.sortBy] = params.sortOrder || "desc";
        } else {
            orderBy.createdAt = "desc";
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy,
                skip: params.skip,
                take: params.take,
            }),
            this.prisma.product.count({ where }),
        ]);

        return { products, total };
    }

    async findProductsByMaxPrice(maxPrice: number): Promise<Product[]> {
        return this.prisma.product.findMany({
            where: {
                price: { lte: maxPrice }
            }
        });
    }
}

// IMPORTANT: Export a single instance so your service can use it
import prisma from "../lib/prisma.js";
export const productDal = new ProductDal(prisma);