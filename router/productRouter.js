const express = require('express');
const { body } = require('express-validator');
const productController = require('../controller/productController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/addProduct', [
    body('name').not().isEmpty(),
    body('price').isNumeric(),
    body('category').isMongoId(),
    body('stock').isNumeric()
], auth, productController.addProduct);

router.put('/:id', [
    body('name').optional().not().isEmpty(),
    body('price').optional().isNumeric(),
    body('category').optional().isMongoId(),
    body('stock').optional().isNumeric()
], auth, productController.editProduct);

router.delete('/:id', auth, productController.deleteProduct);

router.get('/', productController.listProducts);

router.get('/low-stock', productController.listLowStockProducts);

router.post('/email', auth, productController.sendProductsEmail);

module.exports = router;
