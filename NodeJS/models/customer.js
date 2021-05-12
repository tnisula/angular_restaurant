const mongoose = require('mongoose');

var Customer = mongoose.model('Customer', {
    _id: mongoose.Schema.Types.ObjectId,
    CustomerID: { type: Number},
    Name: { type: String }
});

module.exports = { Customer };