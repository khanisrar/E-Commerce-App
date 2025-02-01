const express = require('express');

const router = express.Router();

const ProductModel = require('../models/product.model');

router.post('/addProduct', async (req, res) => {

    const { name, code, price, brand, category } = req.body;

    const addProduct = new ProductModel(
        {
            name: name,
            code: code,
            price: price,
            brand: brand,
            category: category
        }
    )
    const product = await addProduct.save();

    res.status(200)
        .json(product);

});

router.get('/getProduct', async (req, res) => {
    const { searchTerm } = req.query;
    let productList = await ProductModel.find(
        searchTerm ? {
            "$or": [
                { "name": { $regex: new RegExp(searchTerm.toLowerCase(), 'i') } },
                { "brand": { $regex: new RegExp(searchTerm.toLowerCase(), 'i') } }
            ]
        } : {}
    );

    if (productList.length > 0) {
        res.send(productList)
    } else {
        res.send("Product not found");
    }

});

router.delete('/product/:id', async (req, res) => {
    let result = await ProductModel.deleteOne({ _id: req.params.id });
    res.send(result);
});

router.get('/product/:id', async (req, res) => {
    let result = await ProductModel.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    }
    else {
        res.send({ result: "Product not found" });
    }
});

router.put('/product/:id', async (req, res) => {
    let result = await ProductModel.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    res.send(result);
});

router.get('/search/:key', async (req, res) => {
    const lowercaseKey = req.params.key.toLowerCase();
    let data = await ProductModel.find(
        {
            "$or": [
                // { "name": { $regex: req.params.key } },
                // { "brand": { $regex: req.params.key } }
                { "name": { $regex: new RegExp(lowercaseKey, 'i') } },
                { "brand": { $regex: new RegExp(lowercaseKey, 'i') } }

            ]
        }
    )

    res.send(data);

})



module.exports = router;