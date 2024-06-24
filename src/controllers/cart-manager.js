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

    async purchaseCart(req, res, next) {
            const cartId = req.params.cid;
            const userId = req.user._id; // Asumiendo que el usuario está autenticado y el ID del usuario está disponible en req.user
    
            try {
                const cart = await Cart.findById(cartId).populate('products.product');
                if (!cart) {
                    return res.status(404).json({ message: 'Carrito no encontrado' });
                }
    
                let totalAmount = 0;
                const productsToPurchase = [];
                const productsOutOfStock = [];
    
                for (const item of cart.products) {
                    const product = item.product;
                    if (product.stock >= item.quantity) {
                        product.stock -= item.quantity;
                        await product.save();
                        totalAmount += product.price * item.quantity;
                        productsToPurchase.push(product._id);
                    } else {
                        productsOutOfStock.push(product._id);
                    }
                }
    
                const ticketData = {
                    code: uuidv4(),
                    amount: totalAmount,
                    purchaser: userId
                };
    
                const ticket = await Ticket.create(ticketData);
    
                // Filtrar productos del carrito para eliminar los que se compraron con éxito
                cart.products = cart.products.filter(item => productsOutOfStock.includes(item.product._id));
                await cart.save();
    
                res.json({
                    message: 'Compra procesada con éxito',
                    ticket,
                    productsOutOfStock
                });
            } catch (error) {
                console.error('Error al procesar la compra', error);
                next(error);
            }
        }
}

module.exports = new CartController();
