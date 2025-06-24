import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv"; //Metodo para usar variables de entorno.


dotenv.config(); //Llamado a las variables de entorno de dotenv.


const db = new Sequelize(process.env.DATABASE_URL!,{
    models:[__dirname + "/../models/**/*"],
    logging:false //Para no enviar nada a la consola.
}); //Url de base de datos creada en render.(El signo es para garantizar su type)

export default db; 