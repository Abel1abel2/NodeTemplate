import type { Request, Response, NextFunction } from "express";
import { ProductService } from "../service/product.service.js";
import { createProductSchema, updateProductSchema, searchProductSchema } from "../schema/product.js";
import { ApiError } from "../utils/ApiError.js";
import { ZodError } from "zod";

const productService = new ProductService();

export class ProductController {
    async addProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = createProductSchema.parse(req.body);
            const result = await productService.createProduct(validatedData);

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                product: result,
            });
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: err.issues,
                });
            }
            next(err);
        }
    }

    async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new ApiError(400, "Invalid product id");
            }

            const product = await productService.getProductById(id);
            if (!product) {
                throw new ApiError(404, "Product not found");
            }

            return res.status(200).json({
                success: true,
                product,
            });
        } catch (err) {
            next(err);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new ApiError(400, "Invalid product id");
            }

            // Check if product exists first
            const existing = await productService.getProductById(id);
            if (!existing) {
                throw new ApiError(404, "Product not found");
            }

            const validatedData = updateProductSchema.parse(req.body);
            if (Object.keys(validatedData).length === 0) {
                throw new ApiError(400, "At least one field is required to update");
            }

            const updated = await productService.updateProduct(id, validatedData);

            return res.status(200).json({
                success: true,
                message: "Product updated successfully",
                product: updated,
            });
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: err.issues,
                });
            }
            next(err);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new ApiError(400, "Invalid product id");
            }

            const existing = await productService.getProductById(id);
            if (!existing) {
                throw new ApiError(404, "Product not found");
            }

            const deleted = await productService.deleteProduct(id);

            return res.status(200).json({
                success: true,
                message: "Product deleted successfully",
                product: deleted,
            });
        } catch (err) {
            next(err);
        }
    }

    async searchAndListProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedQuery = searchProductSchema.parse(req.query);
            const result = await productService.searchProducts(validatedQuery);

            return res.status(200).json({
                success: true,
                ...result,
            });
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid query parameters",
                    errors: err.issues,
                });
            }
            next(err);
        }
    }
}
