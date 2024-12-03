const Category = require('../model/categoryModel');
const Product = require('../model/productModel');
const { validationResult } = require('express-validator');

exports.addCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
};

exports.listCategories = async (req, res) => {
    const categories = await Category.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'category',
                as: 'products'
            }
        },
        {
            $project: {
                name: 1,
                totalProducts: { $size: '$products' },
                products: '$products'
            }
        }
    ]);
    res.json(categories);
};
