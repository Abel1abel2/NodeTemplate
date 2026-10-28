// Import the INSTANCE you exported at the bottom of product.dal.ts
import { productDal, type ProductSearchParams } from "../dal/product.dal.js";
import type { CreateProductInput, UpdateProductInput, SearchProductInput } from "../schema/product.js";

export class ProductService {
    async createProduct(data: CreateProductInput) {
        return await productDal.create(data);
    }

    async getProductById(id: number) {
        return await productDal.findById(id);
    }

    async updateProduct(id: number, data: UpdateProductInput) {
        return await productDal.update(id, data);
    }

    async deleteProduct(id: number) {
        return await productDal.delete(id);
    }

    async getAllProducts() {
        return await productDal.findMany(undefined, undefined, { createdAt: "desc" });
    }

    async searchProducts(filters: SearchProductInput) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;

        const searchParams: ProductSearchParams = {
            query: filters.query,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            tag: filters.tag,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
            skip,
            take: limit,
        };

        const { products, total } = await productDal.searchProducts(searchParams);

        return {
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
}
