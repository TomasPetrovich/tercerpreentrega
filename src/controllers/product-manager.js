const ProductService = require("../services/products.services.js");

class ProductController {
    async getAllProducts(req, res) {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort;
        const query = req.query.query;
        let filter = {};

        if (query) {
            filter = { category: query };
        }

        try {
            const options = {
                page,
                limit,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
                customLabels: {
                    docs: 'payload',
                    totalDocs: 'totalProducts',
                    totalPages: 'totalPages'
                }
            };

            const productos = Object.keys(filter).length > 0 ?
                await ProductService.getProducts(filter, options) :
                await ProductService.getProducts({}, options);

            res.json({
                status: "success",
                ...productos,
                page,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevLink: productos.hasPrevPage ? `/products?page=${productos.prevPage}&limit=${limit}&query=${query || ''}` : null,
                nextLink: productos.hasNextPage ? `/products?page=${productos.nextPage}&limit=${limit}&query=${query || ''}` : null
            });
        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: "error",
                message: "Error al obtener productos: " + error.message
            });
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;

        try {
            const producto = await ProductService.getProductById(id);
            res.json(producto);
        } catch (error) {
            console.error("Error al obtener producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async addProduct(req, res) {
        const nuevoProducto = req.body;

        try {
            await ProductService.addProduct(nuevoProducto);
            res.status(201).json({ message: "Producto agregado exitosamente" });
        } catch (error) {
            console.error("Error al agregar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateProduct(req, res) {
        const id = req.params.pid;
        const productoActualizado = req.body;

        try {
            await ProductService.updateProduct(id, productoActualizado);
            res.json({ message: "Producto actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;

        try {
            await ProductService.deleteProduct(id);
            res.json({ message: "Producto eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = new ProductController();
