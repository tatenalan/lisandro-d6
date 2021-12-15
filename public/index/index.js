const socket = io();


socket.on("newProduct", product => {
    $("#table").append(`<tr><th scope="row">${product.id}</th><td>${product.title}</td><td>$${product.price}</td><td><img style="width:50px;" src="${product.thumbnail}" alt=""></td></tr>`)
})
socket.on("newMessage", message => {
    $("#messages").append(message);
    $("#dataInput")[0].value = ""
})
socket.on("error", () => {
    alert("Hubo un error")
})

$("#form-product").submit( e => {
    console.log("caca")
    e.preventDefault();
    createProduct()
})
$("#form-chat").submit( e => {
    console.log("pis")
    e.preventDefault();
    sendMessage()
});

function createProduct() {
    let product = {
        id: 0,
        title: $("#title")[0].value,
        price: $("#price")[0].value,
        thumbnail: $("#thumbnail")[0].value
    }
    socket.emit("newProduct", product);
}
function sendMessage() {
    let message = {
        email: $("#emailInput")[0].value,
        date: "",
        data: $("#dataInput")[0].value
    }
    socket.emit("newMessage", message);
}
