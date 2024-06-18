const CartService = require("../services/carts.services.js");
const ProductService = require('../services/products.services');
const TicketService = require('../services/ticket.services.js'); 
const { v4: uuidv4 } = require('uuid'); 


class CartController {
    async crearCarrito(req, res) {
        try {
            const carrito = await CartService.crearCarrito();
            console.log(carrito)
            res.status(201).json({
                status: "success",
                message: "Carrito creado exitosamente",
                carrito
            });
        } catch (error) {
            console.error("Error al crear el carrito", error);
            res.status(500).json({
                status: "error",
                message: "Error al crear el carrito: " + error.message
            });
        }
    }

    async getCarritoById(req, res) {
        const cartId = req.params.cartId;

        try {
            const carrito = await CartService.getCarritoById(cartId);
            res.json(carrito);
        } catch (error) {
            console.error("Error al obtener un carrito por ID", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async agregarProductoAlCarrito(req, res) {
        const cartId = req.params.cartId;
        const { productId, quantity } = req.body;

        try {
            const carrito = await CartService.agregarProductoAlCarrito(cartId, productId, quantity);
            res.json(carrito);
        } catch (error) {
            console.error("Error al agregar un producto al carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async eliminarProductoDelCarrito(req, res) {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        try {
            const carrito = await CartService.eliminarProductoDelCarrito(cartId, productId);
            res.json(carrito);
        } catch (error) {
            console.error("Error al eliminar un producto del carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async actualizarCantidadProductoEnCarrito(req, res) {
        const cartId = req.params.cartId;
        const { productId, nuevaCantidad } = req.body;

        try {
            const carrito = await CartService.actualizarCantidadProductoEnCarrito(cartId, productId, nuevaCantidad);
            res.json(carrito);
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async vaciarCarrito(req, res) {
        const cartId = req.params.cartId;

        try {
            const carrito = await CartService.vaciarCarrito(cartId);
            res.json(carrito);
        } catch (error) {
            console.error("Error al vaciar el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async actualizarCarrito(req, res) {
        const cartId = req.params.cartId;
        const { products } = req.body;

        try {
            const updatedCart = await CartService.actualizarCarrito(cartId, products);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al actualizar el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async purchaseCart(req, res) {
        const { cid } = req.params;
        const { purchaser } = req.body;

        try {
            // Obtener el carrito
            const cart = await CartService.getCartById(cid);

            if (!cart) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }

            // Iterar sobre los productos del carrito
            const purchaseDetails = [];
            const unprocessedProducts = [];
            let total = 0;

            for (const item of cart.products) {
                const product = await ProductService.getProductById(item.product);

                if (product.stock >= item.quantity) {
                    // Reducir el stock del producto
                    product.stock -= item.quantity;
                    await ProductService.updateProduct(product._id, product);

                    // Agregar el producto al detalle de la compra
                    purchaseDetails.push({
                        product: product._id,
                        quantity: item.quantity,
                        price: product.price
                    });

                    // Calcular el total
                    total += item.quantity * product.price;
                } else {
                    // Agregar el producto a los no procesados
                    unprocessedProducts.push(item.product);
                }
            }

            if (purchaseDetails.length > 0) {
                // Crear el ticket de compra
                const ticket = await TicketService.createTicket({
                    code: uuidv4(), // Generar un código único para el ticket
                    amount: total,
                    purchaser,
                });

                // Filtrar los productos que no se compraron y actualizar el carrito
                const updatedProducts = cart.products.filter(item => unprocessedProducts.includes(item.product.toString()));
                cart.products = updatedProducts;
                await cart.save();

                // Responder con los detalles de la compra y el ticket
                res.json({
                    message: "Compra realizada con éxito",
                    purchaseDetails,
                    ticket,
                    unprocessedProducts,
                });
            } else {
                res.json({
                    message: "No se pudo realizar la compra. Sin productos disponibles.",
                    unprocessedProducts,
                });
            }
        } catch (error) {
            console.error("Error al procesar la compra", error);
            res.status(500).json({ message: "Error al procesar la compra", error });
        }
    }
}

module.exports = new CartController();
