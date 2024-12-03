const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controller/categoryController');
const auth= require('../middleware/auth');

const router = express.Router();

router.post('/', [
    body('name').not().isEmpty()
], auth, categoryController.addCategory);

router.get('/', categoryController.listCategories);

module.exports = router;
