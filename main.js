const fs = require("fs")
const express = require('express');
const handlebars = require('express-handlebars');
const Contenedor  = require('./Productos.js');
const productos = new Contenedor(__dirname + '/productos.json')
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require('socket.io')

const app = express();
const PORT = process.env.PORT || 8080
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const fileName = "./mensajes.txt"

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));


const server = httpServer.listen(PORT, async () => {
    console.log(`Servidor Corriendo en el puerto: ${server.address().port}`)
});

server.on('error', function (e) {
    console.log('Error al conectar con el servidor');  
    console.log(e);  
});

//handlebars

app.engine('handlebars', handlebars.engine())
app.set('views', './public')
app.set('view engine', 'handlebars')

app.get("/", (req, res) => {
    let productList = productos.getAll()
    let messages = getMessages()
    res.render('index', {productList, messages})
})

io.on('connection', (socket) => {
    // Se ejecuta una sola vez, cuando se conecta
    // el cliente
    let now = new Date().toLocaleTimeString();
    console.log("--------------------------")
    console.log(`[${now}] Se abrió una nueva conexión !!`)
    
    // Cada vez que llega un mensaje al evento 'diego'
    socket.on("newProduct", product => {
        id =  productos.post(product)
        if(id){
            product.id = id
            io.sockets.emit("newProduct", product)
        }
        else{
            io.sockets.emit("error")
        }
        
    })
    socket.on("newMessage", message => {
            message.date =  new Date().toLocaleString() 
            let newMessage = `<span id="email">${message.email}</span><span id="date">[${message.date}]</span><span id="data">: ${message.data}</span><br>`
            createMessage(message);
            
            io.sockets.emit("newMessage", newMessage)       
    })

})
function createMessage(newMessage){
    let newMessageArray = getMessages()
    newMessageArray.push(newMessage)
    fs.writeFileSync(fileName, JSON.stringify(newMessageArray, null, 2))
}
function getMessages() {
    try {
        let products = fs.readFileSync(fileName, 'utf-8')
        return JSON.parse(products)
    }
    catch (e) {
        console.error(e)
        return null
    }
}
