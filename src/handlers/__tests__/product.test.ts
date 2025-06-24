import request from "supertest"
import server from "../../server"
import { application } from "express"
import { json } from "sequelize"

describe("POST /api/productos", ()=>{
    it("should display validation errors", async()=>{
        const response = await request(server).post("/api/productos").send({})
        //Lo que se espera
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(4)
        //Lo que no se espera
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it("should validate that the price is greater than 0", async()=>{
        const response = await request(server).post("/api/productos").send(
            {
                name:"Radio - test",
                price:0
            }
        )
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it("should validate that the price is a number and greater than 0", async()=>{
        const response = await request(server).post("/api/productos").send(
            {
                name:"Radio - test",
                price:"hola"
            }
        )
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    it("should create a new product", async()=>{
        const response = await request(server).post("/api/productos").send( 
            {
                name:"Tablet - Testing",
                price:4000
            })
        //Lo que se espera
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("data") //toHaveProperty es para verificar que tenga cierta propiedad en algún lugar.
        //Lo que no se espera
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("errors")
    })
})
//send es la información que se quiere pasar al endpoint

describe("GET /api/productos", ()=>{

    it("should check if api/products url exists", async()=>{
        const response = await request(server).get("/api/productos")
        expect(response.status).not.toBe(404)
    })

    it("GET a JSON response with products", async()=>{
        const  response = await request(server).get("/api/productos")
        //Lo que se espera
        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveLength(1)
        //Lo que no se espera
        expect(response.body).not.toHaveProperty("errors")
    })
})

describe("GET /api/productos/:id", ()=>{
    it("should return a 404 response for a non-existent product", async()=>{
        const productId = 2000
        const response = await request(server).get(`/api/productos/${productId}`) 
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Producto no encontrado")
    })

    it("should check a valid ID in the URL", async()=>{
        const response = await request(server).get("/api/productos/no-valid-url") 
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("ID no válido")
    })

    it("get a JSON response for a single product", async()=>{
        const response = await request(server).get("/api/productos/1")
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
    })
})

describe("PUT /api/productos/:id" , ()=>{
    it("should check a valid ID in the URL", async()=>{
        const response = await request(server).put("/api/productos/url-not-valid-url").send(
            {
                name:"new Tv",
                price:5700,
                availability:true
            }
        )
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("ID no válido")
    })

    it("should display validation error messages when updating a product", async()=>{
        const response = await request(server).put("/api/productos/1").send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toBeTruthy() // toBeTruthy evalúa que hay algo, en este caso evalua si hay algo dentro de errors.
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should validate that the price is greater than 0", async()=>{
        const response = await request(server).put("/api/productos/1").send(
        {
            name:"New Tv",
            availability: true,
            price: -1000
        })
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeTruthy() // toBeTruthy evalúa que hay algo, en este caso evalua si hay algo dentro de errors.
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Precio no válido")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })


    it("should return a 404 response for a non-existent product", async()=>{
        const productId = 4000
        const response = await request(server).put(`/api/productos/${productId}`).send(
        {
            name:"Radio",
            availability: true,
            price: 1000
        })
        expect(response.status).toBe(404)
        expect(response.body.error).toBe("No se encontro el producto")
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should update an existing product with valid data", async()=>{
        const response = await request(server).put("/api/productos/1").send(
        {
            name:"Radio",
            availability: true,
            price: 1000
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("errors")
    })  
})

describe("PATCH /api/productos/:id", ()=>{
    it("should return a 404 response for a non-existing product", async()=>{
        const productId = 2000
        const response = await request(server).patch(`/api/productos/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe("No se encontro el producto")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should update the product availability", async()=>{
        const response = await request(server).patch("/api/productos/1")
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("error")
    })
})

describe("DELETE /api/products/:id", ()=>{
    it("should check a valid ID", async()=>{
        const response = await request(server).delete("/api/productos/no-valid-url")
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors[0].msg).toBe("ID no válido")
    })

    it("should return a 404 response for a non-existent product", async()=>{
        const productId = 8000
        const response = await request(server).delete(`/api/productos/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe("No se encontro el producto")

        expect(response.status).not.toBe(200)

    })

    it("should delete a product", async()=>{
        const response = await request(server).delete("/api/productos/1")
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Producto eliminado")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })


})