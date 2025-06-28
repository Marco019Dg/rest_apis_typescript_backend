import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

export const handleInputErrors = (req:Request, res:Response, next:NextFunction):void=> {
     //Validación
     let errors = validationResult(req)
     if (!errors.isEmpty()){
       res.status(400).json({errors: errors.array()}) // Recuperar los mensajes de error en caso de que el usuario los tenga (status(400) se usa cuando se envia un request incorrecto.)
       return;
     }
    next() //Significa pasar a la siguiente función después de haber terminado esta.
};