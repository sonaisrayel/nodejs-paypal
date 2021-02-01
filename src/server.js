const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const config = require('config')
const port = config.get('APP.PORT')
const app = express();


app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index')
})
app.listen(port, () => {
    console.log(`Server is started at port ${port}`)
})