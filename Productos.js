const fs = require("fs")

class Productos {
    constructor(fileName) {
        this.fileName = fileName;
        this.list = [];
        this.id = 0;
        this.init()
    }

    init() {
        try {
            let productos = fs.readFileSync(this.fileName, 'utf-8')
            this.list = JSON.parse(productos)
            if (this.list.length > 0)
                this.id = this.list[this.list.length - 1].id + 1;
        }
        catch (e) {
            console.error(e)
            this.list = []
        }
    }

    post(product) {
        if (this.list) {
            if (this.list.length) {
                product.id = this.list[this.list.length - 1].id + 1
            }
            else {
                product.id = 1
                this.list = []
            }
            product.price = +product.price
            this.list.push(product)
            try {
                fs.writeFileSync(this.fileName, JSON.stringify(this.list, null, 2))
                console.log("Se guardo el producto con exito")
                return product.id
            } catch (error) {
                console.error(error)
                return null
            }
        }
        else {
            console.error("No se pudo traer los productos")
            return null
        }
    }

    async update(id, producto) {
        if (producto) {
            let index = this.list.findIndex(producto => producto.id == id);
            if (index != -1) {
                this.list[index] = producto;
                fs.writeFileSync(this.fileName, JSON.stringify(this.list, null, 2))
                console.log(`Se actualizo correctamente el producto con id: ${id}`)
                return {message: `Se actualizo correctamente el producto con id: ${id}`}
            }
            else {
                console.log(`No existe el producto con id: ${id}`)
                return {error: `No existe el producto con id: ${id}`}
            }
        }
        else {
            console.log(`El archivo está vacio`)
            return {error: `El archivo está vacio`}
        }
    }

    getById(id) {
        if (this.list.length) {
            let product = this.list.find(producto => producto.id == id)
            if (product) {
                console.log(product)
                return product;
            }
            else {
                console.log(`No existe el producto con id: ${id}`)
                return { error: `No existe el producto con id: ${id}` }
            }
        }
        else {
            console.log(`El archivo está vacio`)
            return { error: `El archivo está vacio` }
        }
    }

    getAll() {
        if (this.list.length > 0) {
            return this.list;
        } else {
            return { error: 'El archivo está vacio' }
        }
    }

    async deleteById(id) {
        if (this.list.length) {
            let index = this.list.findIndex(producto => producto.id == id);
            if (index != -1) {
                this.list.splice(index, 1);
                fs.writeFileSync(this.fileName, JSON.stringify(this.list, null, 2))
                console.log(`Se borro correctamente el producto con id: ${id}`)
                return {message: `Se borro correctamente el producto con id: ${id}`}
            }
            else {
                console.log(`No existe el producto con id: ${id}`)
                return {error: `No existe el producto con id: ${id}`}
            }
        }
        else {
            console.log(`El archivo está vacio`)
            return {error: `El archivo está vacio`}
        }
    }
    deleteAll() {
        let emptyProductArray = []
        try {
            fs.writeFileSync(this.fileName, JSON.stringify(emptyProductArray, null, 2))
            console.log("Se borraron todos los productos correctamente")
        } catch (error) {
            console.error(error)
        }
    }
}
module.exports = Productos
