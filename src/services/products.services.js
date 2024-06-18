const ProductModel = require("../models/product.model.js");

class ProductService {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        if (!title || !description || !price || !code || !stock || !category) {
            throw new Error("Todos los campos son obligatorios");
        }

        const existeProducto = await ProductModel.findOne({ code });
        if (existeProducto) {
            throw new Error("El código debe ser único");
        }

        const nuevoProducto = new ProductModel({
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            status: true,
            thumbnails: thumbnails || []
        });

        await nuevoProducto.save();
        return nuevoProducto;
    }

    async getProducts() {
        return await ProductModel.find();
    }

    async getProductById(id) {
        const producto = await ProductModel.findById(id);
        if (!producto) {
            throw new Error("Producto no encontrado");
        }
        return producto;
    }

    async updateProduct(id, productoActualizado) {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });
        if (!updatedProduct) {
            throw new Error("Producto no encontrado");
        }
        return updatedProduct;
    }

    async deleteProduct(id) {
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new Error("Producto no encontrado");
        }
    }
}

module.exports = new ProductService();
