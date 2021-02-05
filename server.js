const express = require('express');
const ejs = require('ejs');
const config = require('config');
const port = config.get('app.port')
const bodyParser = require('body-parser')
const app = express();

app.set('view engine', 'ejs');

const { paypalRouter } = require('./routers');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', paypalRouter);

app.listen(port, () => {
    console.log(`Server is started at port ${port}`)
})