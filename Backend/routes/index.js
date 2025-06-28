// Importar todas las rutas específicas

const phraseOfTheDayRoutes = require("./phraseOfTheDay");
const moodStateRoutes = require("./moodState");
//const usersRoutes = require('./users');
const questionRoutes = require("./questions");
const resultsTestsRoutes = require("./resultsTests");

const testsRoutes = require("./tests");

const tipsRoutes = require("./tips");
const assistantRoutes = require("./assistant");

const authRoutes = require("./auth");
const passwordRoutes = require("./password");
const tokenRoutes = require("./token");
const userRoutes = require("./user");

module.exports = (app) => {
  const api = process.env.API_URL;

  // Registrar las rutas con sus respectivos prefijos
  app.use(`${api}/assistants`, assistantRoutes);
  app.use(`${api}/tips`, tipsRoutes);
  app.use(`${api}/phraseOfTheDay`, phraseOfTheDayRoutes);
  //app.use(`${api}/users`, usersRoutes);
  app.use(`${api}/moodState`, moodStateRoutes);
  app.use(`${api}/questions`, questionRoutes);
  app.use(`${api}/resultsTests`, resultsTestsRoutes);
  app.use(`${api}/tests`, testsRoutes);

  // Registrar las nuevas rutas relacionadas con usuarios
  app.use(`${api}/auth`, authRoutes); // Autenticación (login, registro, logout)
  app.use(`${api}/password`, passwordRoutes); // Recuperación y restablecimiento de contraseñas
  app.use(`${api}/tokens`, tokenRoutes); // Verificación y decodificación de tokens
  app.use(`${api}/user-management`, userRoutes); // Gestión de usuarios

  // app.use(`${api}/users`, usersRoutes);
};
