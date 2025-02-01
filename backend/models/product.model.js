const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    code: Number,
    price: Number,
    brand: String,
    category: String,
});

module.exports = mongoose.model('products', productSchema);

