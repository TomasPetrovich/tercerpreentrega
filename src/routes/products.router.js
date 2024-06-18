const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product-manager.js");

// Listar todos los productos.
router.get("/", (req, res) => ProductController.getAllProducts(req, res));

// Traer solo un producto por id.
router.get("/:pid", (req, res) => ProductController.getProductById(req, res));

// Agregar nuevo producto.
router.post("/", (req, res) => ProductController.addProduct(req, res));

// Actualizar por ID.
router.put("/:pid", (req, res) => ProductController.updateProduct(req, res));

// Eliminar producto.
router.delete("/:pid", (req, res) => ProductController.deleteProduct(req, res));

module.exports = router;
