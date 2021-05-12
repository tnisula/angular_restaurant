const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db.js');

var employeeController = require('./controllers/employeeController.js');
var customerController = require('./controllers/customerController.js');
var itemController = require('./controllers/itemController.js');
var orderController = require('./controllers/orderController.js');
var orderItemController = require('./controllers/orderItemController.js');

var app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.listen(3001, () => console.log('Server started at port : 3001'));

app.use('/employees', employeeController);
app.use('/customers', customerController);
app.use('/items', itemController);
app.use('/orders', orderController);
app.use('/orderitems', orderItemController);