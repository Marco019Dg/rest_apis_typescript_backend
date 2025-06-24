import { connectDB } from "../server"
import db from "../config/db"


jest.mock("../config/db") // Creación del Mock para forzar error en la conección a la BD

describe("connectDB",()=>{
    it("should handle database connection error", async()=>{
        jest.spyOn(db, "authenticate") //Crea una función con 2 parámetros: 1)Lo que se espia 2)Función/método a revisar
            .mockRejectedValueOnce(new Error("Error al tratar de conectarse a la base de datos")) //Método para forzar el error.
        const consoleSpy = jest.spyOn(console, "log") // Espera a que aparezca el error del catch

        await connectDB() //Hace la conexión, donde el espia ya estará listo para observar la linea: db.authenticate()
        expect(consoleSpy).toHaveBeenCalledWith( //Espera que el consoleSpy(el console.log del error) tenga el string mencionado a continuación.
            expect.stringContaining("Error al tratar de conectarse a la base de datos")//Espera que contenga cierto texto, en este caso, el de error del catch.
        )
    })
})

// describe("Tests de lógica", ()=>{
//     it("Comprueba que 10 es mayor a 9", ()=>{
//         expect(10>9).toBe(true)
//     })
//     it("Comprueba que 100/2 es 50", ()=>{
//         expect(100/2).toBe(50)
//     })
//     it("Comprueba que 22 + 5 no es 12", ()=>{
//         expect(22+5).not.toBe(22)
//     })
// });