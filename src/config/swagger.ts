import swaggerJSDoc from "swagger-jsdoc"
import { SwaggerOptions } from "swagger-ui-express";

const options:swaggerJSDoc.Options = {
    swaggerDefinition:{
        openapi:"3.0.2",
        tags:[
            {
                name:"Products",
                description: "API operations related to products"
            }
        ],
        info:{
            title: "REST API Node.js/Express/TypeScript",
            version:"1.0.0",
            description:"API Docs for products"
        }
    },
    apis:["./src/router.ts"] // Dirección de los Endpoints a documentar.
};

const swaggerSpec = swaggerJSDoc(options); 

const swaggerUiOptions:SwaggerOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url("https://i.postimg.cc/kGtgLty5/logo.webp");
            height: 120px;
            width: auto;
        }
        .swagger-ui .topbar{
	        background-color: #11d6dd;
        }
    `,
    customSiteTitle: "Documentación REST API Express /  TypeScript"
} // Para cambiar el logo,el color del head y el titulo de la documentación en Swagger




export default swaggerSpec
export {
    swaggerUiOptions
}