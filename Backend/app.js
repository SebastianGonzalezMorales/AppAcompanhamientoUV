const express = require('express');
const app = express();
const boddyParser = require('body-parser');
const morgan = require('morgan')
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');
const favicon = require('serve-favicon');

require('dotenv/config');
const authJwt = require('./middlewares/jwt');
const errorHandler = require('./helpers/error-handler')

app.use(cors());
app.options('*', cors());

//middleware
app.use(favicon(path.join(__dirname, 'public', 'icon.png')));
app.use(boddyParser.json());
app.use(morgan('tiny'));
app.use(authJwt);
app.use(errorHandler);

//Routers
const tipsRoutes = require('./routes/tips');
const moodStateRoutes = require('./routes/moodState');
const usersRoutes = require('./routes/users');
//const authJwt = require('./helpers/jwt');

const api = process.env.API_URL;

app.use(`${api}/tips`, tipsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/moodState`, moodStateRoutes);

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'my-app'
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000, ()=>{
    console.log(api);
    console.log('Server is running http://localhost:3000');
})