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

// Mostrar mensaje uniforme para cualquier entorno
if (loadedFrom) {
  console.log();
  console.log(chalk.magenta.bold('========================================'));
  console.log(
    chalk.bold(`${env === 'production' ? '🚀' : '🛠️'} Archivo .env cargado para el entorno:`),
    chalk.yellow(`${env}`)
  );
  console.log(chalk.magenta.bold('========================================'));
} else {
  console.warn(chalk.red(`⚠️ No se encontró ningún archivo .env válido para el entorno: ${env}`));
}

// Definir BASE_URL según entorno
process.env.BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.BASE_URL_PROD
  : process.env.BASE_URL_DEV;

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
app.use(errorHandler);

// Rutas públicas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas principales
const routes = require('./routes');
routes(app);

app.get('/', (req, res) => {
  res.send('<h1> Funcionando </h1>');
});

mongoose.set('strictQuery', false);

if (!process.env.CONNECTION_STRING) {
  throw new Error("La cadena de conexión a la base de datos (CONNECTION_STRING) no está definida en las variables de entorno");
}

mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: 'my-app',
  })
  .then(() => {
    console.log();
    console.log(chalk.green('✅ Conexión a la base de datos lista...'));
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
  console.log(chalk.blue.bold('SERVIDOR CORRIENDO EN:'.padEnd(22)), chalk.blue(`http://localhost:${PORT}`));
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
