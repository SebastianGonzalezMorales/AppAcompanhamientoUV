const { expressjwt: jwt } = require("express-jwt");

const secret = process.env.SECRET;
const api = process.env.API_URL;
const baseUrl = process.env.BASE_URL;

if (!secret) {
    throw new Error("La clave secreta JWT no está definida en las variables de entorno");
}

if (!api) {
    throw new Error("La URL de la API no está definida en las variables de entorno");
}

if (!baseUrl) {
    throw new Error("La URL base no está definida en las variables de entorno");
}

// Verifica que las variables se están cargando
//console.log("JWT Secret:", process.env.SECRET); 
//console.log("API URL:", process.env.API_URL);


const authJwt = jwt({
    secret: secret,
    algorithms: ["HS256"],
    isRevoked: async (req, token) => undefined
}).unless({
    path: [
        // **Rutas de Autenticación (`/auth`)**
        `${api}/auth/login`,        // Login de usuarios
        `${api}/auth/register`,     // Registro de nuevos usuarios
        `${api}/auth/logout`,       // Cierre de sesión
        `${api}/auth/verificar`, // Verificación de nuevo usuario creado

        // **Rutas de Recuperación y Restablecimiento de Contraseñas (`/password`)**
        `${api}/password/forgot-password`,        // Solicitud de recuperación de contraseña
        `${api}/password/verify-reset-token`,     // Verificación del token de restablecimiento
        `${api}/password/change-password`,        // Cambio de contraseña
        `${api}/password/getReset-PasswordToken`, // Obtener token de restablecimiento
        `${api}/password/verifytoken`,            // Verificación general de token

        // **Rutas de Verificación y Decodificación de Tokens (`/tokens`)**
        `${api}/tokens/decodetoken`, // Decodificación de tokens
      
        `${baseUrl}/public/Icon_Application_Blue.png`,
        { url: '/public/Icon_Application_Blue.png', methods: ['GET'] },
        
        { 
            url: new RegExp(`${api}/user-management/[^/]+/accept-policy`), 
            methods: ['POST', 'OPTIONS'] 
        }, // Aceptación de políticas por usuario
        
        // **Otras Rutas Públicas**
        `/`,                         // Ruta raíz
        `${api}/phraseOfTheDay`,     // Obtener la frase del día


    ]
});

async function isRevoked(req, token) {
  if(!token.payload.isAdmin) {
       return true
   }
    return undefined;
}

module.exports = authJwt;
