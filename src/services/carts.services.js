const CartModel = require("../models/cart.model.js");

class CartService {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.error("Error al crear un carrito nuevo", error);
            throw error;
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error("Carrito no encontrado");
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener un carrito por ID", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al agregar un producto", error);
            throw error;
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = carrito.products.filter(item => item.product.toString() !== productId);
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al eliminar producto del carrito", error);
            throw error;
        }
    }

    async actualizarCantidadProductoEnCarrito(cartId, productId, nuevaCantidad) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const index = carrito.products.findIndex(item => item.product.toString() === productId);

            if (index === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }

            carrito.products[index].quantity = nuevaCantidad;
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al actualizar cantidad del producto en el carrito", error);
            throw error;
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = [];
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al vaciar el carrito", error);
            throw error;
        }
    }

    async actualizarCarrito(cartId, products) {
        try {
            const cart = await this.getCarritoById(cartId);
            cart.products = products;
            return await cart.save();
        } catch (error) {
            console.error("Error al actualizar el carrito", error);
            throw error;
        }
    }
}

module.exports = new CartService();
