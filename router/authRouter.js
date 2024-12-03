const express = require('express');
const { body } = require('express-validator');
const authController = require('../controller/authController');
const multer = require('multer');
const auth= require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signup', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], authController.signup);

router.get('/verify/:token', authController.verifyEmail);

router.post('/login', [
    body('email').isEmail(),
    body('password').not().isEmpty()
], authController.login);

router.get('/profile', auth, authController.getProfile);

router.put('/profile', auth, upload.single('profilePicture'), authController.editProfile);

module.exports = router;
