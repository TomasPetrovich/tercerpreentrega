const express = require("express");
const router = express.Router(); 
const ProductModel = require("../models/product.model.js");
const CartModel = require("../models/cart.model.js");
const authorization = require('../middlewares/auth.middleware.js');

router.get("/", authorization(['usuario']) ,async (req, res) => {
   res.render("chat");
});

router.get("/products", authorization(['usuario']) , async (req, res) => {
   try {
       // Obtener los parámetros de la solicitud
       const { limit = 10, page = 1 } = req.query;

       // Convertir los valores de limit y page a números enteros
       const limitNum = parseInt(limit, 10);
       const pageNum = parseInt(page, 10);

       // Realizar la consulta de productos con paginación
       const productos = await ProductModel.paginate({}, { limit: limitNum, page: pageNum });

       // Simplificar los documentos sin el lean()
       const productosResultadoFinal = productos.docs.map(producto => {
           const { _id, ...rest } = producto.toObject();
           return rest;
       });

       // Renderizar la vista con los productos y la información de paginación
       res.render("products", {
           user: req.session.user,
           productos: productosResultadoFinal,
           hasPrevPage: productos.hasPrevPage,
           hasNextPage: productos.hasNextPage,
           prevPage: productos.prevPage,
           nextPage: productos.nextPage,
           currentPage: productos.page,
           totalPages: productos.totalPages
       });
   } catch (error) {
       // Manejar errores
       console.error("Error al obtener productos:", error);
       res.status(500).send("Ha ocurrido un error, por favor intenta de nuevo");
   }
});

router.get("/carts/:cid", authorization(['usuario']) , async (req, res) => {
    const cartId = req.params.cid;

    try {
        // Buscar el carrito por su ID
        const cart = await CartModel.findById(cartId).populate("products.product").lean();

        if (!cart) {
            // Si el carrito no se encuentra, devuelve un error 404
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Renderiza la vista 'cart' y pasa el carrito como contexto
        res.render("cart", { cart });
    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//Login

router.get("/login", (req, res) => {
    // Verifica si el usuario ya está logueado y redirige a la página de perfil si es así
    if (req.session.login) {
        return res.redirect("/products");
    }
 
    res.render("login");
 });
 
 // Ruta para el formulario de registro
 router.get("/register", (req, res) => {
    // Verifica si el usuario ya está logueado y redirige a la página de perfil si es así
    if (req.session.login) {
        return res.redirect("/profile");
    }
    res.render("register");
 });
 
 // Ruta para la vista de perfil
 router.get("/profile", (req, res) => {
    // Verifica si el usuario está logueado
    if (!req.session.login) {
        // Redirige al formulario de login si no está logueado
        return res.redirect("/login");
    }
 
    // Renderiza la vista de perfil con los datos del usuario
    res.render("profile", { user: req.session.user });
 });
  
 router.get("/realtimeproducts", authorization(['admin']),  (req, res) => {
    res.render("realtimeproducts");
})


module.exports = router; 
