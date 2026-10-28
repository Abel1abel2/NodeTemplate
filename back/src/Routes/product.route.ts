import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const productRouter: Router = Router();
const productController = new ProductController();

// List & search products (public or authenticated)
productRouter.get("/", productController.searchAndListProducts.bind(productController));
productRouter.get("/:id", productController.getProduct.bind(productController));

// Create, update, delete products
productRouter.post("/", productController.addProduct.bind(productController));
productRouter.put("/:id", productController.updateProduct.bind(productController));
productRouter.patch("/:id", productController.updateProduct.bind(productController));
productRouter.delete("/:id", productController.deleteProduct.bind(productController));

export default productRouter;

