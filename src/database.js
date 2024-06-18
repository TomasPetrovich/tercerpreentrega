const mongoose = require("mongoose");
const config = require("./config/config.js");

mongoose.connect(config.mongoURI)
.then(() => console.log("Conexion exitosa"))
.catch((error) => console.log("Error en la conexion", error));
//"mongodb+srv://tomaspetrovich:Vectra891@cluster0.yrqumy1.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0"
