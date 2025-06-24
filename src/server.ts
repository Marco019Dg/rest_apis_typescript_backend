import express from "express"; //Servidor.
import colors from "colors"; //Personaliza con colores los mensajes.
import cors,{CorsOptions} from "cors" //Controla las peticiones a la API.
import morgan from "morgan"; // Para ver detalles sobre las peticiones a la API
import swaggerUi from "swagger-ui-express" //Otorga la URL para ver la documentación.
import swaggerSpec, {swaggerUiOptions} from "./config/swagger";
import router from "./router"; // Router.
import db from "./config/db"; // Base de datos.

//Conectar a base de datos.
export async function connectDB() {
    try{
        await db.authenticate() // Método para autenticarse a la base de datos.
        db.sync() // Método que va agregando nueva información a la base de datos(en caso de que hubiera).
        // console.log(colors.blue("Conexión exitosa a la base de datos")) 
    }
    catch(error){
        // console.log(error);
        console.log( colors.red("Error al tratar de conectarse a la base de datos") );
    }
}; 

connectDB(); 
//Instancia de express.
const server = express();

//Permitir conexiones
const corsOptions: CorsOptions = {
    origin: function(origin,callback){
            if(origin=== process.env.FRONTEND_URL){
                callback(null,true) // null para decir que no hay errores y true para permitir la conexión.
            }
            else{
                callback( new Error("Error de CORS") )
            }
    }
}
server.use( cors(corsOptions) )

//Leer datos de Formulario.
server.use(express.json()) //.json Permite leer el o los Json, que en este caso será la información enviada.

server.use(morgan("dev"));

server.use("/api/productos", router) // .use engloba todos los verbos HTTP /productos será la url que se crea para acceder.

server.use("/docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec,swaggerUiOptions))

export default server;