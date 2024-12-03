const Product = require('../model/productModel');
const Category = require('../model/categoryModel');
const { validationResult } = require('express-validator');

exports.addProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()});

    const { name, price, category, stock } = req.body;
    const product = new Product({ name, price, category, stock });
    await product.save();
    res.status(201).json(product);
};

exports.editProduct = async (req, res) => {
    const { name, price, category, stock } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { name, price, category, stock }, 
        { new: true });
    res.json(product);

};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
};

exports.listProducts = async (req, res) => {
    const products = await Product.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        }
    ]);
    res.json(products);
};

exports.listLowStockProducts = async (req, res) => {
    const products = await Product.find({ stock: { $lt: 1 } });
    res.json(products);
};

exports.sendProductsEmail = async (req, res) => {
    const { email } = req.body;
    const products = await Product.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        }
    ]);

    const table = `
        <table border="1">
            <tr><th>Name</th><th>Price</th><th>Category</th><th>Stock</th></tr>
            ${products.map(p => `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.price}</td>
                    <td>${p.category.name}</td>
                    <td>${p.stock}</td>
                </tr>
            `).join('')}
        </table>
    `;

    await transporter.sendMail({
        to: email,
        subject: 'Product List',
        html: table
    });

    res.send('Product list sent to email.');
};
