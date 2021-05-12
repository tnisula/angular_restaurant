const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { Order } = require('../models/order');
const mongoose = require('mongoose');

// localhost:3000/orders/
router.get('/', (req, res) => {
    Order.find((err, docs) => {
        if(!err) { res.send(docs); }
        else { console.log('Error in retrieving orders : ' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    console.log('GET : ', req.params.id);
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Order.findById(req.params.id, (err, doc) =>{
        if(!err) {
            console.log('DOC : ', doc);
            res.send(doc); 
        }
        else { console.log('Error in retrieving order : ' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    var ord = new Order({
        _id: new mongoose.Types.ObjectId(),
        OrderID: req.body.OrderID,
        OrderNo: req.body.OrderNo,
        CustomerID: req.body.CustomerID,
        PMethod: req.body.PMethod,
        GTotal: req.body.GTotal,
        DeletedOrderItemIDs: ''
    });
    // console.log('POST : ', req.body);
    ord.save((err, doc) => {
        if(!err) { 
            res.send(doc);
            console.log('POST : ', doc);
        }
        else { 
            console.log('Error in saving order : ' + JSON.stringify(err, undefined, 2)); 
        }
    });
});

router.put('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    
    var ord = new Order({
        OrderID: req.body.OrderID,
        OrderNo: req.body.OrderNo,
        CustomerID: req.body.CustomerID,
        PMethod: req.body.PMethod,
        GTotal: req.body.GTotal,
        DeletedOrderItemIDs: '' // req.body.deletedorderitemids
    });    
    Order.findByIdAndUpdate(req.params.id, { $set: ord }, { new: true }, (err, doc) => {
        if(!err) { 
            res.send(doc);
            console.log('PUT : ', doc);
        }
        else { 
            console.log('Error in updating order : ' + JSON.stringify(err, undefined, 2)); 
            console.log('req.params._id : ', req.params._id);
        }
    });
});

router.delete('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Order.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err) { 
            res.send(doc);
            console.log(`Deleted record with id : ${req.params.id}`)
        }
        else { console.log('Error in deleting order : ' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;