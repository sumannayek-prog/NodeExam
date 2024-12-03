const User = require('../model/usermodel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');



const transporter = nodemailer.createTransport({ 
    service: "gmail",
    auth: {
        user:"sumannayek172@gmail.com",
        pass: "bmie gfdk fagn tiok",
    },});

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, 'jwt_secret', { expiresIn: '1h' });

    const user = new User({
        email,
        password: hashedPassword,
        verificationToken: token
    });

    await user.save();

    await transporter.sendMail({
        to: email,
        subject: 'Verify account',
        html: `<a href="http://localhost:5000/api/auth/verify/${token}">Verify Email</a>`
    });

    res.status(201).send('User registered. Please check your email for verification.');
};


exports.verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, 'jwt_secret');
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(400).send('Invalid token.');

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.send('Email verified successfully.');
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send('Invalid credentials or email not verified.');
    }

    const token = jwt.sign({ userId: user._id }, 'jwt_secret');
    res.json({ token });
};

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.userId);
    res.json(user);
};

exports.editProfile = async (req, res) => {
    const { profilePicture } = req.file || {};
    const updates = { ...req.body };
    if (profilePicture) updates.profilePicture = profilePicture.path;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
    res.json(user);
};

