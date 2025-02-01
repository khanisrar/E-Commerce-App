const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const UserModel = require('../models/user.model')

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
        res.status(409)
            .json({ message: "email already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
        name: name,
        email: email,
        password: hashedPassword, // Store the hashed password
    });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, "mongdhodhri", {
        expiresIn: 1000 * 60 * 60,
    });
    res.status(201)
        .json({ message: "User registered successfully", token: token, success: true, name: user.name });

})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
        return res.status(400)
            .json({ message: "email do not exist", success: false });
    }
    const realPassword = existingUser.password;
    const isPasswordCorrect = await bcrypt.compare(
        password,
        realPassword
    );

    if (!isPasswordCorrect) {
        return res.status(400)
            .json({ message: "password do not match", success: false });
    }
    const token = jwt.sign({ id: existingUser._id }, "mongdhodhri-secret-key", {
        expiresIn: 1000 * 60 * 60,
    });
    res.status(201).json({ message: "User registered successfully", token: token, success: true, name: existingUser.name });

})
module.exports = router;