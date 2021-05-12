const mongoose = require('mongoose');

var Order = mongoose.model('Order', {
    _id: mongoose.Schema.Types.ObjectId,
    OrderID: { type: Number},
    OrderNo: { type: String },
    CustomerID: { type: Number},
    PMethod: { type: String },
    GTotal: { type: Number},
    DeletedOrderItemIDs: { type: String }
});

module.exports = { Order };