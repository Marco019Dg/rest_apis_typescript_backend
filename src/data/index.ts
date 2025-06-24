import {exit} from "node:process" //Detiene la ejecución de un codígo de Node.js
import db from "../config/db"

const clearDB = async()=>{
    try{
        await db.sync({force:true})// "force:true" Elimina todos los datos de la base de datos.
        console.log("Datos eliminados correctamente")
        exit(0) // 0 o vacio significa qur finalizó el prgrama correctamente
    }
    catch(error){
        console.log(error)
        exit(1) //1 significa que finalizó el programa con errores.
    }
}


/*process.argv hace mención al lugar que ocupa un elemento en una línea de codigo ejecutada desde el package.json, en este caso se creo en los scripts el "pretest"(tambien existe el "postest") el cual corre primero cuando se hace el llamado a "npm test", por lo tanto el indice número 2 de pretest deberá coincidir con "--clear" para que corra el código clearDB() que limpia la base de datos*/
if(process.argv[2]==="--clear"){            
    clearDB()
}
//Como resultado tendremos que cada que se ejecute un test y en este se incluya un producto nuevo en la base de datos, antes se borrarán los productos que haya dentro de la base de datos.