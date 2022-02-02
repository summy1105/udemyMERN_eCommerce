import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   Get /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res)=> {
  const product = await Product.find({});

  res.json(product);
})


// @desc    Fetch single product
// @route   Get /api/products/:id
// @access  Public
const getProductById =  asyncHandler(async (req, res) => {
  // objectID의 일정한 format기준이 정해져 있어서
  // 그 기준을 벗어난 값을 넣어주면 database error가 발생
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
}