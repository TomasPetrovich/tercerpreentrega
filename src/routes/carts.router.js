const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart-manager.js");

router.post("/", (req, res) => CartController.crearCarrito(req, res));

router.get("/:cartId", (req, res) => CartController.getCarritoById(req, res));

router.post("/:cartId/product", (req, res) => CartController.agregarProductoAlCarrito(req, res));

router.delete("/:cartId/product/:productId", (req, res) => CartController.eliminarProductoDelCarrito(req, res));

router.put("/:cartId/product", (req, res) => CartController.actualizarCantidadProductoEnCarrito(req, res));

router.delete("/:cartId", (req, res) => CartController.vaciarCarrito(req, res));

router.put("/:cartId", (req, res) => CartController.actualizarCarrito(req, res));

router.post('/:cid/purchase', CartController.purchaseCart);


module.exports = router;
