const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createSendToken } = require("../helpers/auth");
const { User } = require("../models");

exports.current = async (req, res) => {
    try {
        let token = String(req.headers.authorization);
        token = token.replace("Bearer ", "");

        // const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return res.status(401).json({ error: "unauthorized" });

        User.findById(decoded.id)
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ error: "user not found" });
                }
                user.password = undefined;
                res.status(200).json({
                    user,
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
};

exports.signup = async (req, res) => {
    try {
        console.log(req.body);
        const { firstName, lastName, password, username, email, bio, role } =
            req.body;

        if (
            !firstName ||
            !lastName ||
            !password ||
            !username ||
            !email ||
            !bio ||
            !role
        ) {
            return res.status(400).json({ error: "missing parameters" });
        }

        User.find({
            email,
        })
            .then((user) => {
                if (user.length >= 1) {
                    return res
                        .status(409)
                        .json({ error: "email already exists" });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
            });

        let payload = {
            firstName,
            lastName,
            password,
            username,
            email,
            bio,
            role,
        };

        const newUser = User.create(payload);

        return createSendToken(newUser, req, res);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.json({ error: "email and password are required." });

        const user = await User.find({ email });
        if (user.length < 1)
            return res.status(401).json({ error: "incorrect email." });

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user[0].password
        );
        if (!isPasswordCorrect)
            return res.status(401).json({ error: "incorrect password." });
        return createSendToken(user[0], req, res);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" });
    }
};


const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.createSendToken = (user, req, res) => {
    const jwtToken = this.signToken(user._id);

    user.password = undefined;

    return res.status(201).json({
        user,
        token: jwtToken,
    });
};

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            error: "You are not logged in! Please log in to get access.",
        });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return res.status(401).json({
            error: "The user belonging to this token does no longer exist.",
        });
    }

    req.user = currentUser;
    next();
};