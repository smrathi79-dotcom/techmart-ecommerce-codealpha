const Product = require('../models/productModel');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, price, description, image, category, countInStock } = req.body;

        const product = new Product({
            name,
            price,
            description,
            image,
            category,
            countInStock,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, createProduct };