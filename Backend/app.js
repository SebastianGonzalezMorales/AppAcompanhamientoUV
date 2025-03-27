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
    console.log(chalk.green(`Archivo .env cargado para el entorno: ${env}.`));
  }
} else {
  // En producción, Heroku gestiona las variables de entorno
  console.log(chalk.blue('Entorno de producción detectado. Usando variables configuradas en Heroku.'));
}

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

// Conectar a la base de datos MongoDB
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'my-app', // Nombre de la base de datos
  })
  .then(() => {
    // Añadimos un salto de línea antes para separar de la configuración previa
    console.log('');
    console.log(chalk.green('Conexión a la base de datos lista...'));
  })
  .catch((err) => {
    console.error(chalk.red('Error al conectar con la base de datos:'), err);
  });

// Configurar el puerto y arrancar el servidor
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  // Título/Separador
  console.log(chalk.magenta.bold('===================================='));
  console.log(
    chalk.bold('Archivo .env cargado para el entorno:'),
    chalk.yellow(`${process.env.NODE_ENV}`)
  );
  console.log(chalk.magenta.bold('===================================='));
  console.log(' '); // Espacio adicional

  // Configuración de la API
  console.log(chalk.cyan.bold('Configuración de la API:'));
  console.log(chalk.cyan('-------------------------'));
  console.log(chalk.white('JWT Secret:'), chalk.green(process.env.SECRET));
  console.log(chalk.white('API URL:'), chalk.green(process.env.API_URL));
  console.log(chalk.white('API Base URL:'), chalk.green(process.env.API_URL));
  console.log(' '); // Espacio adicional en lugar del '\n'

  // Información del servidor
  console.log(chalk.blue.bold('Servidor corriendo en:'), chalk.blue(`http://localhost:${PORT}`));

  // Variables de entorno cargadas
  console.log(' ');
  console.log(chalk.cyan.bold('Variables de entorno cargadas:'));
  console.log(chalk.cyan('-------------------------------'));
  console.log(chalk.white('API_URL:'), chalk.green(process.env.API_URL));
  console.log(chalk.white('SECRET:'), chalk.green(process.env.SECRET));
  console.log(chalk.white('CONNECTION_STRING:'), chalk.green(process.env.CONNECTION_STRING));
  console.log(chalk.white('BASE_URL:'), chalk.green(process.env.BASE_URL));
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
