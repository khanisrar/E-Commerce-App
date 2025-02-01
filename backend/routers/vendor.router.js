const express = require('express');
const router = express.Router();

const VendorModel = require('../models/vendor.model');

router.post('/addVendor', async (req, res) => {
    const { name, contact, address, email, brand, category } = req.body;

    const addVendor = new VendorModel({
        name: name,
        contact: contact,
        email: email,
        address: address,
        brand: brand,
        category: category

    });

    const vendor = await addVendor.save();

    res.status(200)
        .json(vendor);


});

router.get('/getVendor', async (req, res) => {
    try {
        let vendorList = await VendorModel.find();

        if (vendorList.length > 0) {
            res.send(vendorList);
        } else {
            res.send("Vendor Not Found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;