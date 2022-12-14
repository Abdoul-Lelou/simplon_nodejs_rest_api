const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
require('dotenv').config();

var cors = require('cors')

const routes = require('./routes/routes');

const databaseLink = process.env.DATABASE_URL

mongoose.connect(databaseLink,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
       // console.log('connected')
    });
const database = mongoose.connection

const app = express();
app.use(cors({origin: '*'}));
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", " http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
});
app.use(express.json());

//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

app.use('/api', routes)


database.on('error', (error) => {
   // console.log(error)
})

database.once('connected', () => {
   // console.log('Database Connected');
})

app.listen(3001, () => {
   // console.log(`Server Started at ${3000}`)
})
