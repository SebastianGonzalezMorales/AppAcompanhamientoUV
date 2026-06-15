const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');
const dotenv = require('dotenv');
const chalk = require('chalk');
const listEndpoints = require('express-list-endpoints');

const normalizeBaseUrl = (value) =>
  value ? value.trim().replace(/\/+$/, '') : value;

const normalizeApiUrl = (value) => {
  if (!value) {
    return value;
  }

  const trimmedValue = value.trim().replace(/\/+$/, '');
  return trimmedValue.startsWith('/') ? trimmedValue : `/${trimmedValue}`;
};


// Cargar variables de entorno desde el archivo correspondiente
const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `.env.${env}`);
const fallbackPath = path.resolve(__dirname, `.env`);

let loadedFrom = null;
let result = dotenv.config({ path: envPath });

if (result.error) {
  result = dotenv.config({ path: fallbackPath });
  if (!result.error) {
    loadedFrom = `.env`;
  }
} else {
  loadedFrom = `.env.${env}`;
}

// Mensaje uniforme para cualquier entorno
if (env === 'production') {
  console.log();
  console.log(chalk.blue.bold('==== Entorno de producción detectado ===='));
  console.log(chalk.blue('Usando variables configuradas en el entorno de despliegue.'));
  console.log();
}

console.log(chalk.magenta.bold('====================================='));
console.log(
  chalk.bold('Archivo .env cargado para el entorno:'),
  chalk.yellow(`${env}`) + ' ' + chalk.bold(env === 'production' ? '🚀.' : '🛠️.')
);
console.log(chalk.magenta.bold('====================================='));

// Definir BASE_URL según entorno
process.env.BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.BASE_URL_PROD
  : process.env.BASE_URL_DEV;

process.env.API_URL = normalizeApiUrl(process.env.API_URL);
process.env.BASE_URL_DEV = normalizeBaseUrl(process.env.BASE_URL_DEV);
process.env.BASE_URL_PROD = normalizeBaseUrl(process.env.BASE_URL_PROD);
process.env.BASE_URL = normalizeBaseUrl(process.env.BASE_URL);

// Middlewares personalizados
const authJwt = require('./middlewares/jwt');
const errorHandler = require('./helpers/error-handler');

// Configuración global de middlewares
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public', 'Icon_Application_Blue.png')));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt);

// Rutas públicas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas principales
const routes = require('./routes');
routes(app);

//Lo siguiente me permite ver los endpoint de la Api
// ================= LISTADO DE ENDPOINTS =================
/* 
console.log();
console.log(chalk.blue.bold('📌 ENDPOINTS REGISTRADOS EN LA API'));
console.log(chalk.blue('================================='));

listEndpoints(app).forEach(endpoint => {
  endpoint.methods.forEach(method => {
    console.log(
      chalk.green(method.padEnd(6)),
      chalk.white(endpoint.path)
    );
  });
});

console.log(chalk.blue('================================='));
console.log();
// ========================================================
*/

app.get('/', (req, res) => {
  res.send('<h1> Funcionando ! </h1>');
});

app.use(errorHandler);

mongoose.set('strictQuery', false);

if (!process.env.CONNECTION_STRING) {
  throw new Error("La cadena de conexión a la base de datos (CONNECTION_STRING) no está definida en las variables de entorno");
}

mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: 'AppAcomp-AWS',
  })
  .then(() => {
    console.log();
    console.log(chalk.green('Conexión a la base de datos lista ✅.'));
    console.log();
  })
  .catch((err) => {
    console.error(chalk.red('Error al conectar con la base de datos:'), err);
  });

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(chalk.cyan('---------------------------------'));
  console.log(chalk.cyan.bold('🔑 Variables de entorno cargadas:'));
  console.log(chalk.cyan('---------------------------------'));
  console.log();

  console.log(chalk.white('API_URL:'.padEnd(22)), chalk.green(process.env.API_URL));
  if (process.env.NODE_ENV === 'production') {
    console.log(chalk.white('BASE_URL_PROD:'.padEnd(22)), chalk.green(process.env.BASE_URL_PROD));
  } else {
    console.log(chalk.white('BASE_URL_DEV:'.padEnd(22)), chalk.green(process.env.BASE_URL_DEV));
  }
  console.log(chalk.white('JWT_SECRET:'.padEnd(22)), chalk.green(process.env.SECRET?.slice(0, 50) + '...'));
  console.log(chalk.white('CONNECTION_STRING:'.padEnd(22)), chalk.green(process.env.CONNECTION_STRING?.slice(0, 50) + '...'));
  console.log(chalk.white('EMAIL_USER:'.padEnd(22)), chalk.green(process.env.EMAIL_USER?.slice(0, 10) + '...'));
  console.log(chalk.white('EMAIL_PASS:'.padEnd(22)), chalk.green(process.env.EMAIL_PASS?.slice(0, 10) + '...'));
  console.log(chalk.white('ENCRYPTION_KEY:'.padEnd(22)), chalk.green(process.env.ENCRYPTION_KEY?.slice(0, 50) + '...'));
  console.log(chalk.white('SIGNING_KEY:'.padEnd(22)), chalk.green(process.env.SIGNING_KEY?.slice(0, 50) + '...'));

  console.log();
  console.log(chalk.blue.bold('SERVIDOR CORRIENDO EN:'.padEnd(22)), chalk.blue(`http://localhost:${PORT} 🟢.`));
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log();
    console.log(chalk.yellow.bold('===================================='));
    console.log(chalk.yellow.bold('PROCESO TERMINADO. SERVIDOR CERRADO.'));
    console.log(chalk.yellow.bold('===================================='));
    process.exit(0);
  });
});
