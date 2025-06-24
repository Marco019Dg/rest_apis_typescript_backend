import server from "./server";
import colors from "colors"; //Personaliza con colores los mensajes.


const port = process.env.PORT || 4000 // La variable de entorno:process.env.PORT es dada por el servidor para asignar el puerto a usar una vez hecho el deployment. 


server.listen(port, ()=>{
    console.log(colors.yellow(`Rest API en el puerto ${port}`));
    }
)

