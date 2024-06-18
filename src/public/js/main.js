//Creamos una instancia de socket.io del lado del cliente ahora: 
const socket = io(); 

//Creamos una variable para guardar el usuario: 
let user; 
const chatBox = document.getElementById("chatBox");

//Sweet Alert 2: es una librería que nos permite crear alertas personalizadas. 

//Swal es un objeto global que nos permite usar los métodos de la libreria.  
//Fire es un método que nos permite configurar el alerta.

Swal.fire({
    title: "Identificate", 
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat", 
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar"
    }, 
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})


chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            //trim nos permite sacar los espacios en blanco del principio y del final de un string. 
            //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor. 
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
})

//Listener de Mensajes: 

socket.on("message", data => {
    let log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( message => {
        messages = messages + `${message.user} dice: ${message.message} <br>`
    })

    log.innerHTML = messages;
})

//------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    const btnEnviar = document.getElementById("btnEnviar");

    socket.emit("getAllProducts");

    socket.on("productos", (productos) => {
        contenedorProductos.innerHTML = "";
        productos.forEach((producto) => {
            const divProducto = document.createElement("div");
            divProducto.innerHTML = `
                <h3>${producto.title}</h3>
                <p>${producto.description}</p>
                <p>Precio: $${producto.price}</p>
                <p>Stock: ${producto.stock}</p>
                <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>
            `;
            contenedorProductos.appendChild(divProducto);
        });
    });

    btnEnviar.addEventListener("click", () => {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const img = document.getElementById("img").value;
        const code = document.getElementById("code").value;
        const stock = document.getElementById("stock").value;
        const category = document.getElementById("category").value;
        const status = document.getElementById("status").value;

        const nuevoProducto = { title, description, price, img, code, stock, category, status };
        socket.emit("addProduct", nuevoProducto);
    });
});

function eliminarProducto(id) {
    socket.emit("deleteProduct", id);
}