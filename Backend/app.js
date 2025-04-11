const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // Corrección del nombre
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');
const dotenv = require('dotenv');
const chalk = require('chalk'); // Librería para colores en consola

// Solo carga archivos .env si NO estás en producción
if (process.env.NODE_ENV !== 'production') {
  const env = process.env.NODE_ENV || 'development';
  const envPath = path.resolve(__dirname, `.env.${env}`);
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    // Si no se encuentra el archivo .env correspondiente, se muestra una advertencia
    console.warn(chalk.red(`No se encontró el archivo .env para el entorno: ${env}.`), result.error);
  } else {
    console.log(chalk.green(` `));
  }
  
} else {
  // En producción, Heroku gestiona las variables de entorno
  console.log(''); // línea en blanco para espaciar
  console.log(chalk.blue('=== Entorno de producción detectado ==='));
  console.log(chalk.blue('Usando variables configuradas en Heroku.'));
  console.log(''); // línea en blanco final
}
// Unificar BASE_URL para usar solo una en el resto de la aplicación
process.env.BASE_URL = process.env.NODE_ENV === 'production'
? process.env.BASE_URL_PROD
: process.env.BASE_URL_DEV;

// Importar middlewares personalizados
const authJwt = require('./middlewares/jwt');
const errorHandler = require('./helpers/error-handler');

// Configuración global de middlewares
app.use(cors()); // Habilitar CORS para todas las solicitudes
app.options('*', cors()); // Habilitar preflight para solicitudes CORS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir favicon desde la carpeta pública
app.use(favicon(path.join(__dirname, 'public', 'Icon_Application_Blue.png')));

// Middleware para parsear JSON en las solicitudes
app.use(bodyParser.json());

// Middleware para registrar solicitudes HTTP en la consola
app.use(morgan('tiny'));

// Middleware de autenticación (JWT)
app.use(authJwt);

// Middleware para manejar errores globales
app.use(errorHandler);

// Exponer la carpeta "uploads" como pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar y registrar todas las rutas de la aplicación
const routes = require('./routes');
routes(app);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('<h1> Funcionando </h1>');
});

// Exponer carpeta "public"
app.use('/public', express.static(path.join(__dirname, 'public')));

// Ajustar strictQuery (nueva configuración de Mongoose)
mongoose.set('strictQuery', false);

// Verifica que la variable de entorno CONNECTION_STRING esté definida.
// Si no lo está, lanza un error para evitar intentar conectarse sin una cadena de conexión válida.
if (!process.env.CONNECTION_STRING) {
  throw new Error("La cadena de conexión a la base de datos (CONNECTION_STRING) no está definida en las variables de entorno");
}

// Conectar a la base de datos MongoDB
mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: 'my-app', // Nombre de la base de datos
  })
  .then(() => {
    // Añadimos un salto de línea antes para separar de la configuración previa
    console.log('');
    console.log(chalk.green('✅ Conexión a la base de datos lista...'));
  })
  .catch((err) => {
    console.error(chalk.red('Error al conectar con la base de datos:'), err);
  });

// Configurar el puerto y arrancar el servidor
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  // Título/Separador
  console.log(chalk.magenta.bold('========================================'));
  console.log(
    chalk.bold('🔧 Archivo .env cargado para el entorno:'),
    chalk.yellow(`${process.env.NODE_ENV}`)
  );
  console.log(chalk.magenta.bold('========================================'));

  // Variables de entorno cargadas
  console.log(chalk.cyan('---------------------------------'));
  console.log(chalk.cyan.bold('🔑 Variables de entorno cargadas:'));
  console.log(chalk.cyan('---------------------------------'));
  console.log(' '); // Espacio adicional
  console.log(chalk.white('API_URL:'.padEnd(22)), chalk.green(process.env.API_URL));
  console.log(chalk.white('JWT SECRET:'.padEnd(22)), chalk.green(process.env.SECRET?.slice(0, 70) + '...'));
  console.log(chalk.white('CONNECTION_STRING:'.padEnd(22)), chalk.green(process.env.CONNECTION_STRING?.slice(0, 70) + '...'));
  console.log(chalk.white('...'));
  console.log(chalk.white('..'));
  console.log(chalk.white('.'));
  console.log(' '); // Espacio adicional
    // Información del servidor
  console.log(chalk.blue.bold('SERVIDOR CORRIENDO EN:'.padEnd(22)), chalk.blue(`http://localhost:${PORT}`));

});

// Manejo de cierre de la aplicación
process.on('SIGINT', () => {
  server.close(() => {

    console.log('');
    console.log(chalk.yellow.bold('===================================='));
    console.log(chalk.yellow.bold('PROCESO TERMINADO. SERVIDOR CERRADO.'));
    console.log(chalk.yellow.bold('===================================='));
    process.exit(0);
  });
});
