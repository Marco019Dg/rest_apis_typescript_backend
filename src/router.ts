import { Router } from "express"; //Router de Express.
import { body, param } from "express-validator"
import { createProduct, getProducts, getProductById, updateProduct, updateAvailability, deleteProduct } from "./handlers/product";
import { handleInputErrors } from "./middleware";

const router = Router();
/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The product name
 *                      example: Television 4k
 *                  price:
 *                      type: number
 *                      description: The product price
 *                      example: 3000
 *                  availability:
 *                      type: boolean
 *                      description: The product availability
 *                      example: true
 */


/**
 * @swagger
 *  /api/productos:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: "#/components/schemas/Product"
 *              
 */
router.get("/", getProducts );

/**
 * @swagger
 *  /api/productos/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *              - Products
 *          description: Return a product based on its unique ID
 *          parameters: 
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200: 
 *                  description: Successful Response
 *                  content:
 *                      application/json:
 *                          schema: 
 *                             $ref: "#/components/schemas/Product"
 *              404:
 *                  description: Not Found
 *              400:
 *                  description: Bad Request - Invalid ID
 */
router.get("/:id", 
    //Validación
    param("id").isInt().withMessage("ID no válido"),
    //Llamada al middleware para comprobar errores.
    handleInputErrors,
    //Llamada a la función que da la respuesta.
    getProductById
 );


/**
 * @swagger
 *  /api/productos:
 *      post:
 *          summary: Creates a new product
 *          tags:
 *               - Products
 *          description: Returns a new record in the database
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Microfono"
 *                              price:
 *                                 type: number
 *                                 example: 2000
 *          responses:
 *                201:
 *                    description: Product created successfully
 *                    content: 
 *                      application/json:
 *                          schema:
 *                          $ref: "#/components/schemas/Product"
 *                400:
 *                    description: Bad Request - Invalid input data
 */  

router.post("/", 
    //Validación
    body("name")
            .notEmpty().withMessage("El nombre de producto no puede ir vacío"),
    body("price")
            .isNumeric().withMessage("Valor no valido")
            .notEmpty().withMessage("El precio de producto no puede ir vacío")
            .custom(value=> value>0).withMessage("Precio vo válido"),
    //Llamada al middleware para comprobar errores.
    handleInputErrors,
    //Llamada a la función.
    createProduct
);


/**
 * @swagger
 *  /api/productos/{id}:
 *   put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Microfono - actualizado"
 *                              price:
 *                                 type: number
 *                                 example: 600
 *                              availability:
 *                                  type: boolean
 *                                  example: false
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                           $ref: "#/components/schemas/Product"
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:  
 *              description: Product Not Found
 *          
 */

router.put("/:id", //PUT hace modificaciones totales con lo que se envie a las base de datos.
     //Validación
     param("id").isInt().withMessage("ID no válido"),
     body("name")
     .notEmpty().withMessage("El nombre de producto no puede ir vacío"),
    body("price")
     .isNumeric().withMessage("Valor no valido")
     .notEmpty().withMessage("El precio de producto no puede ir vacío")
     .custom(value=> value>0).withMessage("Precio no válido"),
     body("availability")
     .isBoolean().withMessage("valor para disponibilidad no válido"),
     //Middleware
     handleInputErrors,
     //LLmada a la función para actualizar.
     updateProduct
 );

/**
 * @swagger
 *  /api/productos/{id}:
 *   patch:
 *      summary: Update Product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters: 
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *              type: integer  
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                           $ref: "#/components/schemas/Product"
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:  
 *              description: Product Not Found 
 */

router.patch("/:id", 
    param("id").isInt().withMessage("ID no válido"),
    handleInputErrors,
    updateAvailability);


    /**
 * @swagger
 *  /api/productos/{id}:
 *   delete:
 *      summary: Deletes a product by a given ID 
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters: 
 *          - in: path
 *            name: id
 *            description: The ID of the product to delete
 *            required: true
 *            schema:
 *              type: integer  
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: "Producto eliminado"
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:  
 *              description: Product Not Found 
 */




router.delete("/:id", 
    param("id").isInt().withMessage("ID no válido"),
    handleInputErrors,
    deleteProduct
);

export default router; 