const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    contact: Number,
    email: String,
    address: String,
    brand: String,
    category: String

});

module.exports = mongoose.model('vendors', productSchema)