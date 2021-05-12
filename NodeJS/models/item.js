const mongoose = require('mongoose');

var Item = mongoose.model('Item', {
    _id: mongoose.Schema.Types.ObjectId,
    ItemID: { type: Number},
    Name: { type: String },
    Price: { type: Number}
});

module.exports = { Item };