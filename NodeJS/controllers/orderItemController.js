const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { OrderItem } = require('../models/orderitem');
const mongoose = require('mongoose');

// localhost:3000/orderitems/
router.get('/', (req, res) => {
    OrderItem.find((err, docs) => {
        if(!err) { 
            res.send(docs);
            console.log(docs);
        }
        else { console.log('Error in retrieving orderitems : ' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    console.log('GET : ', req.params.id);
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    OrderItem.findById(req.params.id, (err, doc) =>{
        if(!err) {
            console.log('DOC : ', doc);
            res.send(doc); 
        }
        else { console.log('Error in retrieving orderitem : ' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    var orditem = new OrderItem({
        _id: new mongoose.Types.ObjectId(),
        OrderItemID: req.body.OrderItemID,
        OrderID: req.body.OrderID,
        ItemID: req.body.ItemID,
        Quantity: req.body.Quantity,
        ItemName: req.body.ItemName,
        Price: req.body.Price,
        Total: req.body.Total
    });
    // console.log('POST : ', req.body);
    orditem.save((err, doc) => {
        if(!err) { 
            res.send(doc);
            console.log('POST : ', doc);
        }
        else { 
            console.log('Error in saving orderitem : ' + JSON.stringify(err, undefined, 2)); 
        }
    });
});

router.put('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);
    
    var orditem = new OrderItem({
        OrderItemID: req.body.OrderItemID,
        OrderID: req.body.OrderID,
        ItemID: req.body.ItemID,
        Quantity: req.body.Quantity,
        ItemName: req.body.ItemName,
        Price: req.body.Price,
        Total: req.body.Total
    });
    console.log('PUT : ', req.body);
    OrderItem.findByIdAndUpdate(req.params.id, { $set: orditem }, { new: true }, (err, doc) => {
        if(!err) { 
            res.send(doc);
        }
        else { 
            console.log('Error in updating orderitem : ' + JSON.stringify(err, undefined, 2));
            console.log('req.params._id : ', req.params._id);
        }
    });
});

router.delete('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    OrderItem.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err) { 
            res.send(doc);
            console.log(`Deleted record with id : ${req.params.id}`)
        }
        else { console.log('Error in deleting orderitem : ' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;