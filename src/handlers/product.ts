import {Request, Response} from "express"
import Product from "../models/Product.model"

export const getProducts = async (req: Request, res:Response)=>{
    const products = await Product.findAll({
        order:[
            ["price","ASC"]
        ]
        //attributes:{exclude:["createdAt","updatedAt","availability"]} //Excluir propiedades especificas.
        //limit: 2 //Solo mostarará el número de registros especificado. 
    })//Recupera todos los productos registrados en la base de datos.
    res.json({data:products})
};

export const getProductById = async (req: Request, res:Response)=>{
    try{
        const {id} = req.params
        const product = await Product.findByPk(id)
        if(!product){
            res.status(404).json({ //(404) es el código cuando algo no se encuentra.
                error:"Producto no encontrado"
            })
        }
        res.json({data:product})
    }
    catch(error){
        // console.log(error)
    }
};


export const createProduct = async (req:Request, res:Response)=>{
     //"create" (CREAR LA INSTANCIA Y lA GUARDAR EN LA BASE DE DATOS) 
     try{
        const product = await Product.create(req.body)
        res.status(201).json({data:product}) //201 es el status para la creación de un elemento
     /* OTRA FORMA DE HACERLO
     const product = new Product(req.body) //Llama al .json (que esta en el body) que se esta dando como producto nuevo y lo crea como object.
     const savedProduct = await product.save() // Guarda el resultado de la inserción del producto en la base de datos.
     res.send({data: savedProduct}); */
     }
     catch(error){
        console.log(error)
     }
   
}; 

export const updateProduct = async (req:Request, res:Response)=>{
       try{
            const {id} = req.params
            const product = await Product.findByPk(id)
            if(!product){
                res.status(404).json({
                    error:"No se encontro el producto"
                })
            }
            //Actualizar
            await product.update(req.body) //update solo hace modificaciones parciales.
            //Guardar
            await product.save()

            res.json({data:product})
       }
       catch(error){
        // res.status(500).json({ message: error.message });
       }
};


export const updateAvailability = async (req:Request, res:Response)=>{
      try{
        const {id} = req.params
        const product = await Product.findByPk(id)
        if(!product){
            res.status(404).json({
                error:"No se encontro el producto"
            })
        }
        //Actualizar
        product.availability = !product.dataValues.availability //dataValues es un Método para leer los valores.
        //Guardar
        await product.save()
        res.json({data:product})
      }
      catch(error){

      }
};


export const deleteProduct = async(req:Request , res:Response)=>{
    try{
        const {id} = req.params
        const product = await Product.findByPk(id)
        if(!product){
            res.status(404).json({
                 error:"No se encontro el producto"
            })
         }
        await product.destroy() //destroy elimina el elemento
        res.json({data:"Producto eliminado"})
    }
    catch(error){

    }
}


