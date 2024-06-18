const express = require("express");
const app = express(); 
const exphbs = require("express-handlebars");
const session = require("express-session");
const socket = require("socket.io");
const ProductManager = require("./controllers/product-manager.js"); 
require("./database.js");
const passport = require("passport")
const initializePassport = require("./config/passport.config.js")
const MongoStore = require("connect-mongo")
const config = require("./config/config.js");
const PUERTO = config.port;

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionRouter = require("./routes/session.router.js");
const userRouter = require("./routes/user.router.js");



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));
app.use(session({
    secret:config.sessionSecret,
    resave: true,
    saveUninitialized : true, 
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://tomaspetrovich:Vectra891@cluster0.yrqumy1.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    }),   
}))
app.use(passport.initialize());
app.use(passport.session());
initializePassport(); 


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);



const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})


const SocketManager = require("./socket/socketmanager.js");
new SocketManager(httpServer);